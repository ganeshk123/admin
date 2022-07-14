/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = environment.baseUrl;
  imageUrl = environment.imageUrl;
  videoUrl = environment.imageUrl;

  constructor(
    private http: HttpClient,
  ) {
    console.log("URL = ", this.baseUrl);
  }

  uploadFile(files: File[]) {
    var formData = new FormData();
    Array.from(files).forEach(f => formData.append('image', f))
    return this.http.post(this.baseUrl + 'v1/' + 'uploadImage', formData)
  }

  uploaCSV(files: File[], url) {
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    };

    var formData = new FormData();
    Array.from(files).forEach(f => formData.append('csv_file', f))
    return this.http.post(this.baseUrl + url, formData, header)
  }

  uploadVideo(files: File[]) {
    var formData = new FormData();
    Array.from(files).forEach(f => formData.append('video', f));
    return this.http.post(this.baseUrl + 'v1/' + 'uploadVideo', formData)
  }

  public get_public(url) {
    return new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + url).subscribe(res => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  public get_private(url): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      };
      this.http.get(this.baseUrl + url, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  public post(url, body) {
    return new Promise((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      };
      const param = this.JSON_to_URLEncoded(body);
      this.http.post(this.baseUrl + url, param, header).subscribe((res) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  public post_private(url, body): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      };
      const param = this.JSON_to_URLEncoded(body);
      console.log(param);
      this.http.post(this.baseUrl + url, param, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  public post_temp(url, body, temp): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `Bearer ${temp}`)
      };
      const param = this.JSON_to_URLEncoded(body);
      console.log(param);
      this.http.post(this.baseUrl + url, param, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  JSON_to_URLEncoded(element, key?, list?) {
    let new_list = list || [];
    if (typeof element == "object") {
      for (let idx in element) {
        this.JSON_to_URLEncoded(
          element[idx],
          key ? key + "[" + idx + "]" : idx,
          new_list
        );
      }
    } else {
      new_list.push(key + "=" + encodeURIComponent(element));
    }
    return new_list.join("&");
  }

  public getLanguageJson(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http.get('assets/i18n/untitle.json').subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      })
    });
  }

  public getLocalAssets(name): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      };
      this.http.get('assets/jsons/' + name, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
}
