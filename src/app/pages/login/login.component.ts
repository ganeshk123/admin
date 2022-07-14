/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  email: any = 'admin@initappz.com';
  password: any = 'admin@123';
  languageId: any;
  constructor(
    public api: ApiService,
    public util: UtilService,
    private router: Router
  ) {
    setTimeout(() => {
      this.languageId = parseInt(localStorage.getItem('translateKey'));
    }, 1000);
  }

  onLogin() {
    if (this.email == null || this.password == null || this.email == '' || this.password == '') {
      this.util.error(this.util.translate('All Fields are required'));
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.email)) {
      this.util.error(this.util.translate('Please enter valid email'));
      return false;
    }

    this.util.show();
    const param = {
      email: this.email,
      password: this.password
    }
    this.api.post('v1/auth/adminLogin', param).then((data: any) => {
      console.log("+++++++++++++++", data);
      this.util.hide();
      if (data && data.status && data.status == 200 && data.user && data.user.type == 'admin') {
        localStorage.setItem('uid', data.user.id);
        localStorage.setItem('token', data.token)
        this.router.navigate(['']);
      } else if (data && data.status == 401 && data.error.error) {
        this.util.error(data.error.error);
      } else if (data && data.user && data.user.type != 0) {
        this.util.error(this.util.translate('Access denied'));
      } else {
        this.util.error(this.util.translate('Something went wrong'));
      }
    }, error => {
      this.util.hide();
      console.log('Error', error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.hide();
      console.log('Err', error);
      this.util.apiErrorHandler(error);
    });
  }

  forgot() {
    console.log('item');
    this.router.navigate(['forgot']);
  }

  updateLanguage() {
    console.log('tihs', this.languageId);
    localStorage.setItem('translateKey', this.languageId);
    window.location.reload();
  }
}
