import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';

@Component({
    selector: 'mapbox-geolocation-control',
    templateUrl: './mapbox-geolocation.component.html',
    styleUrls: ['./mapbox-geolocation.component.scss'],
    standalone: true,
    imports: [CommonModule, MatTooltipModule, MatButtonModule, MatIconModule, MatButtonToggleModule, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapboxGeolocationComponent implements OnDestroy, OnInit {

    public position: any;

    @Input() public isShowGeolocationControl = true;
    @Input() public isDisableGeolocationControl = false;
    @Input() public isResetGeolocationControl = true;
    @Input() public tooltipSettings = 'Мое местоположение';

    @Output() public geoLocation: Subject<boolean> = new Subject<boolean>();
    @Output() public onChange: Subject<boolean> = new Subject<boolean>();

    public ngOnInit(): void {
        this.getLocation();
    }

    public ngOnDestroy(): void { }

    public getLocation(): void {
        if (!navigator?.geolocation) return;
        navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
            if (!position) return;
            this.position = [position.coords.longitude,position.coords.latitude];
            this.geoLocation.next(this.position);

        },
            (error: GeolocationPositionError) => console.log(error));

    }

    public onClick() {
        this.onChange.next(this.position);
    }

}