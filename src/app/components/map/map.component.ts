import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { MglMap } from './mapbox/mapbox-map/mapbox-map.component';
import { SidenavService } from '../../core/services/sidenav.service';
import { AppUtils } from '../../app.utils';
import { Subject, takeUntil, tap } from 'rxjs';
import { MapSearchService } from './services/map-search.service';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        GoogleMapsModule,
        RouterModule,
        MglMap,
        
    ],
    providers:[MapSearchService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnDestroy, OnInit {

    @ViewChild(MglMap, { static: true }) map: MglMap;

    private _isBrowser: boolean;

    public destroy$ = new Subject<boolean>();


    constructor(
        public sidenavService: SidenavService,
        private _ngZone: NgZone,
        public cdr: ChangeDetectorRef,
        public searchService:MapSearchService,
        @Inject(PLATFORM_ID) platformId: Object,
    ) {

        this._isBrowser = isPlatformBrowser(platformId);
        // this.sidenavService.opened$.subscribe((opened: any) => {
        //     console.log('sidenavService',opened)
        //   });

    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
    ngOnInit(): void {
        this.sidenavService.opened$
            .subscribe((opened: any) => {
                 console.log('sidenavService',opened)

                AppUtils.delay(50)
                    .pipe(
                        takeUntil(this.destroy$),
                        tap(() => this.map.mglMap && this.map.mglMap.resize())
                    )
                    .subscribe();

                // this._ngZone.runOutsideAngular(() => {
                // if (this.map.mglMap) {
                //     if (this._isBrowser) {
                //         console.log('Попал')
                //         const f = this.map.mglMap;
                //         setTimeout(() => f.resize(), 0);

                //     }

                // }
                //  this.map.mglMap && 
               // this.cdr.detectChanges()
                //  });
            });

        // setTimeout(() => {
        //     console.log(this.map.mglMap, 'MAP')
        // }, 1000)


        this.searchService.search('moscow')
        .pipe()
        .subscribe((data)=>console.log(data,'data'))

    }

    public load() {
        //  console.log('load')
    }

    public click() {
        // console.log('click')
    }


    public dblclick() {
        //  console.log('dblclick')
    }

    public onClick() {
        //console.log('ONCLICK',this.map)
    }
}