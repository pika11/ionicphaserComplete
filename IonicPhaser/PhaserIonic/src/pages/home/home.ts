import {Component} from '@angular/core';

import { NavController } from 'ionic-angular';
import {FullScreenPage} from "../full-screen/full-screen";
import {ShowAllPage} from "../show-all/show-all";

declare var Phaser;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  ionViewDidLoad(){
  }

  goTo(target:string){
    if (target == 'fullscreen')
      this.navCtrl.push(FullScreenPage);
    if (target == 'showall')
      this.navCtrl.push(ShowAllPage);
  }

}
