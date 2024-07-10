import { NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import mapboxgl, { MapboxEvent } from 'mapbox-gl';


export class MapEventManager {

    private _pending: { observable: Observable<any>; observer: Subscriber<any> }[] = [];
    private _listeners: any[] = [];
    private _targetStream = new BehaviorSubject<any>(undefined);

    constructor(
        private _ngZone: NgZone
    ) { }

    private _clearListeners() {
        for (const event of this._listeners) {
            this._targetStream.value.off(event.name, event.listener);
        }

        this._listeners = [];
    }

    getLazyEmitter<T>(name: string): Observable<T> {
        return this._targetStream.pipe(
            switchMap(target => {
                const observable = new Observable<T>(observer => {

                    if (!target) {
                        this._pending.push({ observable, observer });
                        return undefined;
                    }

                    const listener = (event: any) => {
                        this._ngZone.run(() => observer.next(event));
                    }

                    target.on(name, listener);

                    if (!listener) {
                        observer.complete();
                        return undefined;
                    }

                    this._listeners.push({ name, listener });
                    return () => target.off(name, listener);
                });

                return observable;
            }),
        );
    }

    public setTarget(target: any): void {
        const currentTarget = this._targetStream.value;

        if (target === currentTarget) {
            return;
        }

        if (currentTarget) {
            this._clearListeners();
            this._pending = [];
        }

        this._targetStream.next(target);
        this._pending.forEach(subscriber => subscriber.observable.subscribe(subscriber.observer));
        this._pending = [];
    }

    public destroy(): void {
        this._clearListeners();
        this._pending = [];
        this._targetStream.complete();
    }
}