import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from '@shared/shared.module';
import {WETTKAMPF_ROUTES} from './wettkampf.routing';
import {WettkampfComponent} from '@wettkampf/components';
import {StatistikFilterComponent} from '@shared/components/buttons/statistik-filter-button/statistik-filter.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(WETTKAMPF_ROUTES),
    SharedModule,
    FormsModule
  ],
  declarations: [WettkampfComponent, StatistikFilterComponent]
})
export class WettkampfModule {
}
