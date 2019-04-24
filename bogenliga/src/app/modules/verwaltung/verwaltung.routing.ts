import {Routes} from '@angular/router';

import {
  BenutzerDetailComponent,
  BenutzerNeuComponent,
  BenutzerOverviewComponent,
  DsbMitgliedDetailComponent,
  DsbMitgliedOverviewComponent,
  LigaDetailComponent,
  LigaOverviewComponent,
  RegionDetailComponent,
  RegionOverviewComponent,
  VereinDetailComponent,
  VereinOverviewComponent,
  VerwaltungComponent,
  WettkampfklasseDetailComponent,
  WettkampfklasseOverviewComponent
} from './components';
import {
  BenutzerDetailGuard,
  BenutzerNeuGuard,
  BenutzerOverviewGuard,
  DsbMitgliedDetailGuard,
  DsbMitgliedOverviewGuard,
  LigaDetailGuard,
  LigaOverviewGuard,
  RegionDetailGuard,
  RegionOverviewGuard,
  VereinDetailGuard,
  VereinOverviewGuard,
  VerwaltungGuard,
  WettkampfklasseDetailGuard,
  WettkampfklasseOverviewGuard
} from './guards';

export const VERWALTUNG_ROUTES: Routes = [
  {path: '', component: VerwaltungComponent, canActivate: [VerwaltungGuard]},
  {
    path: 'dsbmitglieder',
    component: DsbMitgliedOverviewComponent,
    pathMatch: 'full',
    canActivate: [DsbMitgliedOverviewGuard]
  },
  {path: 'dsbmitglieder/:id', component: DsbMitgliedDetailComponent, canActivate: [DsbMitgliedDetailGuard]}
  ,
  {
    path: 'benutzer',
    component: BenutzerOverviewComponent,
    pathMatch: 'full',
    canActivate: [BenutzerOverviewGuard]
  },
  {path: 'benutzer/add', component: BenutzerNeuComponent, canActivate: [BenutzerNeuGuard]}
  ,
  {path: 'benutzer/:id', component: BenutzerDetailComponent, canActivate: [BenutzerDetailGuard]},
  {
    path: 'klassen',
    component: WettkampfklasseOverviewComponent,
    pathMatch: 'full',
    canActivate: [WettkampfklasseOverviewGuard]
  },
  {path: 'klassen/:id', component: WettkampfklasseDetailComponent, canActivate: [WettkampfklasseDetailGuard]},
  {
    path: 'vereine',
    component: VereinOverviewComponent,
    pathMatch: 'full',
    canActivate: [VereinOverviewGuard]
  },
  {path: 'vereine/:id', component: VereinDetailComponent, canActivate: [VereinDetailGuard]},
  {
    path: 'liga',
    component: LigaOverviewComponent,
    pathMatch: 'full',
    canActivate: [LigaOverviewGuard]
  },
  {path: 'region/:id', component: RegionDetailComponent, canActivate: [RegionDetailGuard]},
  {
    path: 'region',
    component: RegionOverviewComponent,
    pathMatch: 'full',
    canActivate: [RegionOverviewGuard]
  },
  {path: 'region/:id', component: RegionDetailComponent, canActivate: [RegionDetailGuard]}
];
