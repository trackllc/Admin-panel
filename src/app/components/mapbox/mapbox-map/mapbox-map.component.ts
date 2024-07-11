import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    ViewEncapsulation,
    Inject,
    PLATFORM_ID,
    NgZone,
    SimpleChanges,
    EventEmitter,
    inject,
} from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';

import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import mapboxgl, { MapboxOptions } from 'mapbox-gl';
import { MapEventManager } from '../../map/services/map-event-manager';
import { MapboxService } from '../../map/services/mapbox.service';


export const DEFAULT_HEIGHT = '100%';
export const DEFAULT_WIDTH = '100%';

@Component({
    selector: 'mapbox-map',
    exportAs: 'MapboxMap',
    standalone: true,
    imports: [SidebarModule],
    templateUrl: './mapbox-map.component.html',
    styleUrls: ['./mapbox-map.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class MapboxMap implements OnChanges, OnInit, OnDestroy {

    private _mapEl: HTMLElement;
    private _eventManager: MapEventManager = new MapEventManager(inject(NgZone));
    public mapboxMap?: mapboxgl.Map;
    public _isBrowser: boolean;

    @Input() height: string = DEFAULT_HEIGHT;
    @Input() width: string = DEFAULT_WIDTH;
    @Input() bounds?: MapboxOptions['bounds'];
    @Input() style: MapboxOptions['style'];
    @Input() center?: MapboxOptions['center'];
    @Input() maxBounds?: MapboxOptions['maxBounds'];
    @Input() zoom?: MapboxOptions['zoom'];
    @Input() bearing?: MapboxOptions['bearing'];
    @Input() pitch?: MapboxOptions['pitch'];
    @Input() language?: any;
    
    @Output() readonly mapInitialized: EventEmitter<any> =
        new EventEmitter<mapboxgl.Map>();

    @Output() readonly authFailure: EventEmitter<void> = new EventEmitter<void>();

    @Output() readonly load: Observable<void> =
        this._eventManager.getLazyEmitter<void>('load');

    @Output() readonly mapClick: Observable<void> =
        this._eventManager.getLazyEmitter<void>('click');

    @Output() readonly mapDblclick: Observable<void> =
        this._eventManager.getLazyEmitter<void>('dblclick');

    @Output() readonly mapRightclick: Observable<void> =
        this._eventManager.getLazyEmitter<void>('contextmenu');

    constructor(
        private readonly _elementRef: ElementRef,
        private _ngZone: NgZone,
        private _mapService: MapboxService,
        @Inject(PLATFORM_ID) platformId: Object,
    ) {
        this._isBrowser = isPlatformBrowser(platformId);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        changes['bounds'] && this.mapboxMap?.fitBounds(this.bounds!);
        changes['center'] && this.mapboxMap?.setCenter(this.center!);
        changes['zoom'] && this.mapboxMap?.setZoom(this.zoom!);
        changes['style'] && this.mapboxMap?.setStyle(this.style!);
        changes['language'] && this.setLayerProperty();
    }

    public ngOnInit(): void {
        if (!this._isBrowser) return;
        if (!mapboxgl.Map) return;
        this._mapEl = this._elementRef.nativeElement.querySelector('.map-container')!;
        this._setSize();
        this._initialize();
    }

    private _initialize(): void {
        this._ngZone.runOutsideAngular(() => {
            mapboxgl.accessToken = 'pk.eyJ1Ijoibm92YWthbmQiLCJhIjoiY2p3OXFlYnYwMDF3eTQxcW5qenZ2eGNoNCJ9.PTZDfrwxfMd-hAwzZjwPTg';
            this.mapboxMap = new mapboxgl.Map(this._combineOptions());
            this._mapService.load$.next(this.mapboxMap);
            this._eventManager.setTarget(this.mapboxMap);
            this.mapInitialized.emit(this.mapboxMap);
            this.mapboxMap?.on('load', () => this.mapboxMap?.resize());
        });
    }

    private _combineOptions(): MapboxOptions {
        return {
            bounds: this.bounds,
            style: this.style || 'mapbox://styles/mapbox/standard',
            center: this.center,
            maxBounds: this.maxBounds,
            zoom: this.zoom || 0,
            bearing: this.bearing || 0,
            pitch: this.pitch || 0,
            container: this._mapEl,
            minZoom: 2,
            maxZoom: 22,
            trackResize: true,
            /* @ts-ignore */
            projection: 'mercator'
        };
    }

    public ngOnDestroy(): void {
        this.mapInitialized.complete();
        this._eventManager.destroy();
    }

    public getZoom(): number {
        this._assertInitialized();
        return this.mapboxMap?.getZoom()!;
    }

    public setLayerProperty(){
        this.mapboxMap?.setLayoutProperty('country-label-lg', 'text-field', '{name_' + this.language + '}');
    }

    private _setSize(): void {
        if (this._mapEl) {
            const styles = this._mapEl.style;
            styles.height =
                this.height === null ? '' : coerceCssPixelValue(this.height) || DEFAULT_HEIGHT;
            styles.width = this.width === null ? '' : coerceCssPixelValue(this.width) || DEFAULT_WIDTH;
        }
    }

    private _assertInitialized(): asserts this is { mglMap: mapboxgl.Map } {
        if (!this.mapboxMap) {
            throw Error(
                'Cannot access Mapbox information before the API has been initialized. ' +
                'Please wait for the API to load before trying to interact with it.',
            );
        }
    }
}

const cssUnitsPattern = /([A-Za-z%]+)$/;
function coerceCssPixelValue(value: any): string {
    if (value == null) return '';
    return cssUnitsPattern.test(value) ? value : `${value}px`;
}
