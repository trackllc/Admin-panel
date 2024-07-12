import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class MapboxService {

  public load$ = new BehaviorSubject<any>(null);

}
