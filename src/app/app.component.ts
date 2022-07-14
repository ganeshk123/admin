/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { ApiService } from './services/api.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { UtilService } from './services/util.service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>',
  providers: [IconSetService],

})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    public iconSet: IconSetService,
    public api: ApiService,
    public util: UtilService
  ) {
    // iconSet singleton
    iconSet.icons = { ...freeSet };
    const language = localStorage.getItem('translateKey');
    if (language && language != null && language != 'null') {
      this.api.post('v1/settings/getByLanguageIdWeb', { id: language }).then((data: any) => {
        console.log('by language', data);
        if (data && data.status && data.status == 200) {
          this.saveSettings(data);
          
        }
      }, error => {
        console.log(error);
        this.util.apiErrorHandler(error);
      }).catch(error => {
        console.log(error);
        this.util.apiErrorHandler(error);
      });
    } else {
      this.api.get_public('v1/settings/getDefaultWeb').then((data: any) => {
        console.log('by default', data);
        if (data && data.status && data.status == 200) {
          this.saveSettings(data);
          
        }
      }, error => {
        console.log(error);
        this.util.apiErrorHandler(error);
      }).catch(error => {
        console.log(error);
        this.util.apiErrorHandler(error);
      });
    }
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  saveSettings(data) {
    const lang = data && data.data && data.data.language ? data.data.language : null;
    if (lang && lang !== null) {
      this.util.translations = JSON.parse(lang.content);
      localStorage.setItem('translateKey', lang.id);
    }
    const settings = data && data.data && data.data.settings ? data.data.settings : null;
    if (settings) {
      this.util.appLogo = settings.logo;
      this.util.direction = settings.appDirection;
      this.util.app_status = settings.app_status == 1 ? true : false;
      this.util.app_color = settings.app_color;
      this.util.currecny = settings.currencySymbol;
      this.util.cside = settings.currencySide;
      localStorage.setItem('theme', 'primary');
      document.documentElement.dir = this.util.direction;
    }

    const general = data && data.data && data.data.general ? data.data.general : null;
    if (general) {
      this.util.appName = general.name;
      this.util.general = general;
    }

    this.util.allLanguages = data.data.allLanguages;

    console.log(this.util);
    // this.util.navigateRoot('');
  }
}
