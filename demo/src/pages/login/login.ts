import { Component} from '@angular/core';
import { MenuController,NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { Headers,RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
//import { HTTP } from '@ionic-native/http';
import { Http } from '@angular/http';
//import { Http, Headers } from 'angular2/http';
import { HomePage } from '../home/home';
import { DashboardPage } from '../dashboard/dashboard';
import { ControllerVerificationPage } from '../controller-verification/controller-verification';

 import { UserprofilePage } from '../userprofile/userprofile';
import { RegisterPage } from '../register/register';
import 'rxjs/Rx';
import { Device } from '@ionic-native/device';
import { Platform } from 'ionic-angular';
import { IntermediatePage } from '../intermediatepage/intermediatepage';
import { SplitProvider } from '../../providers/split/split';

//import {SampleApiPage} from '../sample-api/sample-api';
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
//@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
//logoState: any = "in";
posts:any;
  public platform:any;
loading: Loading;
  registerCredentials = { email: '', password: '' };

  constructor(private nav: NavController,public http: Http,public menuCtrl: MenuController,private testProvider: SplitProvider,public storage:Storage,public device: Device,public plt: Platform,public navCtrl: NavController, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
this.menuCtrl.enable(false);
             if (this.plt.is('core')) {
                  // this.login("browser");
                  this.platform="browser";
                 }
                 if (this.plt.is('android')) {
                    //this.login("android");
                    this.platform="android";
                 }
                 if (this.plt.is('ios')) {
                //this.login("ios");
                this.platform="ios";
                  }
   }

   public createAccount() {
    this.navCtrl.push(ControllerVerificationPage, {  });
  }


  public login() {


     let emailId: any = this.registerCredentials.email;
    let pwd: any = this.registerCredentials.password;
    console.log(emailId+pwd);
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    headers.append('Access-Control-Allow-Origin','*');
    let options = new RequestOptions({ headers: headers });
  let postParams = {
      email: emailId,
      password: pwd,
      platform:this.platform
    }
      console.log("json login::"+JSON.stringify(postParams));
      this.http

        .post('http://192.168.1.222:8085/service/userLogin', postParams, options)

        .map(res => res.json())
        .subscribe(
           data => {

              console.log("user::"+data.status);
              console.log("sessionID::"+data.sessionId);
              if(data.status=="success")
              {

               this.registerCredentials.email='';
               this.registerCredentials.password='';
               if (this.plt.is('core')) {

                    console.log("I'm an desktop device!");

                document.cookie = "sessionId=" +data.sessionId;
                var x = document.cookie;
                console.log(x);
                var c;
                var C;
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
                 }
                 if (this.plt.is('android')) {
                    console.log("I'm an android device!");
                    this.storage.ready().then(() => {
                        this.storage.set('sessionId', data.sessionId);
                      });
                 }
                 if (this.plt.is('ios')) {
                  console.log("I'm an apple device!");
                  this.storage.ready().then(() => {
                        this.storage.set('sessionId', data.sessionId);
                      });
                  }


                this.showLoading();
                  this.navCtrl.setRoot(IntermediatePage, { });


              }
              else{
                 this.showError("Login Failed");
                console.log("status::"+data.status);
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  ionViewWillEnter() {
    // Disable the split plane in this page
    this.testProvider.setSplitPane(false);
}

}
