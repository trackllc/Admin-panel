import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'app-tracking',
    templateUrl: './tracking.component.html',
    styleUrls: ['./tracking.component.scss'],
    standalone: true,
    imports: [
       
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackingComponent implements AfterViewInit, OnDestroy, OnInit {

    public ngAfterViewInit(): void {
       
    }
    public  ngOnDestroy(): void {
       
    }
    public ngOnInit(): void {
        
    }

}