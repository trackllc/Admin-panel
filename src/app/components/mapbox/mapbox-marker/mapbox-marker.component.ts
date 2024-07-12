import { ChangeDetectionStrategy, Component, ElementRef, inject, Input, NgZone, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { LngLat, LngLatLike, Marker, MarkerOptions } from 'mapbox-gl';
import { MapboxMap } from '../mapbox-map/mapbox-map.component';
import { Observable } from 'rxjs';
import { MapEventManager } from '../services/map-event-manager';

@Component({
    selector: 'app-mapbox-marker',
    templateUrl: './mapbox-marker.component.html',
    styleUrls: ['./mapbox-marker.component.scss'],
    standalone: true,
    imports: [],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapboxMarkerComponent implements OnDestroy, OnInit {

    public marker?: Marker;

    @ViewChild('content', { static: true }) content: ElementRef;

    private _eventManager: MapEventManager = new MapEventManager(inject(NgZone));

    @Input() offset?: MarkerOptions['offset'];
    @Input() anchor?: MarkerOptions['anchor'];
    @Input() clickTolerance?: MarkerOptions['clickTolerance'];
    @Input() feature?: GeoJSON.Feature<GeoJSON.Point>;
    @Input() lngLat?: LngLatLike;
    @Input() draggable?: MarkerOptions['draggable'];
    @Input() popupShown?: boolean;
    @Input() className: string;
    @Input() pitchAlignment?: MarkerOptions['pitchAlignment'];
    @Input() rotationAlignment?: MarkerOptions['rotationAlignment'];

    @Output() readonly markerClick: Observable<void> =
        this._eventManager.getLazyEmitter<void>('click');

    constructor(
        private readonly _map: MapboxMap,
        private readonly _ngZone: NgZone,
    ) { }

    public ngOnDestroy(): void {
        this.marker?.remove();
        this.marker = undefined;
        this._eventManager.destroy();
    }

    public ngOnInit(): void {
        this._initialize();
        this.marker?.isDraggable
    }

    public getLngLat(): LngLat {
        return this.marker?.getLngLat()!;
    }

    public isDraggable(): boolean {
        return this.marker?.isDraggable()!;
    }

    private _initialize() {
        if (!this._map._isBrowser && this.marker) return;
        this.marker = new Marker(this._combineOptions());
        this.marker.setLngLat(this.lngLat ? this.lngLat : this.feature?.geometry!.coordinates as any);
        this.marker.addTo(this._map?.mapboxMap!);
        this._eventManager.setTarget(this.marker, true);
        this._assertInitialized();
    }

    private _combineOptions(): MarkerOptions {
        return {
            offset: this.offset || undefined,
            anchor: this.anchor || undefined,
            draggable: !!this.draggable,
            element: this.content?.nativeElement || undefined,
            rotationAlignment: this.rotationAlignment,
            pitchAlignment: this.pitchAlignment,
            clickTolerance: this.clickTolerance,
        };
    }

    private _assertInitialized(): any {
        if (!this?.marker) {
            throw Error(
                'Cannot interact with a Mapbox before it has been ' +
                'initialized. Please wait for the Marker to load before trying to interact with it.',
            );
        }
    }

}