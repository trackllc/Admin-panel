import { ChangeDetectionStrategy, Component, Input, NgZone, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MapboxMap } from '../mapbox-map/mapbox-map.component';
import { catchError, filter, fromEvent, Subject, takeUntil, throwError } from 'rxjs';
import { IMapImageOptions } from '../interfaces/map-image-options.interface';
import { MapImageData } from '../types/map-image-data.type';

@Component({
    selector: 'app-mapbox-image',
    template: '',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapboxImageComponent implements OnDestroy, OnInit {

    private _destroy$ = new Subject<boolean>();

    @Input() id: string;
    @Input() data?: MapImageData;
    @Input() options?: IMapImageOptions;

    constructor(
        private readonly _map: MapboxMap,
        private readonly _ngZone: NgZone,
    ) {}

    public ngOnInit(): void {
        this._watchForStylesChanges();
    }

    public ngOnChanges(changes: SimpleChanges): void { }

    public ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();
        if (this._map?.mapboxMap?.hasImage(this.id)) {
            this._map?.mapboxMap?.removeImage(this.id);
        }
    }

    private _watchForStylesChanges() {
        fromEvent(this._map?.mapboxMap!, 'styledata')
            .pipe(
                filter(() => !this._map?.mapboxMap?.hasImage(this.id)),
                takeUntil(this._destroy$),
                catchError((error) => {
                    return throwError(() => new Error('Error'));
                })
            )
            .subscribe(() => this._map?.mapboxMap && this._initialize());
    }

    private _initialize() {
        if (!this._map._isBrowser && this._map.mapboxMap?.hasImage(this.id)) return;
        this._ngZone.runOutsideAngular(() => {
            this?._map?.mapboxMap?.addImage(this.id, this.data!, this.options);
            this._assertInitialized();
        });
    }

    private _assertInitialized(): any {
        if (!this._map.mapboxMap?.hasImage(this.id)) {
            throw Error(
                'Cannot interact with a Mapbox before it has been ' +
                'initialized. Please wait for the Marker to load before trying to interact with it.',
            );
        }
    }

}