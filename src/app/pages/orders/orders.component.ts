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

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  @ViewChild('myModal3') public myModal3: ModalDirective;
  dummy = Array(10);
  dummyOrders: any[] = [];
  orders: any[] = [];
  page: number = 1;
  constructor(
    public util: UtilService,
    public api: ApiService,
    private router: Router
  ) {
    this.getOrders();
  }

  ngOnInit(): void {
  }

  getOrders() {
    this.api.get_private('v1/orders/getAll').then((data: any) => {
      this.dummy = [];
      if (data && data.status && data.status == 200 && data.success) {
        console.log(">>>>>", data);
        if (data && data.data.length > 0) {
          this.orders = data.data;
          this.dummyOrders = data.data;
          console.log("======", this.orders);
        }
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

  getNames(storeInfo) {
    const names = storeInfo.map(x => x.name);
    return names.join();
  }

  exportCSV() {

    let data = [];
    this.orders.forEach(element => {
      const info = {
        'id': this.util.replaceWithDot(element.id),
        'username': this.util.replaceWithDot(element.first_name) + ' ' + this.util.replaceWithDot(element.last_name),
        'store': this.util.replaceWithDot(this.getNames(element.storeInfo)),
        'date': this.util.replaceWithDot(element.date_time),
        'total': this.util.replaceWithDot(element.grand_total),
        'order_to': this.util.replaceWithDot(element.order_to),
        'store_id': this.util.replaceWithDot(element.store_id),
      }
      data.push(info);
    });
    const name = 'orders';
    this.util.downloadFile(data, name, ['id', 'username', 'store', 'date', 'total', 'order_to', 'store_id']);
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
      this.api.uploaCSV(files, 'v1/orders/importData').subscribe((data: any) => {
        console.log('==>>>>>>', data.data);
        this.util.hide();
        this.myModal3.hide();
        this.util.success('Uploaded');
        this.getOrders();
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
    window.open('assets/sample/orders.csv', '_blank');
  }

  search(str) {
    this.resetChanges();
    console.log('string', str);
    if (str != '') {
      this.orders = this.filterItems(str);
    }
  }


  protected resetChanges = () => {
    this.orders = this.dummyOrders;
  }

  filterItems(searchTerm) {
    return this.orders.filter(x => x.id == searchTerm);

  }

  setFilteredItems() {
    console.log('clear');
    this.orders = [];
    this.orders = this.dummyOrders;
  }

  viewsInfo(item) {
    const param: NavigationExtras = {
      queryParams: {
        id: item
      }
    }
    this.router.navigate(['order-details'], param);
  }
}
