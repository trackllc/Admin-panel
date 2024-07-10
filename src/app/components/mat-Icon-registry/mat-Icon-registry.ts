import { CommonModule } from '@angular/common';
import { Component, importProvidersFrom, OnInit } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ICustomIcon } from './interfaces/custom-icon.interface';
import { customIcons } from './constants/custom-icons.constant';

@Component({
    selector: 'app-sections',
    imports: [CommonModule, MatIconModule, HttpClientModule],
    templateUrl: './sections.component.html',
    // styleUrls: ['./sections.component.css'],
    providers: [HttpClient],
    standalone: true,
})
export class MatIconsBuildComponent {
    sections = [
        {
            name: 'Icons',
            class: 'material-icons-round',
            items: ['test'],
        },
        {
            name: 'Symbols (new)',
            class: 'material-symbols-rounded',
            items: ['test'],
        },
        {
            name: 'Custom SVG',
            class: '',
            items: ['test'],
        },
    ];
    constructor(
        private matIconRegistry: MatIconRegistry,
        private domSanitizer: DomSanitizer
    ) {
        this.buildIcons();
    }

    public buildIcons() {
        customIcons.forEach((icon: ICustomIcon) => {
            console.log(icon.path);
            this.matIconRegistry.addSvgIcon(
                icon.svg,
                this.domSanitizer.bypassSecurityTrustResourceUrl(icon.path)
            );
        });
    }
}
