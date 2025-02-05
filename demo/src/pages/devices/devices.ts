import { Component } from '@angular/core';
import { MenuController,IonicPage, NavController, NavParams,AlertController, LoadingController, Loading } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import {  Headers,RequestOptions } from '@angular/http';
import { LoginPage } from '../login/login';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { StatisticsPage } from '../statistics/statistics';
import { Alarms } from '../alarms/alarms';
import { SchedulePage } from '../schedule/schedule';
/**
 * Generated class for the Devices page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
//@IonicPage()
@Component({
  selector: 'page-devices',
  templateUrl: 'devices.html',
})
export class Devices {
    loading: Loading;
   devicesArray:any = [];
    public sessionId:any;
        public roomName:any;
        public deviceId : any;
             public favstatus:any;
         myIcon : string = "heart-outline";
  constructor(public navCtrl: NavController,private alertCtrl: AlertController,
  public navParams: NavParams,public http: Http, public plt: Platform,public menuCtrl: MenuController,
  public storage : Storage, private loadingCtrl: LoadingController) {
    var session;
    this.menuCtrl.enable(true);
   // this.favstatus="false";
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

this.devicesList( this.sessionId);
    }

     if (this.plt.is('android')) {

            this.storage.get('sessionId').then((data) => {
              if(data != null)
              {
                console.log("log::"+data);

                this.sessionId=data;
                plat="android";
                   // this.sessionValidation(session,plat)
                   this.devicesList( this.sessionId);
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
            this.devicesList( this.sessionId);
                //this.sessionValidation(session,plat)
            console.log("session in if::"+session);
          }
        });

      }
  }

devicesList(session){
    console.log("hi devices");
       var headers = new Headers();
         headers.append("Accept", 'application/json');
         headers.append('Content-Type', 'application/json' );
         headers.append('Access-Control-Allow-Origin','*');
         let options = new RequestOptions({ headers: headers });
          let postParams = {
                 sessionId:session

          }
          this.http
            .post('http://192.168.1.222:8085/service/fetchDeviceList', postParams, options)
            .map(res => res.json())
            .subscribe(
                data => {
                  console.log("sdata in function::"+JSON.stringify(data));
                  console.log(data.sessionStatus);
                  if(data.sessionStatus=="success"){
                  if(data.status == 'success'){
                    this.devicesArray = data.device;
                    console.log("dataa:::"+JSON.stringify( this.devicesArray));
                    //this.showLoading();
                    //this.navCtrl.setRoot(LoginPage, {});
                  }else{
                    let alert = this.alertCtrl.create({
                      title: 'Devices fetch Failed',
                      subTitle: 'Sorry !! '+data.message,
                      buttons: ['OK']
                    });
                  alert.present();
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
statisticsFunc(){
  this.navCtrl.setRoot(StatisticsPage, {  });
}
alarmFunc(){
  this.navCtrl.setRoot(Alarms, {  });
}
scheduleFunc(){
  this.navCtrl.setRoot(SchedulePage, {  });
}


changeStatus(device){

  var actions;
  if(device.currentStatus == true){
      actions="ON";
  }
  else{
      actions="OFF";
  }


  console.log("device_changeStatus function");
  var headers = new Headers();
  headers.append("Accept", 'application/json');
   headers.append('Content-Type', 'application/json' );
    headers.append('Access-Control-Allow-Origin','*');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      sessionId:this.sessionId,
      roomID:device.roomID,
      devID:device.devID,
      action:actions

    }

    console.log("parameters");
    console.log(JSON.stringify(postParams));

            this.http
            .post('http://192.168.1.222:8085/service/toggleDevice', postParams, options)
            .map(res => res.json())
            .subscribe(
                data => {
                  console.log("sdata in function::"+JSON.stringify(data));
                  console.log(data.sessionStatus);
                  if(data.sessionStatus=="success"){
                  if(data.status == 'success'){
                    //this.showLoading();
                    console.log("toggle function for device devices");
                   // this.devicesArray[i].currentStatus=actions;
                       this.devicesList( this.sessionId);
                  }else{
                    let alert = this.alertCtrl.create({
                      title: 'Toggle Failed',
                      subTitle: 'Sorry !! '+data.message,
                      buttons: ['OK']
                    });
                  alert.present();
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

makeFavourite(device){
 // this.favstatus="true";
    console.log("Favourite devices");
       var headers = new Headers();
         headers.append("Accept", 'application/json');
         headers.append('Content-Type', 'application/json' );
         headers.append('Access-Control-Allow-Origin','*');
         let options = new RequestOptions({ headers: headers });
         let action:any;
         let postParams:any;
         if(device.favourites ==false){
           postParams = {
                 sessionId:this.sessionId,
                 roomID:device.roomID,
                 devID:device.devID,
                 action:"addFav"

          }
         } else{
           postParams = {
                 sessionId:this.sessionId,
                 roomID:device.roomID,
                 devID:device.devID,
                  action:"removeFav"

          }
          }
          this.http
            .post('http://192.168.1.222:8085/service/toggleFavouriteDevice', postParams, options)
            .map(res => res.json())
            .subscribe(
                data => {
                  console.log("sdata in function::"+JSON.stringify(data));
                  console.log(data.sessionStatus);
                  if(data.sessionStatus=="success"){
                  if(data.status == 'success'){
                    this.favstatus = data.message;
                    console.log("dataa:::fav");
                     this.devicesList( this.sessionId);
                    //this.showLoading();
                    //this.navCtrl.setRoot(LoginPage, {});
                  }else{
                    let alert = this.alertCtrl.create({
                      title: 'Favourites Not added',
                      subTitle: 'Sorry !! '+data.message,
                      buttons: ['OK']
                    });
                  alert.present();
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
showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
     this.navCtrl.setRoot(this.navCtrl.getActive().component);
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
  ionViewDidLoad() {
    console.log('ionViewDidLoad Devices');
  }

}
