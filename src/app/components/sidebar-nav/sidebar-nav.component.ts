import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ViewMode } from '../../enums/view-mode.enum';
import { ISidebarNavTab } from '../../interfaces/sidebar-nav-tab.interface';
import { NgFor } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    NgFor,
    MatTooltip,
    MatTooltipModule,
    RouterModule,
  ],
  templateUrl: './sidebar-nav.component.html',
})
export class SidebarNavComponent {

  @Input() public selected: string | undefined;
  @Input() public disabled = false;
  @Input() public tabs: ISidebarNavTab[] | undefined;
  @Input() public viewMode: ViewMode | null;

  @Output() public changed: EventEmitter<ISidebarNavTab> = new EventEmitter<ISidebarNavTab>();

  public viewModeType = ViewMode;

  constructor(
    private _router: Router,
  ) {
    this.viewMode = ViewMode.Collapsed;
  }

  public select(item: ISidebarNavTab): void {
    this.selected = item.name;
    this.changed.emit(item);
    item.type === 'link' && !!item.url && this._router.navigateByUrl(item.url);
    item.type === 'href' && !!item.url && (window.open(item.url, '_blank'));
  }

  public trackByFn(index: any) {
    return index;
  }

}
