/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ApiService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  @ViewChild('myModal3') public myModal3: ModalDirective;
  dummy: any[] = [];
  list: any[] = [];
  dummyList: any[] = [];

  page: number = 1;
  cities: any[] = [];
  selectedCities: any = '';
  constructor(
    public util: UtilService,
    public api: ApiService,
    private router: Router
  ) {
    this.getList();
  }

  getList() {
    this.dummy = Array(5);
    this.list = [];
    this.dummyList = [];
    this.api.get_private('v1/products/getAll').then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status && data.status == 200 && data.data && data.data.length) {
        this.list = data.data;
        this.dummyList = data.data;
        console.log(Object.keys(this.list[0]));
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.dummy = [];
      this.util.apiErrorHandler(error);
    });
  }

  ngOnInit(): void {
  }

 
  changeStatus(item) {
    console.log(item);
    Swal.fire({
      title: this.util.translate('Are you sure?'),
      text: this.util.translate('To update this item?'),
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
        const body = {
          id: item.id,
          status: item.status == 0 ? 1 : 0
        };
        console.log("========", body);
        this.util.show();
        this.api.post_private('v1/products/updateStatus', body).then((data: any) => {
          this.util.hide();
          console.log("+++++++++++++++", data);
          if (data && data.status && data.status == 200 && data.success) {
            this.util.success(this.util.translate('Status Updated !'));
            this.getList();
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
    });
    //products/updateStatus
  }

  search(str) {
    this.resetChanges();
    console.log('string', str);
    this.list = this.filterItems(str);
  }

  inHome(item) {
    const body = {
      id: item.id,
      in_home: item.in_home == 0 ? 1 : 0
    };
    console.log("========", body);
    this.util.show();
    this.api.post_private('v1/products/updateHome', body).then((data: any) => {
      this.util.hide();
      console.log("+++++++++++++++", data);
      if (data && data.status && data.status == 200 && data.success) {
        this.util.success(this.util.translate('Status Updated !'));
        this.getList();
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

  inOffers(item) {
    const body = {
      id: item.id,
      in_offer: item.in_offer == 0 ? 1 : 0
    };
    console.log("========", body);
    this.util.show();
    this.api.post_private('v1/products/updateOffers', body).then((data: any) => {
      this.util.hide();
      console.log("+++++++++++++++", data);
      if (data && data.status && data.status == 200 && data.success) {
        this.util.success(this.util.translate('Status Updated !'));
        this.getList();
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

  protected resetChanges = () => {
    this.list = this.dummyList;
  }

  filterItems(searchTerm) {
    return this.list.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  setFilteredItems() {
    console.log('clear');
    this.list = [];
    this.list = this.dummyList;
  }

  addNew() {
    this.router.navigate(['manage-store']);
  }

  exportCSV() {
    let data = [];
    this.list.forEach(element => {
      const info = {
        'id': this.util.replaceWithDot(element.id),
        'name': this.util.replaceWithDot(element.name),
        'cover': this.util.replaceWithDot(element.cover),
        'original_price': this.util.replaceWithDot(element.original_price),
        'sell_price': this.util.replaceWithDot(element.sell_price),
        'certificate_url': this.util.replaceWithDot(element.certificate_url),
        'in_stoke': this.util.replaceWithDot(element.in_stoke),
        'rating': this.util.replaceWithDot(element.rating),
        'total_rating': this.util.replaceWithDot(element.total_rating),
        'in_home': this.util.replaceWithDot(element.in_home),
        'in_offer': this.util.replaceWithDot(element.in_offer),
      }
      data.push(info);
    });
    const name = 'products';
    this.util.downloadFile(data, name, ['id', 'name', 'cover', 'original_price','sell_price','in_stoke','rating','total_rating','in_home','in_offer']);
  }


  filter() {
    console.log(this.selectedCities);
    this.list = this.dummyList.filter(x => x.cid == this.selectedCities);
  }

  clearFilter() {
    this.selectedCities = '';
    this.list = this.dummyList;
  }

  saveType() {
    this.myModal3.hide();
  }

  uploadCSV(files) {
    console.log('fle', files);
    if (files.length == 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/text\/*/) == null) {
      return;
    }

    if (files) {
      console.log('ok');
      this.util.show();
      this.api.uploaCSV(files, 'v1/products/importData').subscribe((data: any) => {
        console.log('==>>>>>>', data.data);
        this.util.hide();
        this.myModal3.hide();
        this.util.success('Uploaded');
        this.getList();
      }, err => {
        console.log(err);
        this.util.hide();
        this.util.apiErrorHandler(err);
      });
    } else {
      console.log('no');
    }
  }

  importCSV() {
    this.myModal3.show();
  }

  downloadSample() {
    window.open('assets/sample/products.csv', '_blank');
  }

}
