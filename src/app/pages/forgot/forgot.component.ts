/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {

  login: any = {
    email: '',
  };
  otpForm: any = {
    otp: ''
  };
  passwords: any = {
    password: '',
    confirm: ''
  }
  div: any = 1;
  otp_id: any;
  temp: any = '';
  constructor(
    public api: ApiService,
    public util: UtilService,
    private location: Location
  ) { }

  ngOnInit(): void {
  }

  goToTabs() {


    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.login.email)) {
      this.util.error(this.util.translate('Please enter valid email'));
      return false;
    }
    console.log('login');

    const param = {
      email: this.login.email,
      subject: this.util.translate('Reset Password'),
      header_text: this.util.translate('Use this code to reset your password'),
      thank_you_text: this.util.translate("Don't share this OTP to anybody else"),
      mediaURL: this.api.imageUrl,
    }
    this.util.show();
    this.api.post('v1/users/emailExist', param).then((data: any) => {
      this.util.hide();
      console.log(data);
      if (data && data.status && data.status == 200 && data.data && data.data == true && data.otp_id) {
        this.otp_id = data.otp_id;
        this.div = 2;
      } else {
        this.util.error(this.util.translate('This email is not exist'));
      }

    }, error => {
      this.util.hide();
      console.log(error);
      if (error && error.status == 401 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      if (error && error.status == 500 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }

      this.util.error(this.util.translate('Something went wrong'));
    }).catch((error) => {
      this.util.hide();

      console.log(error);
      if (error && error.status == 401 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      if (error && error.status == 500 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      this.util.hide();
      this.util.error(this.util.translate('Something went wrong'));
    });

  }

  onOTP() {
    if (this.otpForm.otp == '' || !this.otpForm.otp) {
      this.util.error(this.util.translate('Please enter OTP'));
      return false;
    }
    this.util.show();

    const param = {
      // id: this.otp_id,
      // otp: this.otpForm.otp
      id: this.otp_id,
      otp: this.otpForm.otp,
      type: 'email',
      email: this.login.email,
      country_code: 'NA',
      mobile: 'NA'
    };
    this.api.post('v1/otp/verifyOTPReset', param).then((data: any) => {
      console.log(data);
      this.util.hide();

      if (data && data.status && data.status == 200 && data.data) {
        this.temp = data.temp;
        console.log('temp token', this.temp);
        this.div = 3;
      }
    }, error => {
      this.util.hide();
      console.log(error);
      if (error && error.status == 401 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      if (error && error.status == 500 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      this.util.hide();
      this.util.error(this.util.translate('Wrong OTP'));
    }).catch((error) => {
      this.util.hide();
      console.log(error);
      if (error && error.status == 401 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      if (error && error.status == 500 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      this.util.hide();
      this.util.error(this.util.translate('Wrong OTP'));
    });
  }

  onOtpChange(event) {
    console.log(event);
    this.otpForm.otp = event;
  }

  goToBack() {
    this.location.back();
  }
  updatePassword() {
    if (this.passwords.password != this.passwords.confirm) {
      this.util.error(this.util.translate('Password does not match'));
      return false;
    }
    this.util.show();
    const param = {
      id: this.otp_id,
      email: this.login.email,
      password: this.passwords.password
    };
    this.api.post_temp('v1/password/updateUserPasswordWithEmail', param, this.temp).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status == 200 && data.data) {
        this.util.success(this.util.translate('Password Updated'));
        this.goToBack();
      }
    }, error => {
      this.util.hide();
      console.log(error);
      if (error && error.status == 401 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      if (error && error.status == 500 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      this.util.hide();
      this.util.error(this.util.translate('Wrong OTP'));
    }).catch((error) => {
      this.util.hide();
      console.log(error);
      if (error && error.status == 401 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      if (error && error.status == 500 && error.error.error) {
        this.util.error(error.error.error);
        return false;
      }
      this.util.hide();
      this.util.error(this.util.translate('Wrong OTP'));
    });
  }

}
