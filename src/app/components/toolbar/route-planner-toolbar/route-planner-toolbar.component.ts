import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MapSearchService } from '../../mapbox/services/map-search.service';
import { BehaviorSubject } from 'rxjs';
import { HighlightPipe } from '../../../pipes/highlight.pipe';
import { ButtonModule } from 'primeng/button';
import { MatDividerModule } from '@angular/material/divider';
import { PlaceIconsType } from '../../mapbox/enums/place-icons-type.enum';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-route-planner-toolbar',
  templateUrl: './route-planner-toolbar.component.html',
  styleUrls: ['./route-planner-toolbar.component.scss'],
  standalone: true,
  imports: [CommonModule, MatTooltipModule, MatIconModule, MatButtonModule, ReactiveFormsModule, FormsModule, MatDividerModule, MatIconModule, AutoCompleteModule, InputGroupModule, InputGroupAddonModule, HighlightPipe, ButtonModule],
  providers: [MapSearchService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutePlannerToolbarComponent implements AfterViewInit, OnDestroy, OnInit {

  constructor(
    public searchService: MapSearchService,
    public cdr: ChangeDetectorRef
  ) { }

  public searchData$: BehaviorSubject<any> = new BehaviorSubject<any>([]);


  public ngAfterViewInit(): void {

  }
  public ngOnDestroy(): void {

  }
  public ngOnInit(): void {

  }

  public goToLink(id: any) {
    return '';
  }

  public onSearch(event: any) {
    let query = event.query;
    if (query.length < 3) return;
    this.searchService.search(query)
      .pipe(

    ).subscribe((data: any) => {
      this.searchData$.next(data.features);
      this.cdr.detectChanges();
    });
  }

  public getIcon(type: any): string {
    const placeType = type?.split(' ')[0];
    /* @ts-ignore */
    const icon = PlaceIconsType[placeType] ? PlaceIconsType[placeType] : 'location_city';
    return icon;
  }

}
