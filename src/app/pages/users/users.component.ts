/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NavigationExtras } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';
import Swal from 'sweetalert2';
@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
    @ViewChild('myModal3') public myModal3: ModalDirective;
    dummy = Array(10);
    dummyUsers = [];
    users;
    page: number = 1;

    constructor(
        private router: Router,
        public api: ApiService,
        public util: UtilService) {
        this.getAllUsers();
    }

    ngOnInit(): void {
    }

    getAllUsers() {
        this.api.get_private('v1/users/getAll').then((data: any) => {
            this.dummy = [];
            if (data && data.status && data.status == 200 && data.success) {
                console.log(">>>>>", data);
                if (data && data.data.length > 0) {
                    this.users = data.data;
                    this.dummyUsers = data.data;
                    console.log("======", this.users);
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

    search(str) {
        this.resetChanges();
        console.log('string', str);
        this.users = this.filterItems(str);
    }


    protected resetChanges = () => {
        this.users = this.dummyUsers;
    }

    filterItems(searchTerm) {
        return this.users.filter((item) => {
            var name = item.first_name + " " + item.last_name;
            return name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });
    }

    setFilteredItems() {
        console.log('clear');
        this.users = [];
        this.users = this.dummyUsers;
    }

    getClass(item) {
        if (item == '1' || item == 1) {
            return 'badge badge-success';
        } else if (item == '0' || item == 0) {
            return 'badge badge-danger';
        }
        return 'badge badge-warning';
    }

    statusUpdate(item) {
        console.log(item);
        const text = item.status == 1 ? 'Deactive' : 'Active';
        Swal.fire({
            title: this.util.translate('Are you sure?'),
            text: this.util.translate('To ') + this.util.translate(text) + this.util.translate(' this user!'),
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
                this.util.success('Updated');
                this.util.show();
                this.api.post_private('v1/profile/update', item).then((datas) => {
                    this.util.hide();
                    this.util.success('Updated');
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

    viewsInfo(item) {
        console.log(item);
        const param: NavigationExtras = {
            queryParams: {
                id: item
            }
        };
        this.router.navigate(['manage-users'], param);
    }

    deleteItem(item) {
        console.log(item);
        Swal.fire({
            title: this.util.translate('Are you sure?'),
            text: this.util.translate('To Delete this user!'),
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
                this.util.success('Deleted');
                this.util.show();
                this.api.post_private('v1/users/deleteUser', item).then((datas) => {
                    this.util.hide();
                    this.util.success('Deleted');
                    this.getAllUsers();
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

    addNew() {

    }



    exportCSV() {
        let data = [];
        this.users.forEach(element => {
            const info = {
                'id': this.util.replaceWithDot(element.id),
                'first_name': this.util.replaceWithDot(element.first_name),
                'last_name': this.util.replaceWithDot(element.last_name),
                'cover': this.util.replaceWithDot(element.cover),
                'country_code': this.util.replaceWithDot(element.country_code),
                'mobile': this.util.replaceWithDot(element.mobile),
                'email': this.util.replaceWithDot(element.email),
            }
            data.push(info);
        });
        const name = 'users';
        this.util.downloadFile(data, name, ['id', 'first_name', 'last_name', 'cover', 'country_code', 'mobile', 'email']);
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
            this.api.uploaCSV(files, 'v1/users/importData').subscribe((data: any) => {
                console.log('==>>>>>>', data.data);
                this.util.hide();
                this.myModal3.hide();
                this.util.success('Uploaded');
                this.getAllUsers();
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
        window.open('assets/sample/users.csv', '_blank');
    }
}
