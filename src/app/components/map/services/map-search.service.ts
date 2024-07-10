import { map } from "rxjs";
import { HttpClientService } from "../../../core/services/http-client.service";
import { Injectable } from "@angular/core";

@Injectable()
export class MapSearchService {

    constructor(
        private _http: HttpClientService
    ) { }

   
    public autoComplete(query: string) {
        const url = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${query}&access_token=pk.eyJ1Ijoibm92YWthbmQiLCJhIjoiY2p3OXFlYnYwMDF3eTQxcW5qenZ2eGNoNCJ9.PTZDfrwxfMd-hAwzZjwPTg&session_token=8D8AC610-566D-4EF0-9C22-186B2A5ED793`;
        return this._http.get(url)
            .pipe(
                map((data) => console.log(data)),
            );
    }

    public search(query: string) {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=pk.eyJ1Ijoic2VhcmNoLW1hY2hpbmUtdXNlci0xIiwiYSI6ImNrNnJ6bDdzdzA5cnAza3F4aTVwcWxqdWEifQ.RFF7CVFKrUsZVrJsFzhRvQ&limit=5`;
        return this._http.get(url);
            
    }

}