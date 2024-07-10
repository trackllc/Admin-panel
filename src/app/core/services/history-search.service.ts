import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';

// external libs
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';



@Injectable()
export class HistorySearchService {

    public refresh$ = new BehaviorSubject<boolean>(false);
    public current$ = new BehaviorSubject<any | null>(null);

    private _entity = 'HistorySearchRequest';

    constructor(
        private _http: HttpClient,
        private _activated: ActivatedRoute,
    ) {

        const trf = {
            sessionId: '',
            trip: '',
            routes: [{
                id: '',
                fromLocation: { iata: '1', latitude: 1111, longitude: 22222, googlePlaceId: 'ssss', pointAddress: {}, address: 'aaa' },
                toLocation: { iata: '1', latitude: 1111, longitude: 22222, googlePlaceId: 'ssss', pointAddress: {}, address: 'aaa' }

            }, {
                id: '',
                toLocation: { iata: '1', latitude: 1111, longitude: 22222, googlePlaceId: 'ssss', pointAddress: {}, address: 'aaa' },
                fromLocation: { iata: '1', latitude: 1111, longitude: 22222, googlePlaceId: 'ssss', pointAddress: {}, address: 'aaa' }

            }]
        };


        this.current$.next(trf);
    }



}


class PointAddress {
    country?: string;
    city?: string;
    house?: string;
    postCode?: string;
    countryCode?: string;
    district?: string;
    street?: string;
    description?: string;
}


export interface ILocation {
    address: string;
    iata: string;
    latitude: number;
    longitude: number;
    googlePlaceId: string;
    pointAddress: PointAddress;
}

export class Location implements ILocation {

    public address: string;
    public iata: string;
    public latitude: number;
    public longitude: number;
    public googlePlaceId: string;
    public pointAddress: PointAddress;

    constructor(obj?: Partial<Location>) {
        Object.assign(this, obj);
    }

}

class Route {

    public id: string;
    public fromLocation: ILocation;
    public toLocation: ILocation;
    public toDate: string;
    public returnFromDate: string;
    public returnToDate: string;
    public shiftTime: number;
    public flightNumber: string;

    constructor(obj?: Partial<Route>) {
        Object.assign(this, obj);
    }
}

class TransferFilter {

    public clientId: string;
    public sessionId: string;
    public trip: string;
    public routes: Route[];
    public travelersQuantity: number;
    public luggageQuantity: number;
    public petQuantity: number;
    public isWheelChair: boolean;
    public waitTime: number;
    public connectionId: string;
    public children: number[];
    public staticUrl: string;

    public primaryTraveler: any;

    constructor(obj?: Partial<TransferFilter>) {
        Object.assign(this, obj);
    }

}

