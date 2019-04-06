import { Component } from '@angular/core';
import { NavController, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { PerfilPage } from '../perfil/perfil';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  usr: any        = null;
  email:any       = "";
  pass:any        = "";
  public loading:any;

  constructor(public navCtrl: NavController, public toastController: ToastController,
    public alert:AlertController, public loadingCtrl: LoadingController, public auth: AuthProvider) {
      //this.usr = this.auth.getUser();
      if(this.auth.isToken()){
        this.navCtrl.setRoot(PerfilPage, {
          _username: ""
        });
      }
  }


  public login(){   
    if(this.email == "" || this.email == undefined){
      this.presentToast("El correo es requerido.");
      return;
    }
    if(this.pass == "" || this.pass == undefined){
      this.presentToast("La clave es requerida");
      return;
    }

    //this.presentLoading("Autenticando.");
    this.auth.autenticar(this.email,this.pass)
      .then((res:any) =>{
          //this.loading.dismiss();
          //console.log(JSON.parse(res).token);        
          if (JSON.parse(res).hasOwnProperty("token")) {
              localStorage.setItem("user",res);
              localStorage.setItem("username",this.email);
              this.navCtrl.setRoot(PerfilPage, {
                _username: ""
              });
          }   
          else{
            this.presentToast("Correo o contraseña incorrectos.");
          }                 
        })
        .catch((error) =>
        {
          //console.log(error);
          //this.loading.dismiss();
          this.presentAlert("Se presento un inconveniente al procesar solicitud.");
        });
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
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentLoading(mensaje:string) {
    this.loading = await this.loadingCtrl.create({
      content: mensaje,
    });
    await this.loading.present();
  }


}
