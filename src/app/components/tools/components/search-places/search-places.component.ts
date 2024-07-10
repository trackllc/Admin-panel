import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'app-search-places',
    templateUrl: './search-places.component.html',
    styleUrls: ['./search-places.component.scss'],
    standalone: true,
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPlacesComponent implements AfterViewInit, OnDestroy, OnInit {

    public ngAfterViewInit(): void {
        
    }
    public ngOnDestroy(): void {
        
    }
    public ngOnInit(): void {
        
    }

}