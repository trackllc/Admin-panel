import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// external libs
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ISidebarNavTab } from '../interfaces/sidebar-nav-tab.interface';
import { IDictionary } from '../interfaces/dictionary.interface';
import { sidebarNavTabsConst } from '../../constants/sidebar-nav-tabs.token';
import { ICompanyUiSetting } from '../interfaces/company-ui.interface';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    public uiSettings$ = new BehaviorSubject<IDictionary<boolean> | null>(null);
    public setting$ = new BehaviorSubject<any | null>(null);
    constructor(
    ) {
        this._initSettings()
    }

    private _initSettings(): void {
        this.setting$.next([
            {
                settingCode: 'board',
                settingName: 'Панель',
                settingIsForSearchAndBook: true,
                settingIsReadonly: false,
                isShow: true,
                id: 4

            }, {
                settingCode: 'orders',
                settingName: 'Заказы',
                settingIsForSearchAndBook: true,
                settingIsReadonly: false,
                isShow: true,
                id: 4

            },
            {
                settingCode: 'tasks',
                settingName: 'Задачи',
                settingIsForSearchAndBook: true,
                settingIsReadonly: false,
                isShow: true,
                id: 4

            },
            {
                settingCode: 'finance',
                settingName: 'Финансы',
                settingIsForSearchAndBook: true,
                settingIsReadonly: false,
                isShow: true,
                id: 10

            },
            {
                settingCode: 'documents',
                settingName: 'Документы',
                settingIsForSearchAndBook: true,
                settingIsReadonly: false,
                isShow: true,
                id: 4

            }, {
                settingCode: 'tracking',
                settingName: 'Отслеживание',
                settingIsForSearchAndBook: true,
                settingIsReadonly: false,
                isShow: true,
                id: 1

            }, {
                settingCode: 'logistics-map',
                settingName: 'Карта логистики',
                settingIsForSearchAndBook: true,
                settingIsReadonly: false,
                isShow: true,
                id: 1
            }, {
                settingCode: 'route-planner',
                settingName: 'Планировщик маршрутов',
                settingIsForSearchAndBook: true,
                settingIsReadonly: false,
                isShow: true,
                id: 1
            }]);
        this.setting$.subscribe((setting) => {
            this._initUiSettings(setting);
        });
    }

    private _initUiSettings(settings: ICompanyUiSetting[]): void {
        const filtered = settings.filter((value) => value.settingIsForSearchAndBook);
        this.uiSettings$.next(filtered.reduce((o, curr) => ({ ...o, [curr.settingCode]: curr.isShow }), {}));
    }

    public filterNavs(): Observable<ISidebarNavTab[]> {
        return this.uiSettings$
            .pipe(
                filter(Boolean),
                map((items) => sidebarNavTabsConst.filter((nav: any) => items[nav.name])),
            );
    }
}
