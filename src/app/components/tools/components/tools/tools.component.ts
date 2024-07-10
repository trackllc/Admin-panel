import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { MatMenuTrigger, MatMenu } from '@angular/material/menu';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgIf, NgClass, NgSwitch, NgSwitchCase } from '@angular/common';
//MatSidenav
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

// external libs
import { filter, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { MapComponent } from '../../../map/map.component';
import { SidenavService } from '../../../../core/services/sidenav.service';
import { TrackingComponent } from '../tracking/tracking.component';
import { PlannerComponent } from '../route-planner/route-planner.component';
import { LogistcicsComponent } from '../logistics-map/logistics-map.component';
import { SearchPlacesComponent } from '../search-places/search-places.component';

// enums
// import { LocationType, PointType } from '@components/search/transfer/enums';
// import { MarkerAction } from '../../enums';
// import { SearchSidenavService } from './services/search-sidenav.service';
// import { MapComponent } from '../map/map.component';
// import { SearchRoutingModule } from './search-routing.module';

// internal libs
// import {
//     ChangesMap,
//     CircleEvent,
//     CursorType,
//     DrawingModes,
//     H21MapAutocompleteComponent,
//     H21MapComponent,
//     H21MapDrawingManagerComponent,
//     IMarkerClusterOptions,
//     MapStateOptions,
//     Position,
// } from '-map';

// models
// import { DrawAreaInfo } from '@components/search/models/draw-area-info.model';
// import { MarkerActionInfo } from '@components/search/models';

// builders
// import { SearchMapBuilder } from './search-map.builder';

// interfaces
// import {
//     IDrawingOptions, IInfoBoxOptions, IMapOptions, IMarker,
//     IPoiDataAction, IRoute, ITooltipOptions, ITraveler,
// } from '../../interfaces';
// import { IPoi } from '@components/search/hotel/components/hotel-poi/poi.interface';
// import { IRouteOptions } from '../../interfaces/route-options.interface';

// mapServices
// import { SearchMapService } from './services/search-map.service';
// import { SearchService } from './services/search.service';
// import { StorageService } from '@core/services';
// import { Utils } from '-be-ui-kit';
// import { SearchSidenavService } from './services/search-sidenav.service';

@Component({
    selector: 'app-tools',
    templateUrl: './tools.component.html',
    styleUrls: ['./tools.component.scss'],
    standalone: true,
    imports: [
        MatMenu,
        MatSidenav,
        MatSidenavModule,
        NgSwitch,
        NgIf,
        NgSwitchCase,
        MapComponent,
        TrackingComponent,
        PlannerComponent,
        LogistcicsComponent,
        SearchPlacesComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolsComponent implements AfterViewInit, OnDestroy, OnInit {

    @ViewChild(MatMenuTrigger) public contextMenu: MatMenuTrigger | undefined;

    public showNavigation = false;
    public tabletMode: boolean = true;
    public sidenavViewContent: string;
    public contextMenuPosition = { x: '0px', y: '0px' };
    public sidenavContentViewContent: 'map' | 'outlet' = 'map';

    public destroy$ = new Subject<boolean>();

    @ViewChild('sidenav') private _sidenav: MatSidenav | undefined;

    constructor(
        private _router: Router,
        public cdr: ChangeDetectorRef,
        private _route: ActivatedRoute,
        private _breakpointObserver: BreakpointObserver,
        public sidenavService: SidenavService,
    ) {

        this._breakpointObserver.observe(['(max-width: 1100px)'])
            .subscribe((state: BreakpointState) => {
                this.tabletMode = state.matches;
                if (this.tabletMode) {
                    this.sidenavService.opened$.subscribe((opened: any) => {
                        if (this._sidenav) {
                            this._sidenav.opened = opened;
                        }
                        this.cdr.markForCheck();
                    });
                } else {
                    this.sidenavViewContent !== 'none' && this._sidenav && this._sidenav.open();
                }
                this.cdr.markForCheck();
            });

        this._router.events.pipe(
            filter((event) => event instanceof NavigationEnd)
        ).subscribe((event) => {
            this._sidenavInit();
        });
    }

    public ngOnInit(): void { }

    public ngAfterViewInit(): void {
        this._sidenavToggle();
    }

    public ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    public trackByFn(index: number): number { return index; }


    private _sidenavInit($event?: NavigationEnd): void {
        if (this._route.firstChild && this._route.firstChild.snapshot) {
            this.sidenavViewContent = this._route.firstChild.snapshot.data['sidenav'];
            this.sidenavContentViewContent = this._route.firstChild.snapshot.data['sidenavContent'];
            this.cdr.detectChanges();
        } else {
            this.sidenavViewContent = 'none';
            this.sidenavContentViewContent = 'map';
        }

        if ($event instanceof NavigationEnd) {
            this._sidenavToggle();
            !(<ViewRef>this.cdr).destroyed && this.cdr.detectChanges();
        }
    }

    private _sidenavToggle(): void {
        if (this._sidenav) {
            (this._sidenav.opened && this.sidenavViewContent === 'none') && this._sidenav.close();
            (!this._sidenav.opened && this.sidenavViewContent !== 'none') && this._sidenav.open();
        }

    }
}
