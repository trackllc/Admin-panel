import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AnyLayer, AnySourceImpl, Layer } from 'mapbox-gl';
import { MapboxMap } from '../mapbox-map/mapbox-map.component';
import { catchError, delay, filter, fromEvent, Subject, takeUntil, throwError } from 'rxjs';

@Component({
    selector: 'app-mapbox-layer',
    template: '',
    standalone: true,
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapboxLayerComponent implements OnDestroy, OnInit {

    public layer: AnySourceImpl;

    private _destroy$ = new Subject<boolean>();

    @Input() id: AnyLayer['id'];
    @Input() source?: Layer['source'];
    @Input() type: AnyLayer['type'];
    @Input() metadata?: Layer['metadata'];
    @Input() sourceLayer?: Layer['source-layer'];
    @Input() filter?: Layer['filter'];
    @Input() layout?: Layer['layout'];
    @Input() paint?: Layer['paint'];
    @Input() before?: string;
    @Input() minzoom?: Layer['minzoom'];
    @Input() maxzoom?: Layer['maxzoom'];
    @Input() delay?: number = 100;

    constructor(
        private readonly _map: MapboxMap,
        private readonly _ngZone: NgZone,
        public cdr: ChangeDetectorRef,
    ) {
    }

    public ngOnInit(): void {
        this._watchForStylesChanges();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (!this._map?.mapboxMap?.getLayer(this.id)) {
            return;
        }
    }

    public ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();
        this._map?.mapboxMap?.getLayer(this.id) && this._map?.mapboxMap?.removeLayer(this.id);
    }

    private _initialize() {
        if (!this._map._isBrowser && this._map?.mapboxMap?.getLayer(this.id)) return;
        this._ngZone.runOutsideAngular(() => {
            this?._map?.mapboxMap?.addLayer(this._combineOptions());
            (this.layer as any) = this._map.mapboxMap?.getLayer(this.id);
            this.cdr.detectChanges();
            this._assertInitialized();
        });
    }

    private _watchForStylesChanges() {
        fromEvent(this._map?.mapboxMap!, 'styledata')
            .pipe(
                delay(this.delay!),
                filter(() => !this._map?.mapboxMap?.getLayer(this.id)),
                takeUntil(this._destroy$),
                catchError((error) => {
                    return throwError(() => new Error('Error'));
                })
            )
            .subscribe(() => this._map?.mapboxMap && this._initialize());
    }

    private _combineOptions(): any {
        return {
            id: this.id,
            ...(this.source && { source: this.source }),
            ...(this.type && { type: this.type }),
            ...(this.metadata && { metadata: this.metadata }),
            ...(this.sourceLayer && { sourceLayer: this.sourceLayer }),
            ...(this.filter && { filter: this.filter }),
            ...(this.layout && { layout: this.layout }),
            ...(this.paint && { paint: this.paint }),
            ...(this.before && { before: this.before }),
            ...(this.minzoom && { minzoom: this.minzoom }),
            ...(this.maxzoom && { maxzoom: this.maxzoom }),
        }
    }

    private _assertInitialized(): asserts this is { source: AnySourceImpl } {
        if (!this?.layer) {
            throw Error(
                'Cannot interact with a Mapbox before it has been ' +
                'initialized. Please wait for the Marker to load before trying to interact with it.',
            );
        }
    }
}
