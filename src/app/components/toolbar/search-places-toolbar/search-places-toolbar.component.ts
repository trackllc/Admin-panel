import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MapSearchService } from '../../mapbox/services/map-search.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PlaceIconsType } from '../../mapbox/enums/place-icons-type.enum';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-search-places-toolbar',
    templateUrl: './search-places-toolbar.component.html',
    styleUrls: ['./search-places-toolbar.component.scss'],
    standalone: true,
    imports: [CommonModule, AutoCompleteModule, MatIconModule, MatDividerModule, InputGroupModule, InputGroupAddonModule],
    providers: [MapSearchService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SarchPlacesToolbarComponent implements AfterViewInit, OnDestroy, OnInit {

    public searchData$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

    constructor(
        public searchService: MapSearchService,
        public cdr: ChangeDetectorRef,
    ) { }

    public ngAfterViewInit(): void {

    }
    public ngOnDestroy(): void {

    }
    public ngOnInit(): void {

    }

    public onSearch(event: any) {
        let query = event.query;
        this.searchService.search(query)
            .pipe(

        ).subscribe((data: any) => {
            this.searchData$.next([...data.features]);
            this.cdr.detectChanges();
        });
    }

    public getIcon(type: any): string {
        const placeType = type.split(' ')[0];
        /* @ts-ignore */
        const icon = PlaceIconsType[placeType] ? PlaceIconsType[placeType] : 'location_city';
        return icon;
      }

}