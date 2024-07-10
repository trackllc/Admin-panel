import { DocumentElement } from '../../map/enums/document-element';
import { FullscreenService } from '../../map/services/map-fullscreen.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'mapbox-geolocation-control',
    templateUrl: './mapbox-geolocation.component.html',
    styleUrls: ['./mapbox-geolocation.component.scss'],
    standalone: true,
    imports: [CommonModule, MatTooltipModule, MatButtonModule, MatIconModule, MatButtonToggleModule, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapboxGeolocationComponent implements OnDestroy, OnInit {

    @Input() public isShowGeolocationControl = true;
    @Input() public isDisableGeolocationControl = false;
    @Input() public isResetGeolocationControl = true;
    @Input() public tooltipSettings = 'Мое местоположение';

    public ngOnInit(): void {
        this.getLocation();
    }

    public ngOnDestroy(): void {

    }

    public onChange(): void {

    }

    public getLocation(): void {
        if (!navigator?.geolocation) return;
        navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
            if (position) {
                console.log("Latitude: " + position.coords.latitude +
                    "Longitude: " + position.coords.longitude);
            }
        },
            (error: GeolocationPositionError) => console.log(error));

    }

}