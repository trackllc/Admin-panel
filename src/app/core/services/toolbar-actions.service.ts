import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IToolbarActionButton } from '../../interfaces/toolbar-action-button';

@Injectable({
  providedIn: 'root',
})
export class ToolbarActionsService {

  public actions$ = new BehaviorSubject<IToolbarActionButton[]>([]);

}
