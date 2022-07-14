/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { UtilService } from './../../services/util.service';
import { ApiService } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {

  languages: any;
  dummy = Array(10);
  dummyLangs: any[] = [];
  page: number = 1;

  constructor(private router: Router, public api: ApiService, public util: UtilService) {
      this.getLanguges();
  }

  ngOnInit(): void {
  }

  getLanguges() {
      this.languages = [];
      this.dummy = Array(10);
      this.api.get_private('v1/languages/getAll').then((datas: any) => {
          console.log(datas);
          this.dummy = [];
          if (datas && datas.data) {
              this.languages = datas.data;
              this.languages = _.sortBy(this.languages, ['id'], ['asc']);
              this.dummyLangs = this.languages;
          }
      }, error => {
          this.dummy = [];
          console.log('Error', error);
          this.util.apiErrorHandler(error);
      }).catch(error => {
          this.dummy = [];
          console.log('Err', error);
          this.util.apiErrorHandler(error);
      });
  }

  search(str) {
      this.resetChanges();
      console.log('string', str);
      this.languages = this.filterItems(str);
  }

  protected resetChanges = () => {
      this.languages = this.dummyLangs;
  }

  setFilteredItems() {
      console.log('clear');
      this.languages = [];
      this.languages = this.dummyLangs;
  }

  filterItems(searchTerm) {
      return this.languages.filter((item) => {
          return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });
  }

  changeDefault(event, item) {
      console.log(event, item);
      this.util.show();
      const param = {
          id: item.id,
      };
      this.api.post_private('v1/languages/changeDefault', param).then((datas) => {
          this.util.hide();
          console.log(datas);
          localStorage.setItem('translateKey', item.id);
          window.location.reload();
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

  getClass(item) {
      if (item == '1' || item == 1) {
          return 'badge badge-success';
      } else if (item == '0' || item == 0) {
          return 'badge badge-danger';
      }
      return 'badge badge-warning';
  }

  createNew() {
      this.router.navigate(['manage-languages']);
  }

  changeStatus(item) {
      const text = item.status == 1 ? 'Deactive' : 'Active';
      Swal.fire({
          title: this.util.translate('Are you sure?'),
          text: this.util.translate('To ') + this.util.translate(text) + this.util.translate(' this language!'),
          icon: 'question',
          showConfirmButton: true,
          confirmButtonText: this.util.translate('Yes'),
          showCancelButton: true,
          cancelButtonText: this.util.translate('Cancel'),
          backdrop: false,
          background: 'white'
      }).then((data) => {
          if (data && data.value) {
              console.log('update it');
              const query = item.status == 1 ? 0 : 1;
              item.status = query;
              this.util.show();
              this.api.post_private('v1/languages/update', item).then((datas) => {
                  this.util.hide();
                  this.getLanguges();
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
      });
  }

  view(item) {
      const param: NavigationExtras = {
          queryParams: {
              id: item.id,
              edit: true
          }
      };
      this.router.navigate(['manage-languages'], param);
  }
}
