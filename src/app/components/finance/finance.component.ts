import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'app-finance',
    templateUrl: './finance.component.html',
    styleUrls: ['./finance.component.scss'],
    standalone: true,
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinanceComponent implements AfterViewInit, OnDestroy, OnInit {

    public ngAfterViewInit(): void {
        
    }
    public ngOnDestroy(): void {
        
    }
    public ngOnInit(): void {
        
    }

}