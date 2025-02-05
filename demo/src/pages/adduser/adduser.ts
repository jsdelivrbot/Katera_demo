import { Component,ViewChild } from '@angular/core';
import { Rooms } from '../rooms/rooms';
import { Devices } from '../devices/devices';
import { FormBuilder,FormGroup,FormControl,Validators} from '@angular/forms';
import { IonicPage, NavController, NavParams ,AlertController, LoadingController, Loading } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import {  Headers,RequestOptions } from '@angular/http';
import { Http } from '@angular/http';
import 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import { UserlistPage } from '../userlist/userlist';
import { UserprofilePage } from '../userprofile/userprofile';


@Component({
  selector: 'page-adduser',
  templateUrl: 'adduser.html'
})
export class AdduserPage {
  loading: Loading;
   public sessionId:any;
   public controllerId:any;
    public adminEmail:any;
optionsList: Array<{ value: number, text: string, checked: boolean }> = [];
categories = [{accountType: 'Basic',},{accountType: 'Premium',}];
@ViewChild('inputFocus') myInput ;
  notify:any = false;
  //form;
  form: FormGroup;
  public session:any;

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, private alertCtrl: AlertController,
  private loadingCtrl: LoadingController,public navParams: NavParams,public plt: Platform,public http: Http,
  public storage : Storage) {
 this.sessionId = navParams.get("sessionId");
   this.controllerId = navParams.get("controllerId");
        this.form = formBuilder.group({
          firstName: ['', Validators.compose([Validators.minLength(2),Validators.maxLength(18), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
          lastName: ['', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])],
          userEmail: ['', Validators.compose([Validators.required,this.emailValidator])],
          userSSN: [''],

        });
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

// this.sessionValidation(session,plat);
    }

     if (this.plt.is('android')) {

            this.storage.get('sessionId').then((data) => {
              if(data != null)
              {
                console.log("log::"+data);

                this.session=data;
                plat="android";
                    //this.sessionValidation(session,plat);
                //console.log("session in if::"+session);
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
            //console.log("session in if::"+session);
          }
        });

      }
  }
   goBackToSighnup(){
//     this.navCtrl.push(controller-verification);
this.navCtrl.pop();
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
              //console.log("hi::"+JSON.stringify(data));
              console.log("user::"+data.status);
              console.log("sessionID::"+data.sessionId);
              if(data.status=="success")
              {
                this.adminEmail=data.email;

                console.log("status1 in android::"+data.status);
              }
              else{
                // this.showError("Access Denied");
                console.log("status2 in android::"+data.status);
                this.showError("Session Expired");
                //alert("HI");
                this.navCtrl.push(LoginPage, {  });
              }

            },
            err => {
              console.log("ERROR!: ", err);
            }
        );
}

 formErrors = {
      'username': [],
    };

    emailValidator(control) {
      var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
      if (!EMAIL_REGEXP.test(control.value)) {
        return {invalidEmail: true};
      }
    }


  signLogin(){

      console.log('the first name is...'+this.form.value['firstName']);
      if(this.form.value['firstName'] == undefined || this.form.value['lastName'] == undefined || this.form.value['userEmail'] == undefined
          ){
          let alert = this.alertCtrl.create({
            title: 'Registration Failed !!',
            subTitle: 'Please Fill all Details to Make Registration',
            buttons: ['OK']
          });
        alert.present();
      }else{
        console.log(this.form);
        console.log(this.form.value['accountType']);

        this.userRegister(this.session);
        }
    }
    userRegister(session){
      console.log("hi register");
       var headers = new Headers();
         headers.append("Accept", 'application/json');
         headers.append('Content-Type', 'application/json' );
         headers.append('Access-Control-Allow-Origin','*');
         let options = new RequestOptions({ headers: headers });
          let postParams = {
            firstName: this.form.value['firstName'],
            lastName: this.form.value['lastName'],
            email: this.form.value['userEmail'],


            userSSN:this.form.value['userSSN'],

            sessionId:session



          }
          this.http
            .post('http://192.168.1.222:8085/service/addUser', postParams, options)
            .map(res => res.json())
            .subscribe(
                data => {
                  console.log(data.status);
                  if(data.sessionStatus=="success"){
                  if(data.status == 'success'){
                    this.showLoading();
                    this.navCtrl.setRoot(UserlistPage, {});
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
     this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }
}
