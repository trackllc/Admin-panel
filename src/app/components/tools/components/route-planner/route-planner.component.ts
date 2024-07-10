import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'app-planner',
    templateUrl: './route-planner.component.html',
    styleUrls: ['./route-planner.component.scss'],
    standalone: true,
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlannerComponent implements AfterViewInit, OnDestroy, OnInit {
    
    public ngAfterViewInit(): void {
       
    }
    public ngOnDestroy(): void {
        
    }
    public ngOnInit(): void {
       
    }

}