import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { MapboxService } from '../services/mapbox.service';
import { filter, Subject, takeUntil } from 'rxjs';
import { MapEventManager } from '../services/map-event-manager';
@Component({
    selector: 'mapbox-zoom-control',
    templateUrl: './mapbox-zoom-control.component.html',
    styleUrls: ['./mapbox-zoom-control.component.scss'],
    standalone: true,
    imports: [CommonModule, MatTooltipModule, MatButtonModule, MatIconModule, MatButtonToggleModule, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapboxZoomControlComponent implements OnDestroy, OnInit {

    public isDisabled = false;

    private _map: any;

    private _destroy$ = new Subject<boolean>();

    private _eventManager: MapEventManager = new MapEventManager(inject(NgZone));

    private _zoom = this._eventManager.getLazyEmitter<void>('zoom')

    @Input() public isShowZoomControl = true;
    @Input() public isDisableZoomControl = false;
    @Input() public isResetZoomControl = true;
    @Input() public isDisabledZoomOut = false;
    @Input() public isDisabledZoomIn = false;
    @Input() public tooltipZoomIn = 'Приблизить';
    @Input() public tooltipZoomOut = 'Отдалить';

    constructor(
        private _mapService: MapboxService,
        private _cdr: ChangeDetectorRef,
    ) {
        this._watchForLoadChanges();
    }

    public ngOnInit(): void { }

    public ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();
        this._eventManager.destroy();
    }

    public onZoomOutChange(): void {
        this._map?.setZoom(this._map.getZoom() - 1);
        this._onZoomChange();
    }

    public onZoomInChange(): void {
        this._map?.setZoom(this._map.getZoom() + 1);
        this._onZoomChange();
    }

    private _watchForLoadChanges() {
        this._mapService.load$
            .pipe(
                filter(Boolean),
                takeUntil(this._destroy$),
            )
            .subscribe((data) => {
                this._map = data;
                this._eventManager.setTarget(this._map);
                this._watchForZoomChanges();
            });
    }

    private _watchForZoomChanges(): void {
        this._zoom
            .pipe(
                takeUntil(this._destroy$),
            )
            .subscribe(() => this._onZoomChange());
    }

    private _onZoomChange(): void {
        const zoom = this._map.getZoom();
        this.isDisabledZoomIn = zoom === this._map.getMaxZoom();
        this.isDisabledZoomOut = zoom === this._map.getMinZoom();
        this._cdr.detectChanges();
    }

}