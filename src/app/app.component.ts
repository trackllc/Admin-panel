import { NgIf, NgClass, NgFor, NgSwitch, CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation, ViewRef } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { SidebarNavComponent } from './components/sidebar-nav/sidebar-nav.component';
import { ISidebarNavTab } from './interfaces/sidebar-nav-tab.interface';
import { HeaderComponent } from './components/header/header.component';
import { StorageService } from './core/services/storage.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AppUtils } from './app.utils';
import { ViewMode } from './enums/view-mode.enum';
import { LoadProgressService } from './core/services/load-progress.service';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { LoginComponent } from './components/login/login.component';
import { HttpClientService } from './core/services/http-client.service';
import { AuthenticationService } from './core/services/authentication.service';
import { AsyncPipe } from '@angular/common';
import { ToolbarActionsService } from './core/services/toolbar-actions.service';
import { LoadPreloaderService } from './core/services/load-preloader.service';
import { Subject, filter, takeUntil } from 'rxjs';
import { SidenavService } from './core/services/sidenav.service';
import { FinanceComponent } from './components/finance/finance.component';
import { DocumentsComponent } from './components/ documents/documents.component';
import { TrackingToolbarComponent } from './components/toolbar/tracking-toolbar/tracking-toolbar.component';
import { RoutePlannerToolbarComponent } from './components/toolbar/route-planner-toolbar/route-planner-toolbar.component';
import { LogisticsToolbarComponent } from './components/toolbar/logistics-toolbar/logistics-toolbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgIf, AsyncPipe, MatMenuModule, MatIconModule, NgClass, MatProgressBar, MatTooltip, NgFor, MatToolbar, MatButtonModule, SidebarNavComponent, HeaderComponent, ToolbarComponent, LoginComponent, FinanceComponent, DocumentsComponent,TrackingToolbarComponent,RoutePlannerToolbarComponent,LogisticsToolbarComponent],
  providers: [StorageService, HttpClientService, NgSwitch, LoadPreloaderService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.Emulated
})
export class AppComponent implements AfterViewInit, OnInit {

  public title = 'Track LLC';
  public logoUrl = './assets/img/logo.svg';
  public showTrackingToolbar: boolean = false;
  public showRoutePlannerToolbar = false;
  public showLogisticsToolbar = false;
  public tabletMode: boolean = true;
  public hasValidTokens = true;
  public sidebarNavActiveTab: string | undefined;
  public sidebarNavDisabled: boolean | undefined = false;
  public showBackToSearch = false;
  public sidebarNavViewMode = ViewMode.Expanded;
  public viewModeType = ViewMode;
  public showBackToSearchResult: boolean = true;
  public sidebarNavTabs: ISidebarNavTab[] = [];
  public toolbarActions$: any;
  public showProgress: boolean = false;

  public isShow$ = this._authService.isAuth$;
  private _isBrowser: boolean;

  public destroy$ = new Subject<boolean>();

  constructor(
    public sidenavService: SidenavService,
    private _router: Router,
    private _cdr: ChangeDetectorRef,
    private _storage: StorageService,
    private _breakpointObserver: BreakpointObserver,
    private _loadProgressService: LoadProgressService,
    private _loadPreloderService: LoadPreloaderService,
    private _authService: AuthenticationService,
    private _toolbarActionsService: ToolbarActionsService,
    @Inject(PLATFORM_ID) platformId: Object,

  ) {

    this._isBrowser = isPlatformBrowser(platformId);

    this._loadProgressService.inProgress
      .subscribe((progress: boolean) => {
        this.showProgress = progress;
      });

    // this._breakpointObserver.observe(['(max-width: 1100px)'])
    //   .subscribe((state: BreakpointState) => {
    //     this.tabletMode = state.matches;
    //     if (this.tabletMode) {
    //       this.sidebarNavViewMode = ViewMode.Expanded;
    //     }
    //   });

    this._router.events.
      pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$))
      .subscribe(($event: any) => {
        this._showSearchControls();
        this._onRouteChanged($event);
        console.log(this.showRoutePlannerToolbar,this.showTrackingToolbar)
      });
  }

  public ngOnInit(): void {
    this._loadPreloderService.hide();
  }

  public ngAfterViewInit() {
    this._getSidebarNavTabs();
  }

  private _showSearchControls(): void {
    this.showRoutePlannerToolbar = this._router.url.indexOf('tools/route-planner') >= 0;
    this.showTrackingToolbar = this._router.url.indexOf('tools/tracking') >= 0;
    this.showLogisticsToolbar = this._router.url.indexOf('tools/logistics-map') >= 0;
  }

  private _onRouteChanged($event: any): void {
    if ($event instanceof NavigationStart) {
      if (this._loadProgressService.inProgress) {
        this._loadProgressService.hide(9999);
      }
      this._loadProgressService.show();
      !(<ViewRef>this._cdr).destroyed && this._cdr.detectChanges();
    }
    if ($event instanceof NavigationEnd) {
      this._setActiveTab();
      this._loadProgressService.hide();
      !(<ViewRef>this._cdr).destroyed && this._cdr.detectChanges();
    }
  }



  public toggleSidebarNavViewMode(): void {
    this.sidenavService.opened$.next(!this.sidenavService.opened$.value);
    if (this.tabletMode) {
      this._cdr.detectChanges();
    } else {
      this.sidebarNavViewMode = this.sidebarNavViewMode === ViewMode.Collapsed
        ? ViewMode.Expanded
        : ViewMode.Collapsed;
    }
  }

  private _getSidebarNavTabs(): void {
    this._storage.filterNavs()
      .subscribe((navs) => {
        this.sidebarNavTabs = navs;
        this.sidebarNavTabs.forEach((item) => {
          item.disabled = item.disabled;
        });
        this._setActiveTab();
      });
  }

  private _setActiveTab(): void {
    if (!this.sidebarNavTabs.length) return;
    this.sidebarNavActiveTab = AppUtils.getActiveTab(this._router, this.sidebarNavTabs)
  }

  public onActivateRouterOutlet() {
    this._toolbarActionsService.actions$.next([]);
  }

  public trackByFn(index: number): number {
    return index;
  }
}
