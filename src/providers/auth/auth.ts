
import { Injectable } from '@angular/core';
import { ToastController, AlertController, LoadingController } from 'ionic-angular';
//import { Http , RequestOptions, Headers } from "@angular/http";
import { HttpClient, HttpResponse } from '../../../node_modules/@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

   host:string = '18.191.159.14:8080';
   loading        = null;
   numtime:number = 50000;
   usr: any       = null; 

  constructor(public http: HttpClient,private toastController: ToastController,private loadingCtrl: LoadingController) {
 
  }

  public autenticar(email,pass) {
    let body = {
      username: email,
      password: pass
    };
    return new Promise((resolve, reject) => {
      this.http.post("http://" + this.host + "/login", body, {
        responseType:'text',
        observe: "response"
      })
      .subscribe(res => {
        resolve(res.headers.get('Authorization'));
      }, (err) => {
        reject(err);
      });
    });  
  }



  public profile(email) {
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": this.getToken()
    });
    return new Promise((resolve, reject) => {
      this.http.get("http://" + this.host + "/users/"+email, {
        headers:headers,
      })
      .subscribe((res:any) => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });  
  }


  public subalternos(jefe) { 
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": this.getToken()
    });
    return new Promise((resolve, reject) => {
      this.http.get("http://" + this.host + "/subalternos/"+jefe, {
        headers:headers,
      })
      .subscribe((res:any) => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });  
  }

  public getUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  public isToken() {
    let u = localStorage.getItem("user");
    this.usr = JSON.parse(u);
    //console.log(this.usr.hasOwnProperty("token"));
    if (this.usr == null) {
      return false;
    }
    if (!this.usr.hasOwnProperty("token")) {
      return false;
    }
    return true;
  }

  public getToken() {
    let u     = localStorage.getItem("user");
    this.usr  = JSON.parse(u);
    return  this.usr['token']
  }

  public getUsername() {
    let u = localStorage.getItem("username");
    return  u;
  }



}
