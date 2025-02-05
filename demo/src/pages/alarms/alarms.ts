import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import {  Headers,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { LoginPage } from '../login/login';

/**
 * Generated class for the Alarms page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
//@IonicPage()
@Component({
  selector: 'page-alarms',
  templateUrl: 'alarms.html',
})
export class Alarms {

  constructor(public navCtrl: NavController,private alertCtrl: AlertController,public plt: Platform, public navParams: NavParams,public storage : Storage,public http: Http) {
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
        session=cookies["sessionId"];
        plat="browser";


    }

     if (this.plt.is('android')) {

            this.storage.get('sessionId').then((data) => {
              if(data != null)
              {
                console.log("log::"+data);

                session=data;
                plat="android";
                    this.sessionValidation(session,plat)
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

            session=data;
            plat="ios";
                this.sessionValidation(session,plat)
            console.log("session in if::"+session);
          }
        });

      }
}
     sessionValidation(session,plat){
console.log("sesion in function::"+session);
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


              console.log("user::"+data.status);
              console.log("sessionID::"+data.sessionId);
              if(data.status=="success")
              {
                console.log("status1 in android::"+data.status);
              }
              else{
                // this.showError("Access Denied");
                console.log("status2 in android::"+data.status);
                  this.showError("Session Expired");
                this.navCtrl.push(LoginPage, {  });
              }
                   //console.log(data.data.emailID);

            },
            err => {
              console.log("ERROR!: ", err);
            }
        );
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad Alarms');
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


}
