import { NgModule } from '@angular/core';
import { MapboxMap } from './mapbox-map/mapbox-map.component';
import { MapboxZoomControlComponent } from './mapbox-zoom-control/mapbox-zoom-control.component';
import { MapboxFullscreenComponent } from './mapbox-fullscreen/mapbox-fullscreen.component';
import { MapboxGeojsonSourceComponent } from './mapbox-geojson-source/mapbox-geojson-source.component';
import { MapboxLayerComponent } from './mapbox-layer/mapbox-layer.component';
import { MapboxGeolocationComponent } from './mapbox-geolocation/mapbox-geolocation.component';
import { MapboxMarkerComponent } from './mapbox-marker/mapbox-marker.component';
import { MapboxPopupComponent } from './mapbox-popup/mapbox-popup.component';
import { MapboxImageComponent } from './mapbox-image/mapbox-image';

const COMPONENTS = [
    MapboxMap,
    MapboxZoomControlComponent,
    MapboxFullscreenComponent,
    MapboxGeolocationComponent,
    MapboxGeojsonSourceComponent,
    MapboxLayerComponent,
    MapboxMarkerComponent,
    MapboxPopupComponent,
    MapboxImageComponent
];

@NgModule({
    imports: COMPONENTS,
    exports: COMPONENTS,
})
export class MglModule { }