import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppUpdatesRoutingModule } from './app-updates-routing.module';
import { AppUpdatesComponent } from './app-updates.component';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AppUpdatesComponent
  ],
  imports: [
    CommonModule,
    AppUpdatesRoutingModule,
    FormsModule,
    NgxSpinnerModule
  ]
})
export class AppUpdatesModule { }
