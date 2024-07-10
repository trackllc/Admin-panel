import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './components/board/board.component';
import { OrdersComponent } from './components/orders/orders.component';
import { TasksComponent } from './components/tasks/task.component';
import { AuthGuard } from './core/guards/auth.guard';
import { PageGuard } from './core/guards/page.guard';
import { FinanceComponent } from './components/finance/finance.component';
import { DocumentsComponent } from './components/ documents/documents.component';

export const routes: Routes = [
    {
        path: 'board', component: BoardComponent, canActivate: [AuthGuard]
    },
    {
        path: 'orders', component: OrdersComponent, canActivate: [AuthGuard]
    },
    {
        path: 'documents', component: DocumentsComponent, canActivate: [AuthGuard]
    },
    {
        path: 'finance', component: FinanceComponent, canActivate: [AuthGuard]
    },
    { path: 'tasks', component: TasksComponent, canActivate: [AuthGuard] },
    {
        path: 'login',
        loadComponent: () =>
            import('./components/login/login.component').then((x) => x.LoginComponent),
        canActivate: [PageGuard]
    },
    {
        path: 'tools', loadComponent: () =>
            import('./components/tools/components/tools/tools.component').then((x) => x.ToolsComponent),
        children: [
            {
                path: 'logistics-map',
                data: { sidenav: 'logistics', sidenavContent: 'none' },
                loadComponent: () => import('./components/tools/components/logistics-map/logistics-map.component').then((x) => x.LogistcicsComponent),
                canActivate: [AuthGuard]
            },
            {
                path: 'tracking',
                data: { sidenav: 'tracking', sidenavContent: 'none' },
                loadComponent: () => import('./components/tools/components/tracking/tracking.component').then((x) => x.TrackingComponent),
                canActivate: [AuthGuard]

            },
            {
                path: 'route-planner',
                data: { sidenav: 'planner', sidenavContent: 'none' },
                loadComponent: () => import('./components/tools/components/route-planner/route-planner.component').then((x) => x.PlannerComponent),
                canActivate: [AuthGuard]
            },
        ]
    },

    { path: 'login', pathMatch: 'full', redirectTo: '/login' },
    { path: '', pathMatch: 'full', redirectTo: '/board' }
];

export const routing = RouterModule.forRoot(routes);

