import { ChangeDetectionStrategy, Component, HostListener, Inject, Input, OnDestroy, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { DocumentElement } from '../../map/enums/document-element';
import { FullscreenService } from '../../map/services/map-fullscreen.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
@Component({
    selector: 'mapbox-fullscreen-control',
    templateUrl: './mapbox-fullscreen.component.html',
    styleUrls: ['./mapbox-fullscreen.component.scss'],
    standalone: true,
    imports: [CommonModule, MatTooltipModule, MatButtonModule, MatIconModule, MatButtonToggleModule, FormsModule],
    providers: [FullscreenService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapboxFullscreenComponent implements OnDestroy, OnInit {

    private _isBrowser: boolean;
    private _container: any

    @Input() public isShowFullscreenControl = true;
    @Input() public isDisabledFullscreenControl = false;
    @Input() public isShowFullscreen = true;
    @Input() public isShowFullscreenExit = false;
    @Input() public isDisabledFullscreen = false;
    @Input() public isDisabledFullscreenExit = false;
    @Input() public isResetFullscreenControl = true;
    @Input() public tooltipFullscreen = 'Полноэкранный режим';
    @Input() public tooltipFullscreenExit = 'Выйти из полноэкранного режима';

    @Output() public changeFullscreen$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private fullscreenService: FullscreenService,
        @Inject(PLATFORM_ID) platformId: Object,
        @Inject(DOCUMENT) private document: Document
    ) {
        this._isBrowser = isPlatformBrowser(platformId);
    }

    public ngOnInit(): void {
        if (this._isBrowser) {
            this._container = this.document.querySelector('.c-search_map-container');
        }
    }

    public ngOnDestroy(): void { }

    @HostListener('document:fullscreenchange')
    public onFullscreen(): void {

        if (document[DocumentElement.fullscreenElement]) {
            this.isShowFullscreen = false;
            this.isShowFullscreenExit = true;
            this.changeFullscreen$.next(true);
        } else {
            this.isShowFullscreen = true;
            this.isShowFullscreenExit = false;
            this.changeFullscreen$.next(false);
        }
    }

    public onChangeFullscreen(): void {
        this._isBrowser && this.fullscreenService.onChangeFullscreen(this._container);
    }
}