import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';

/**
 * Generated class for the PerfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {

  public loading:any;

  perfil:any = null;
  subalternos:any = null;
  vtaSubalt:number = 0;
  _username:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public auth: AuthProvider, public toastController: ToastController,
    public alert:AlertController, public loadingCtrl: LoadingController) {
    let username = this.auth.getUsername();
    this._username  = this.navParams.get('_username');
    if(this._username != ""){
      username = this._username;
    }
    this.mainPefil(username);
  }

  mainPefil(username){
    this.auth.profile(username)
    .then((res:any) =>{
        console.log(res);  
        
            if (res.hasOwnProperty("numeroempleado")) {
              this.perfil = res;
              this.getSubalternos(this.perfil['numeroempleado']);
            }   
            else{
              this.presentAlert("Se presento un inconveniente al procesar  solicitud.");
            }        
                 
      })
      .catch((error) =>
      {
        console.log(error);
        //this.loading.dismiss();
        this.presentAlert("Se presento un inconveniente al procesar  solicitud.");
      });
  }


  private getSubalternos(jefe){
    this.auth.subalternos(jefe)
    .then((res:any) =>{
        console.log(res);          
        this.subalternos = res; 
        this.subalternos.map(
          s =>{
            this.vtaSubalt += s['ventas2019']
          }
        );
        
      })
      .catch((error) =>
      {
        console.log(error);
        //this.loading.dismiss();
        this.presentToast("No tiene personal a cargo.");
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilPage');
  }

  
  async presentToast(mensaje) {
    let toast = await this.toastController.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }

  async presentAlert(mensaje) {
    const alert = await this.alert.create({
      title: 'Remuner',
      subTitle: 'Mensaje de solicitud',
      message: mensaje,
      buttons: [
        {
          text:'OK',
          handler: () => {
            if(this._username == ""){            
              localStorage.setItem("user","{}");
              localStorage.setItem("username","");
              this.navCtrl.setRoot(HomePage);
            }
          }
        }
    ]
    });

    await alert.present();
  }

  async presentLoading(mensaje:string) {
    this.loading = await this.loadingCtrl.create({
      content: mensaje,
    });
    await this.loading.present();
  }


  openPerfil(email){
    this.navCtrl.push(PerfilPage,{_username:email});
  }

}
