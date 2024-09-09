import { Routes } from '@angular/router';
import { ConnectionPageComponent } from './features/milvus-connection/pages/connection-page/connection-page.component';
import { WrapperComponent } from './shared/components/wrapper/wrapper.component';
import { DatabasesOverviewComponent } from '../app/features/milvus-management/pages/databases-overview/databases-overview.component';

export const routes: Routes = [
  {
    path: 'connect',
    loadComponent: () =>
      import(
        './features/milvus-connection/pages/connection-page/connection-page.component'
      ).then((r) => r.ConnectionPageComponent),
    title: 'Connect to Milvus',
  },
  {
    path: 'features',
    component: WrapperComponent,
    children: [
      {
        path: '',
        redirectTo: 'databases',
        pathMatch: 'full',
      },
      {
        path: 'databases',
        loadComponent: () =>
          import(
            '../app/features/milvus-management/pages/databases-overview/databases-overview.component'
          ).then((r) => DatabasesOverviewComponent),
        title: 'Databases Overview',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'connect',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'connect',
  },
];
