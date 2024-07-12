import { ChangeDetectionStrategy, Component, Directive, Input, NgZone, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AnySourceImpl, GeoJSONSourceOptions, GeoJSONSourceRaw } from 'mapbox-gl';
import { MapboxMap } from '../mapbox-map/mapbox-map.component';
import { catchError, delay, filter, fromEvent, Subject, takeUntil, throwError } from 'rxjs';

@Component({
  selector: 'app-mapbox-geojson-source',
  template: '',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapboxGeojsonSourceComponent implements OnDestroy, OnInit {

  public source?: AnySourceImpl;

  private _destroy$ = new Subject<boolean>();

  @Input() id: string;
  @Input() options?: GeoJSONSourceOptions;
  @Input() data?: GeoJSONSourceOptions['data'];
  @Input() maxzoom?: GeoJSONSourceOptions['maxzoom'];
  @Input() attribution?: GeoJSONSourceOptions['attribution'];
  @Input() buffer?: GeoJSONSourceOptions['buffer'];
  @Input() tolerance?: GeoJSONSourceOptions['tolerance'];
  @Input() cluster?: GeoJSONSourceOptions['cluster'];
  @Input() clusterRadius?: GeoJSONSourceOptions['clusterRadius'];
  @Input() clusterMaxZoom?: GeoJSONSourceOptions['clusterMaxZoom'];
  @Input() clusterMinPoints?: GeoJSONSourceOptions['clusterMinPoints'];
  @Input() clusterProperties?: GeoJSONSourceOptions['clusterProperties'];
  @Input() lineMetrics?: GeoJSONSourceOptions['lineMetrics'];
  @Input() generateId?: GeoJSONSourceOptions['generateId'];
  @Input() promoteId?: GeoJSONSourceOptions['promoteId'];
  @Input() filter?: GeoJSONSourceOptions['filter'];

  constructor(
    private readonly _map: MapboxMap,
    private readonly _ngZone: NgZone,
  ) { }

  public ngOnInit(): void {
    this._watchForStylesChanges();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!this._map.mapboxMap?.getSource(this.id)) {
      return;
    }
    if (changes['data'] && !changes['data'].isFirstChange()) {
      const source = this._map.mapboxMap?.getSource(this.id);
      (source as any)?.setData(this.data!);
    }
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
    if (this._map.mapboxMap?.getSource(this.id)) {
      this._map?.mapboxMap?.removeSource(this.id);
    }
  }

  private _watchForStylesChanges() {
    fromEvent(this._map?.mapboxMap!, 'styledata')
      .pipe(
        delay(10),
        filter(() => !this._map?.mapboxMap?.getSource(this.id)),
        takeUntil(this._destroy$),
        catchError((error) => {
          return throwError(() => new Error('Error'));
        })
      )
      .subscribe(() => this._map?.mapboxMap && this._initialize());
  }

  private _initialize() {
    if (!this._map._isBrowser && this._map.mapboxMap?.getSource(this.id)) return;
    this._ngZone.runOutsideAngular(() => {
      this?._map?.mapboxMap?.addSource(this.id, this._combineOptions());

      this.source = this._map.mapboxMap?.getSource(this.id);
      this._assertInitialized();
    });
  }

  private _combineOptions(): GeoJSONSourceRaw {
    return {
      data: this.data,
      maxzoom: this.maxzoom || 22,
      ...(this.buffer && { buffer: this.buffer }),
      ...(this.attribution && { attribution: this.attribution }),
      ...(this.tolerance && { tolerance: this.tolerance }),
      ...(this.cluster && { cluster: this.cluster }),
      ...(this.clusterRadius && { clusterRadius: this.clusterRadius }),
      ...(this.clusterMaxZoom && { clusterMaxZoom: this.clusterMaxZoom }),
      ...(this.clusterMinPoints && { clusterMinPoints: this.clusterMinPoints }),
      ...(this.clusterProperties && { clusterProperties: this.clusterProperties }),
      ...(this.lineMetrics && { lineMetrics: this.lineMetrics }),
      ...(this.generateId && { generateId: this.generateId }),
      ...(this.promoteId && { promoteId: this.promoteId }),
      ...(this.filter && { filter: this.filter }),
      type: 'geojson',
    };
  }

  private _assertInitialized(): asserts this is { source: AnySourceImpl } {
    if (!this?.source) {
      throw Error(
        'Cannot interact with a Mapbox before it has been ' +
        'initialized. Please wait for the Marker to load before trying to interact with it.',
      );
    }
  }
}