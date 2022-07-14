/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagePopupRoutingModule } from './manage-popup-routing.module';
import { ManagePopupComponent } from './manage-popup.component';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    ManagePopupComponent
  ],
  imports: [
    CommonModule,
    ManagePopupRoutingModule,
    FormsModule,
    NgxSpinnerModule,
  ]
})
export class ManagePopupModule { }
