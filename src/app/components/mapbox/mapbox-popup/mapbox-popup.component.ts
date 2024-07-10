import { ChangeDetectionStrategy, Component, ElementRef, inject, Input, NgZone, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { AnyLayer, AnySourceImpl, Layer, LngLatLike, Marker, MarkerOptions, PointLike, Popup, PopupOptions } from 'mapbox-gl';
import { MapboxMap } from '../mapbox-map/mapbox-map.component';
import { catchError, delay, filter, fromEvent, map, mapTo, Observable, startWith, Subject, takeUntil, throwError } from 'rxjs';
import { MapEventManager } from '../../map/services/map-event-manager';

@Component({
    selector: 'app-mapbox-popup',
    templateUrl: './mapbox-popup.component.html',
    styleUrls: ['./mapbox-popup.component.scss'],
    standalone: true,
    imports: [],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapboxPopupComponent implements OnDestroy, OnInit {

    public popup?: Popup;

    @ViewChild('content', { static: true }) content: ElementRef;

    private _eventManager: MapEventManager = new MapEventManager(inject(NgZone));

    @Input() closeButton?: PopupOptions['closeButton'];
    @Input() closeOnClick?: PopupOptions['closeOnClick'] = true;
    @Input() closeOnMove?: PopupOptions['closeOnMove'];
    @Input() focusAfterOpen?: PopupOptions['focusAfterOpen'];
    @Input() anchor?: PopupOptions['anchor'];
    @Input() className?: PopupOptions['className'];
    @Input() maxWidth?: PopupOptions['maxWidth'];
    @Input() feature?: GeoJSON.Feature<GeoJSON.Point>;
    @Input() lngLat?: LngLatLike;
    @Input() offset?: number | PointLike | { [anchor: string]: [number, number] };

    @Output() popupClose: Observable<void> =
        this._eventManager.getLazyEmitter<void>('close');

    @Output() popupOpen: Observable<void> =
        this._eventManager.getLazyEmitter<void>('open');

    constructor(
        private readonly _map: MapboxMap,
        private readonly _ngZone: NgZone,
    ) { }

    public ngOnDestroy(): void {
        this.popup?.remove();
        this.popup = undefined;
        this._eventManager.destroy();
    }

    public ngOnInit(): void {
        this._initialize();

    }

    public isOpen(): boolean {
        return this.popup?.isOpen()!;
    }

    private _initialize() {
        if (!this._map._isBrowser && this.popup) return;
        this.popup = new Popup(this._combineOptions());
        this.popup.setLngLat(this.lngLat ? this.lngLat : this.feature?.geometry!.coordinates as any);
        this.popup.setHTML(this.content.nativeElement?.innerHTML);
        this.popup.addTo(this._map?.mapboxMap!);
        this._eventManager.setTarget(this.popup);
        this._assertInitialized();
    }

    private _combineOptions(): PopupOptions {
        return {
            offset: this.offset || {'bottom': [0,-20]},
            anchor: this.anchor || undefined,
            closeButton: this.closeButton,
            closeOnClick: this.closeOnClick,
            closeOnMove: this.closeOnMove,
            focusAfterOpen: this.focusAfterOpen,
            className: this.className,
            maxWidth: this.maxWidth
        };
    }

    private _assertInitialized(): any {
        if (!this?.popup) {
            throw Error(
                'Cannot interact with a Mapbox before it has been ' +
                'initialized. Please wait for the Marker to load before trying to interact with it.',
            );
        }
    }
}