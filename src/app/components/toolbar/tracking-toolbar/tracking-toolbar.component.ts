import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'app-tracking-toolbar',
    templateUrl: './tracking-toolbar.component.html',
    styleUrls: ['./tracking-toolbar.component.scss'],
    standalone: true,
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackingToolbarComponent implements AfterViewInit, OnDestroy, OnInit {

    public ngAfterViewInit(): void {
        
    }
    public ngOnDestroy(): void {
        
    }
    public ngOnInit(): void {
        
    }

}