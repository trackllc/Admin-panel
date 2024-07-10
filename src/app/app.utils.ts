
import { timer } from 'rxjs';
import { ISidebarNavTab } from './interfaces/sidebar-nav-tab.interface';

export class AppUtils {

    public static getActiveTab(router:any, sidebarNavTabs: ISidebarNavTab[]): string {
        let tabName = null;
        if (router.url.indexOf('/tools') === 0) {
            switch (router.url) {
                case '/tools/logistics-map':
                case '/tools/tracking':
                case '/tools/route-planner':
                    tabName = (router.url.split('/'))[2];
                    break;
            }
       } else {
           const tab = sidebarNavTabs.filter((v) => router.url.indexOf(v.url) === 0)[0];
           tabName = tab ? tab.name : '';
       }
        return tabName;
    }

    public static delay(delayValue: number) {
      return timer(delayValue);
    }

}