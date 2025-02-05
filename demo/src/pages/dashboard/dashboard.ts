import { Component } from '@angular/core';
import { Rooms } from '../rooms/rooms';
import { Devices } from '../devices/devices';
import { MenuController,IonicPage, NavController, NavParams ,AlertController, LoadingController} from 'ionic-angular';
import { Platform } from 'ionic-angular';
import {  Headers,RequestOptions } from '@angular/http';
import { Http } from '@angular/http';
import 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import { FavouritesPage } from '../favourites/favourites';


@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {
   public sessionId:any;
   public armedvalue:any;
   public session:any;
   public updatedarmedvalue:any;
   sensorslists:any = [];
   roomslists:any = [];

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, private alertCtrl: AlertController, private loadingCtrl: LoadingController,public navParams: NavParams,public plt: Platform,public http: Http,public storage : Storage) {
 this.sessionId = navParams.get("sessionId");
this.menuCtrl.enable(true);

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
        this.session=cookies["sessionId"];
        plat="browser";

 //this.sessionValidation(session,plat);
 this.getDashboard(this.session);
    }

     if (this.plt.is('android')) {

            this.storage.get('sessionId').then((data) => {
              if(data != null)
              {
                console.log("log::"+data);

                this.session=data;
                plat="android";
                    //this.sessionValidation(session,plat);
                    this.getDashboard(this.session);
                console.log("session in if::"+this.session);
              }
            });

        }

        if (this.plt.is('ios')) {

            console.log("I'm an apple device!");
            this.storage.get('sessionId').then((data) => {

          if(data != null)
          {
            console.log("log::"+data);

            this.session=data;
            plat="ios";
               // this.sessionValidation(session,plat);
                this.getDashboard(this.session);
            console.log("session in if::"+this.session);
          }
        });

      }
  }

  getDashboard(sessions){
  console.log("the getDashboard");
  var headers = new Headers();
  headers.append("Accept", 'application/json');
   headers.append('Content-Type', 'application/json' );
    headers.append('Access-Control-Allow-Origin','*');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      sessionId:sessions
    }
    this.http
    .post('http://192.168.1.222:8085/service/fetchDashboard', postParams, options)
    .map(res => res.json())
    .subscribe(
      data => {
         if(data.sessionStatus=="success"){
           if(data.status == 'success'){
              console.log(JSON.stringify(data));
              this.sensorslists = data.sensors;
              this.roomslists = data.rooms;
              this.armedvalue = data.armedStatus;
              console.log("output");
              console.log(this.sensorslists);
          }  else{
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

  locationsFunc(){

  console.log("locations");
  this.navCtrl.push(Rooms);
  }

  devicesFunc(){
  console.log("devices");
  this.navCtrl.push(Devices);
  }

  sensorFunc(){
  console.log("sensor");
  }

  temperatureFunc(){
  console.log("temperature");
  }

  favouritesFunc(){
  console.log("favorites");
  this.navCtrl.push(FavouritesPage);
  }

  statusFunc(){
  console.log("status");
  }

  room_details(room){
  this.navCtrl.setRoot(Rooms,{roomName:room.roomName,roomID:room.roomID});
  }

  changeStatus(updatedarmedvalue){

  var actions;
  if(updatedarmedvalue == true){
      actions="ON";
  }
  else{
      actions="OFF";
  }


  console.log("changeStatus function");
  var headers = new Headers();
  headers.append("Accept", 'application/json');
   headers.append('Content-Type', 'application/json' );
    headers.append('Access-Control-Allow-Origin','*');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      sessionId:this.session,
      action:actions
    }
    console.log("parameters");
    console.log(JSON.stringify(postParams));

            this.http
            .post('http://192.168.1.222:8085/service/toggleArmedStatus', postParams, options)
            .map(res => res.json())
            .subscribe(
                data => {
                  console.log("sdata in function::"+JSON.stringify(data));
                  console.log(data.sessionStatus);
                  if(data.sessionStatus=="success"){
                  if(data.status == 'success'){

                    console.log("armed toggle function");


                  }else{
                    let alert = this.alertCtrl.create({
                      title: 'Registration Failed',
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

}
