import { Routes } from '@angular/router';
import { ConnectionPageComponent } from './features/milvus-connection/pages/connection-page/connection-page.component';
import { WrapperComponent } from './shared/components/wrapper/wrapper.component';
import { DatabasesOverviewComponent } from '../app/features/milvus-management/pages/databases-overview/databases-overview.component';
import { ConnectGuard } from './guards/connect.guard';
import { CollectionsOverviewComponent } from '../app/features/milvus-management/pages/collections-overview/collections-overview.component';
import { CollectionDetailsComponent } from '../app/features/milvus-management/pages/collection-details/collection-details.component';

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
    canActivate: [ConnectGuard],
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
      {
        path: 'databases/:db_name/collections',
        loadComponent: () =>
          import(
            '../app/features/milvus-management/pages/collections-overview/collections-overview.component'
          ).then((r) => CollectionsOverviewComponent),
        title: 'Collections Overview',
      },
      {
        path: 'databases/:db_name/collections/:coll_name',
        loadComponent: () =>
          import(
            '../app/features/milvus-management/pages/collection-details/collection-details.component'
          ).then((r) => CollectionDetailsComponent),
        title: 'Collection Details',
      }
     
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
