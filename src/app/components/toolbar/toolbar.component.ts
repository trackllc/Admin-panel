import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { A11yModule } from '@angular/cdk/a11y';

import { NgTemplateOutlet, NgFor, NgIf, CommonModule, NgForOf } from '@angular/common';

// external libs
import { filter, tap } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';

// interfaces
import { LoadProgressService } from '../../core/services/load-progress.service';
import { HistorySearchService } from '../../core/services/history-search.service';
import { MatInputModule } from '@angular/material/input';
import { SidenavService } from '../../core/services/sidenav.service';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    standalone: true,
    providers: [HistorySearchService],
    imports: [
        CommonModule,
        MatMenuModule,
        MatDividerModule,
        MatIconModule,
        NgTemplateOutlet,
        NgIf,
        MatFormFieldModule,
        MatButtonModule,
        NgForOf,
        NgFor,
        MatInputModule,
        ReactiveFormsModule,
        A11yModule

    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent implements OnDestroy, OnInit {

    public formFieldAppearance = 'outline';
    public hasError: boolean;
    public isPending: boolean;
    @ViewChild('matMenu', { read: MatMenu }) contextMenuTrigger: MatMenu;

    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger | undefined;

    public toLocationCtrl = new FormControl();
    public fromLocationCtrl = new FormControl();

    public toLocations$ = new BehaviorSubject<any[] | null>([]);
    public fromLocations$ = new BehaviorSubject<any[] | null>([]);


    public filter$ = this._history.current$
        .pipe(
            filter(Boolean),
            tap((filterObj: any) => {
                
            }),
        );

    private _destroy$ = new Subject<boolean>();

    constructor(
        private _fb: FormBuilder,
        private _cdr: ChangeDetectorRef,
        private _history: HistorySearchService,
        private _loadProgressService: LoadProgressService,
        public sidenavService: SidenavService,
    ) {

    }
    public ngOnInit() {

    }

    public ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();
    }

    public trackByFn(index: number): number {
        return index;
    }
}


