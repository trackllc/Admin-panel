import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MapSearchService } from '../../mapbox/services/map-search.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-tracking-toolbar',
    templateUrl: './tracking-toolbar.component.html',
    styleUrls: ['./tracking-toolbar.component.scss'],
    standalone: true,
    imports: [CommonModule, AutoCompleteModule, MatIconModule, MatDividerModule, InputGroupModule, InputGroupAddonModule],
    providers: [MapSearchService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackingToolbarComponent implements AfterViewInit, OnDestroy, OnInit {

    public itemsTaxon$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    constructor(
        public searchService: MapSearchService,
        public cdr: ChangeDetectorRef,
    ) {}

    public ngAfterViewInit(): void {
        
    }
    public ngOnDestroy(): void {
        
    }
    public ngOnInit(): void {
        
    }

    public onSearch(event: any) {
        let query = event.query;
        this.itemsTaxon$.next([]);
    }

}