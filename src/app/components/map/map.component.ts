import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapboxMap } from '../mapbox/mapbox-map/mapbox-map.component';
import { SidenavService } from '../../core/services/sidenav.service';
import { delay, filter, of, Subject, takeUntil, tap } from 'rxjs';
import { MapSearchService } from './services/map-search.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MglModule as MapboxModule } from '../mapbox/mapbox-maps-module';
import { HttpClient } from '@angular/common/http';
import { LngLatBounds } from 'mapbox-gl';
import { LoadProgressService } from '../../core/services/load-progress.service';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        GoogleMapsModule,
        MatButtonToggleModule,
        MatTooltipModule,
        RouterModule,
        MatMenuModule,
        MapboxModule
    ],
    providers: [MapSearchService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnDestroy, OnInit {
    @ViewChild(MatMenuTrigger) public contextMenu: MatMenuTrigger;
    @ViewChild(MapboxMap, { static: true }) map: MapboxMap;

    public contextMenuPosition = { x: '0px', y: '0px' };

    private _isBrowser: boolean;

    public destroy$ = new Subject<boolean>();
    public dataCluster: any;
    public dataMarkers: any;
    public dataRoutes: any;
    public center: any;
    public bounds: any = null;

    private _destroy$ = new Subject<boolean>();

    constructor(
        public sidenavService: SidenavService,
        private _ngZone: NgZone,
        public cdr: ChangeDetectorRef,
        public searchService: MapSearchService,
        @Inject(PLATFORM_ID) platformId: Object,
        private _loadProgressService: LoadProgressService,
        private _http: HttpClient
    ) {

        this._isBrowser = isPlatformBrowser(platformId);
    }



    public markerClick(event: any) { }

    public popupOpen() { }

    public getClusterJson(): void {
        this._http.get<any>('./data-storage/cluster-geojson.json')
            .pipe(delay(10))
            .subscribe({
                next: (data) => {
                    this.dataCluster = data;
                    this.cdr.detectChanges();
                }
            });
    }

    public getRouteJson(): void {
        this._http.get<any>('https://api.track.bstrv.ru/v1/track')
            .pipe(
                filter((data) => data?.features[0].geometry?.coordinates?.length > 0),
                takeUntil(this._destroy$)
            )
            .subscribe({
                next: (data) => {
                    this.dataRoutes = data;
                    const coordinates = data.features[0].geometry?.coordinates;
                    this.bounds = this.getBounds(coordinates);
                    this.cdr.detectChanges();
                },
                complete: () => of({}).pipe(delay(2000), tap(() => this._loadProgressService.hide(1))).subscribe()
            });
    }

    public getMarkerJson(): void {
        this._http.get<any>('./data-storage/marker-geojson.json')
            .pipe(delay(10))
            .subscribe({
                next: (data) => {
                    this.dataMarkers = data;
                    this.cdr.detectChanges();
                }
            });
    }

    public getBounds(coordinates: any): any {
        return coordinates?.reduce((bounds: any, coord: any) => {
            return bounds?.extend(<any>coord);
        }, new LngLatBounds(coordinates[0], coordinates[0]));
    }

    public ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    public ngOnInit(): void {
        this._loadProgressService.show(1);
        this.getRouteJson();
        this.getClusterJson();
        this.getMarkerJson();
        this.sidenavService.opened$
            .pipe(
                delay(50),
                takeUntil(this.destroy$),
            )
            .subscribe((opened: any) => {
                this.map.mapboxMap && this.map.mapboxMap.resize();
                ;
            });



    }

    public load(): void {
        if (this._isBrowser) {
            this.center && this.map.mapboxMap?.setCenter([74.864155, 42.889409]);
            this.center && this.map.mapboxMap?.setZoom(24);
            this.cdr.detectChanges();
        }
    }

    public dblclick(event: any) {
        this.contextMenuPosition.x = `${event.originalEvent.clientX}px`;
        this.contextMenuPosition.y = `${event.originalEvent.clientY}px`;
        this.contextMenu.menuData = { item: event.lngLat };
        this.contextMenu.openMenu();
    }

    public click(event: any) { }

    public onClick(event: any) {
        console.log('ONCLICK', event)
    }
}