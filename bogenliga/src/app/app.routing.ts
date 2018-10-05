import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './modules/login/components/login/login.component';
import { HomeComponent } from './modules/home/components/home/home.component';

export const ROUTES: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'wettkaempfe', loadChildren: 'src/app/modules/wettkampf/wettkampf.module#WettkampfModule' },
  { path: 'settings', loadChildren: 'src/app/modules/settings/settings.module#SettingsModule' },
  { path: 'verwaltung', loadChildren: 'src/app/modules/verwaltung/verwaltung.module#VerwaltungModule' },
  { path: 'sportjahresplan', loadChildren: 'src/app/modules/sportjahresplan/sportjahresplan.module#SportjahresplanModule' },
  { path: 'impressum', loadChildren: 'src/app/modules/impressum/impressum.module#ImpressumModule' }
];
