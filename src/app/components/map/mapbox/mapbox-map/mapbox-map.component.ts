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

import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import mapboxgl from 'mapbox-gl';
import { MapEventManager } from '../../services/map-event-manager';

interface MapboxMapsWindow extends Window {
    gm_authFailure?: () => void;
    mapbox?: typeof mapboxgl;
}

export const DEFAULT_HEIGHT = '100%';
export const DEFAULT_WIDTH = '100%';

@Component({
    selector: 'mgl-map',
    exportAs: 'mglMap',
    standalone: true,
    templateUrl: './mapbox-map.component.html',
    styleUrls: ['./mapbox-map.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class MglMap implements OnChanges, OnInit, OnDestroy {
    private _mapEl: HTMLElement;
    private _eventManager: MapEventManager = new MapEventManager(inject(NgZone));
    public mglMap?: mapboxgl.Map;
    private _isBrowser: boolean;
    @Input() height: string = DEFAULT_HEIGHT;
    @Input() width: string = DEFAULT_WIDTH;
    @Input() mapId: string | undefined;

    @Input()
    set center(center: mapboxgl.PointLike) {
        this._center = center;
    }
    private _center: mapboxgl.PointLike;

    @Input()
    set zoom(zoom: number) {
        this._zoom = zoom;
    }
    private _zoom: number;

    @Output() readonly mapInitialized: EventEmitter<any> =
        new EventEmitter<mapboxgl.Map>();

    @Output() readonly authFailure: EventEmitter<void> = new EventEmitter<void>();

    @Output() readonly load: Observable<void> =
        this._eventManager.getLazyEmitter<void>('load');

    @Output() readonly mapClick: Observable<void> =
        this._eventManager.getLazyEmitter<void>('click');

    @Output() readonly mapDblclick: Observable<void> =
        this._eventManager.getLazyEmitter<void>('dblclick');

    constructor(
        private readonly _elementRef: ElementRef,
        private _ngZone: NgZone,
        @Inject(PLATFORM_ID) platformId: Object,
    ) {
        this._isBrowser = isPlatformBrowser(platformId);
        if (this._isBrowser) {
            this.authFailure.emit();
        }
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes['height'] || changes['width']) {
            this._setSize();
        }

        const mglMap = this.mglMap;
        if (mglMap) {

        }
    }

    public ngOnInit() {
        if (this._isBrowser) {
            this._mapEl = this._elementRef.nativeElement.querySelector('.map-container')!;
            this._setSize();
            if (mapboxgl.Map) {
                this._initialize(mapboxgl.Map);
            }
        }
    }

    private _initialize(mapConstructor: typeof mapboxgl.Map) {
        this._ngZone.runOutsideAngular(() => {
            mapboxgl.accessToken = 'pk.eyJ1Ijoibm92YWthbmQiLCJhIjoiY2p3OXFlYnYwMDF3eTQxcW5qenZ2eGNoNCJ9.PTZDfrwxfMd-hAwzZjwPTg';
            this.mglMap = new mapConstructor({ container: this._mapEl, zoom: 13, style: 'mapbox://styles/mapbox/navigation-day-v1', center: [-122.420679, 37.772537], trackResize: true });
            this._eventManager.setTarget(this.mglMap);
            this.mapInitialized.emit(this.mglMap);
            this.mglMap.on('load', () => this.mglMap?.resize());

        });
    }

    public ngOnDestroy(): void {
        this.mapInitialized.complete();
        this._eventManager.destroy();
    }

    public getZoom(): number {
        this._assertInitialized();
        return this.mglMap.getZoom();
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
        if (!this.mglMap) {
            throw Error(
                'Cannot access Mapbox information before the API has been initialized. ' +
                'Please wait for the API to load before trying to interact with it.',
            );
        }
    }
}

const cssUnitsPattern = /([A-Za-z%]+)$/;
function coerceCssPixelValue(value: any): string {
    if (value == null) {
        return '';
    }
    return cssUnitsPattern.test(value) ? value : `${value}px`;
}
