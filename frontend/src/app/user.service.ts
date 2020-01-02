import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { AuthHttp } from 'angular-jwt';
import { environment } from '../environments/environment';

declare const FB:any;

@Injectable()
export class UserService {

  constructor(private http: HttpClient) {
    FB.init({
      appId      : '476656986502257',
      status     : false, // the SDK will attempt to get info about the current user immediately after init
      cookie     : false,  // enable cookies to allow the server to access
      // the session
      xfbml      : false,  // With xfbml set to true, the SDK will parse your page's DOM to find and initialize any social plugins that have been added using XFBML
      version    : 'v2.8' // use graph api version 2.5
    });
  }

  fbLogin() {
    return new Promise((resolve, reject) => {
      FB.login(result => {
        if (result.authResponse) {
          return this.http.post(`${environment.apiUrl}auth/facebook`, {access_token: result.authResponse.accessToken})
              .toPromise()
              .then(response => {
                // var token = response.headers.get('x-auth-token');
                // if (token) {
                  // localStorage.setItem('id_token', token);
                // }
                console.log("Token", response)
                resolve(response);
              })
              .catch(() => reject());
        } else {
          reject();
        }
      }, {scope: 'public_profile,email'})
    });
  }

  logout() {
    localStorage.removeItem('id_token');
  }

  isLoggedIn() {
    return new Promise((resolve, reject) => {
      this.getCurrentUser().then(user => resolve(true)).catch(() => reject(false));
    });
  }

  getCurrentUser() {
    return new Promise((resolve, reject) => {
      return this.http.get(`${environment.apiUrl}auth/me`).toPromise().then(response => {
        resolve(response);
      }).catch(() => reject());
    });
  }
}