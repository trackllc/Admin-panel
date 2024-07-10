import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'app-documents',
    templateUrl: './documents.component.html',
    styleUrls: ['./documents.component.scss'],
    standalone: true,
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentsComponent implements AfterViewInit, OnDestroy, OnInit {

    public ngAfterViewInit(): void {
        
    }
    public ngOnDestroy(): void {
        
    }
    public ngOnInit(): void {
        
    }

}