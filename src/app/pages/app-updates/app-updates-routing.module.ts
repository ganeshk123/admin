import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppUpdatesComponent } from './app-updates.component';

const routes: Routes = [
  {
    path: '',
    component: AppUpdatesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppUpdatesRoutingModule { }
