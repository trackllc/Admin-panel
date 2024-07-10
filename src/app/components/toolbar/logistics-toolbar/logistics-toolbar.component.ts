import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BehaviorSubject } from 'rxjs';
import { MapSearchService } from '../../map/services/map-search.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SidenavService } from '../../../core/services/sidenav.service';
import { PlaceIconsType } from '../../mapbox/enums/place-icons-type.enum';

@Component({
    selector: 'app-logistics-toolbar',
    templateUrl: './logistics-toolbar.component.html',
    styleUrls: ['./logistics-toolbar.component.scss'],
    standalone: true,
    imports: [CommonModule, AutoCompleteModule, MatIconModule, MatDividerModule, InputGroupModule, InputGroupAddonModule],
    providers: [MapSearchService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogisticsToolbarComponent implements AfterViewInit, OnDestroy, OnInit {

    public searchData$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

    constructor(
        public searchService: MapSearchService,
        public cdr: ChangeDetectorRef,
        public sidenavService: SidenavService,
    ) {

    }

    public ngAfterViewInit(): void {

    }
    public ngOnDestroy(): void {

    }
    public ngOnInit(): void { }

    public onSearch(event: any) {
        let query = event.query;
        this.searchService.search(query)
            .pipe(

        ).subscribe((data: any) => {
            console.log(data, 'data')
            this.searchData$.next(data.features);
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