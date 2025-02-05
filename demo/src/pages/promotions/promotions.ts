import { Component } from '@angular/core';
import { Rooms } from '../rooms/rooms';
import { Devices } from '../devices/devices';
import {Platform, IonicPage, ModalController, ViewController,NavController, NavParams ,AlertController, LoadingController} from 'ionic-angular';
import {  Headers,RequestOptions } from '@angular/http';
import { Http } from '@angular/http';
import 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import { UserlistPage } from '../userlist/userlist';
import { AdduserPage } from '../adduser/adduser';
import { UserprofilePage } from '../userprofile/userprofile';
import { DashboardPage } from '../dashboard/dashboard';

@Component({
  selector: 'page-promotions',
  templateUrl: 'promotions.html'
})
export class PromotionsPage {
   public sessionId:any;
 public userEmail:any;



  constructor(public navCtrl: NavController,  private alertCtrl: AlertController,
  private loadingCtrl: LoadingController,public navParams: NavParams,public modalCtrl: ModalController,
  public plt: Platform,public http: Http,public storage : Storage) {
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
        session=cookies["sessionId"];
        plat="browser";
      //this.sessionValidation(session,plat);
      this.userDetails(session);
    }

     if (this.plt.is('android')) {

            this.storage.get('sessionId').then((data) => {
              if(data != null)
              {
                console.log("log::"+data);

                session=data;
                plat="android";
                    //this.sessionValidation(session,plat);
                    this.userDetails(session);
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
                //this.sessionValidation(session,plat);
                this.userDetails(session);
            console.log("session in if::"+session);
          }
        });

      }
  }

  openModal(characterNum) {

    let modal = this.modalCtrl.create(ModalContentPage, characterNum);
    modal.present();
  }
  katerra1(){
    window.open(
  'https://www.linkedin.com/company-beta/3575204/',
  '_blank'
);
    //  window.location.href = ' https://www.linkedin.com/company-beta/3575204/ ';
         //this.navCtrl.setRoot(UserprofilePage);
        // '_blank'
    }

    katerra2(){
        window.open(
  'https://katerra.com/en/what-we-do/projects.html',
  '_blank'
);
     // window.location.href = 'https://katerra.com/en/what-we-do/projects.html';
         //this.navCtrl.setRoot(UserprofilePage);
    }
    katerra3(){
         window.open(
  '  https://katerra.com/',
  '_blank'
);
    }
    katerra4(){
         window.open(
  '  https://katerra.com/',
  '_blank'
);
    }
    goToHome(){
    this.navCtrl.setRoot(DashboardPage);
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
                this.userEmail = data.email;
                console.log("status1 in android::"+data.email);
                 this.userDetails(this.userEmail);
              }
              else{
                // this.showError("Access Denied");
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
 userDetails(session){
  // var details = ['FirstName','LastName','City','State','SSN','Email','Usertype','ControllerId'];
//var lastname,city,state,ssn,email,usertype,controllerId;
    var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        headers.append('Access-Control-Allow-Origin','*');
        let options = new RequestOptions({ headers: headers });
        console.log("session in API::"+session);
        let postParams = {
          sessionId: session,


        }
        console.log("postparams 1  of android::"+JSON.stringify(postParams));
        this.http
        .post('http://192.168.1.222:8085/service/getUser', postParams, options)
        .map(res => res.json())
        .subscribe(

            data => {
              //console.log("hi::"+JSON.stringify(data));
              console.log("user::"+data.status);
              console.log("sessionID::"+data.sessionId);
              if(data.sessionStatus=="success"){
              if(data.status=="success")
              {
                console.log("status243 in android::"+data.status);


              }
              else{
                // this.showError("Access Denied");
                console.log("status2 in user details::"+data.status);


                this.navCtrl.push(LoginPage, {  });
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

}
@Component({
  template: `
<ion-header>
  <ion-toolbar>
    <ion-title>
      Description
    </ion-title>
    <ion-buttons start>
      <button ion-button (click)="dismiss()">
        <span ion-text color="primary" showWhen="ios">Cancel</span>
        <ion-icon name="md-close" showWhen="android, windows"></ion-icon>
         <ion-icon name="close"></ion-icon>
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content>
  <ion-list>
      <ion-item>
        <ion-avatar item-start>
          <img src="{{character.image}}">
        </ion-avatar>
        <h2>{{character.name}}</h2>
        <p>{{character.quote}}</p>
      </ion-item>
      <ion-item *ngFor="let item of character['items']">
        {{item.title}}
        <ion-note item-end>
          {{item.note}}
        </ion-note>
      </ion-item>
  </ion-list>
</ion-content>
`
})
export class ModalContentPage {
  character;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    var characters = [
      {
        name: 'Basic HA',
        quote: 'Basic HA Features!',
        image: 'assets/images/u.png',
        items: [
          { title: 'Rooms', note: 'Hall' },
          { title: 'Devices', note: 'Bulb,Fan' },
          { title: 'Sensors', note: 'Electric devices' }
        ]
      },
      {
        name: 'Premium HA',
        quote: 'Premium HA Features!',
        image: 'assets/images/d.png',
        items: [
          { title: 'Alarms', note: 'Messages' },
          { title: 'Dashboard', note: 'Armed Status,Sensors' },
          { title: 'User Management', note: 'User Profile,User List' }
        ]
      },
      {
        name: 'HA Large',
        quote: 'HA Large Features',
        image: 'assets/images/d.png',
        items: [
          { title: 'Notifications', note: 'Alerts,Push Messages' },
          { title: 'Camera', note: 'Images' },
          { title: 'Promotions', note: 'Adds' }
        ]
      }
    ];
    this.character = characters[this.params.get('charNum')];
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
