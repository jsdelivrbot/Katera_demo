import { Component } from '@angular/core';
import { Rooms } from '../rooms/rooms';
import { Devices } from '../devices/devices';
import { MenuController,IonicPage, NavController, NavParams ,AlertController, LoadingController,Loading} from 'ionic-angular';
import { Platform } from 'ionic-angular';
import {  Headers,RequestOptions } from '@angular/http';
import { Http } from '@angular/http';
import 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import { AdduserPage } from '../adduser/adduser';


@Component({
  selector: 'page-userlist',
  templateUrl: 'userlist.html'
})
export class UserlistPage {
  loading: Loading;
   public sessionId:any;
      public message:any;
collectings:any = [];
savedata:any = [];
  constructor(public navCtrl: NavController,  private alertCtrl: AlertController,
  private loadingCtrl: LoadingController,public navParams: NavParams,public plt: Platform,
  public http: Http,public menuCtrl: MenuController,public storage : Storage) {
     this.menuCtrl.enable(true);
 this.sessionId = navParams.get("sessionId");

 var session;
 var plat;
  if (this.plt.is('core')) {

      console.log("I'm an desktop device!");
      var c: any;
      var C: any ;
      c = document.cookie.split( ';' );
      var cookies = {};
      for(var i = c.length - 1; i >= 0; i--){
        C = c[i].split( '=' );
        C[0] = C[0].replace( " ", "" );

        C[0].trim();

        if(C[0] == "sessionId"){
          cookies[C[0]] = C[1];
          }
      }
       console.log(cookies["sessionId"]);
        this.sessionId=cookies["sessionId"];
        plat="browser";

 //this.sessionValidation(session,plat);
 this.getUserList( this.sessionId);
    }

     if (this.plt.is('android')) {

            this.storage.get('sessionId').then((data) => {
              if(data != null)
              {
                console.log("log::"+data);

                this.sessionId=data;
                plat="android";
                    //this.sessionValidation(session,plat);
                     this.getUserList( this.sessionId);
                console.log("session in if::"+session);
              }
            });

        }

        if (this.plt.is('ios')) {

            console.log("I'm an apple device!");
            this.storage.get('sessionId').then((data) => {

          if(data != null)
          {
            console.log("log::"+data);

            this.sessionId=data;
            plat="ios";
               // this.sessionValidation(session,plat);
                this.getUserList( this.sessionId);
            console.log("session in if::"+session);
          }
        });

      }
  }
  sessionValidation( session,plat){
console.log("sesion in function::"+ session);
    var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        headers.append('Access-Control-Allow-Origin','*');
        let options = new RequestOptions({ headers: headers });
        console.log("android session::"+session);
        let postParams = {
          sessionId: session,
          platform: plat

        }
        console.log("postparams of android::"+JSON.stringify(postParams));
        this.http
        .post('http://192.168.1.222:8085/service/session', postParams, options)
        .map(res => res.json())
        .subscribe(

            data => {
              //console.log("hi::"+JSON.stringify(data));
              console.log("user::"+data.status);
              console.log("sessionID::"+data.sessionId);
              if(data.status=="success")
              {
                this.getUserList(data.email);
                console.log("status1 in android::"+data.status);
              }
              else{
                // this.showError("Access Denied");
                console.log("status2 in android::"+data.status);
                this.showError("Session Expired");
               // alert("HI");
                this.navCtrl.push(LoginPage, {  });
              }

            },
            err => {
              console.log("ERROR!: ", err);
            }
        );
}

getUserList(session){
  console.log("the getUserList");
  var headers = new Headers();
  headers.append("Accept", 'application/json');
   headers.append('Content-Type', 'application/json' );
    headers.append('Access-Control-Allow-Origin','*');

    let options = new RequestOptions({ headers: headers });
    let postParams = {
      sessionId:session
    }
    this.http
    .post('http://192.168.1.222:8085/service/listUser', postParams, options)
    .map(res => res.json())
    .subscribe(
      data => {
         if(data.sessionStatus=="success"){
           if(data.status == 'success'){
           console.log("the response is"+data.data);
           this.collectings = data.data;
          }  else{
            if(this.collectings.length<=0)
            {
this.message ="Currently no user has been added";
            }
             console.log("no user details::"+data.status);
          }
         }
         else{
            console.log("status2 in android::"+data.status);
                this.showError("Session Expired");

                this.navCtrl.push(LoginPage, {  });
         }

        },
        err => {
           console.log("ERROR!: ", err);
          }
           );
    }
  deleteUser(i){
        /*let index = this.collectings.indexOf(i);
          if(i > -1){
            this.collectings.splice(i, 1);
           } */

  console.log("user email from UI::"+this.collectings[i].email);
  console.log("the getUserList in User email");
  var headers = new Headers();
  headers.append("Accept", 'application/json');
   headers.append('Content-Type', 'application/json' );
    headers.append('Access-Control-Allow-Origin','*');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      email:this.collectings[i].email,
      sessionId:this.sessionId
    }
    this.http
    .post('http://192.168.1.222:8085/service/deleteUser', postParams, options)
    .map(res => res.json())
    .subscribe(
      data => {
         if(data.sessionStatus=="success"){
           if(data.status == 'success'){
             console.log("length::" + this.collectings.length)
              if(this.collectings.length == 1)
              {
                 this.navCtrl.setRoot(UserlistPage, {  });
              }
           console.log(" removed user"+data.status);
           //this.collectings = data.data;
            this.showErrorDelete("User Deleted");
            this.getUserList( this.sessionId);

          }  else{
             console.log("no user details::"+data.status);
          }
         }
         else{
            console.log("remove user fail::"+data.status);
                this.showError("Session Expired");

                this.navCtrl.push(LoginPage, {  });
         }

        },
        err => {
           console.log("ERROR!: ", err);
          }
           );
    }
  editUser(i){
   /* let index = this.collectings.indexOf(i);
    if(index > -1){
           this.collectings.splice(index, 1);
      } */
       this.showPrompt(i) ;

    }
    saveEdit(data){

      console.log("user email from edit UI::"+ data.Email);
      console.log("user firstname from edit UI::"+data.FirstName);
      console.log("user lastname from edit UI::"+data.LastName);
      console.log("user ssn from edit UI::"+data.UserSSN);
  var headers = new Headers();
  headers.append("Accept", 'application/json');
   headers.append('Content-Type', 'application/json' );
    headers.append('Access-Control-Allow-Origin','*');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      email:data.Email,
      firstName:data.FirstName,
      lastName:data.LastName,
      userSSN:data.UserSSN,
      sessionId:this.sessionId
    }
    this.http
    .post('http://192.168.1.222:8085/service/editUser', postParams, options)
    .map(res => res.json())
    .subscribe(
      data => {
         if(data.sessionStatus=="success"){
           if(data.status == 'success'){
              this.showLoading();

             console.log("length::" + this.collectings.length)

           console.log(" edit userrrr"+data.status);
           this.navCtrl.setRoot(UserlistPage, {  });
               //this.loading.dismiss();
           //this.collectings = data.data;
           // this.getUserList( this.sessionId);
          }  else{
             console.log("no user details::"+data.status);
          }
         }
         else{
            console.log("remove user fail::"+data.status);
                this.showError("Session Expired");

                this.navCtrl.push(LoginPage, {  });
         }

        },
        err => {
           console.log("ERROR!: ", err);
          }
           );
    }
    showPrompt(i) {
    let prompt = this.alertCtrl.create({
      title: 'Edit User Details',
      message: "Edit the fields you want to update.",
      inputs: [

        {
          name: 'FirstName',
          placeholder: 'FirstName',
          value:this.collectings[i].firstName
        },
        {
          name: 'LastName',
          placeholder: 'LastName',
          value:this.collectings[i].lastName
        },

        {
          name: 'UserSSN',
          placeholder: 'User SSN',
          value:this.collectings[i].userSSN
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
         handler: data => {
           console.log("save data::"+ JSON.stringify(data));
              console.log("save i::"+ i);
                console.log("save indexof::"+ this.collectings.indexOf(i));
                        let index = this.collectings.indexOf(i);

                        if(i > -1){
                          //this.collectings[i] = data;
                           //console.log("save index daat::"+ JSON.stringify( this.collectings[i]));
                           //this.savedata = this.collectings[i];
                           console.log("save email data::"+ this.collectings[i].email);
                           data.Email = this.collectings[i].email;
                           this.saveEdit(data);
                        }
                         console.log('save clicked');
                    }
        }
      ]
    });
    prompt.present();
  }
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
     //this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  showError(text) {
   // this.loading.dismiss();
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
    //this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }
  showErrorDelete(text) {
   // this.loading.dismiss();
    let alert = this.alertCtrl.create({
      title: 'Deleting..',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
     this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }
}
