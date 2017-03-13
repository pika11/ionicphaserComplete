import {Component, ViewChild, ElementRef} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

declare var Phaser;

/*
  Generated class for the FullScreen page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-full-screen',
  templateUrl: 'full-screen.html'
})
export class FullScreenPage {

  @ViewChild('phaser') phaserElement: ElementRef;

  loading:boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad FullScreenPage');

    //Whe set a 2 seconds timeout and show user feedback whit a spinner on the user interface
    //Even though this is called when the view loads there are some elements that are not drawn and mess up the measurements of elements
    //In this particular case the navbar and the html position of the whole page
    setTimeout(()=>{
      this.loading = false;
      this.PhaserGame();
    },2000);
  }

  PhaserGame(){
    // This line of code is here to avoid issues or having to change extra code when you copy it from the PhaserTest
    let phaserElement = this.phaserElement.nativeElement;


    //HERE you should copy the code you've written in the PhaserTest folder or you can write phaser directly in here
    //The reasons why I advice to copy it from the PhaserTest folder are in the readme file
    //You can find more instructions in the readme file
    let MainGame = {
      preload:()=>{
        phaser.load.image('backyard', 'assets/sprites/backyard.png');
        phaser.load.image('apple', 'assets/sprites/apple.png');
        phaser.load.image('candy', 'assets/sprites/candy.png');
        phaser.load.image('rotate', 'assets/sprites/rotate.png');
        phaser.load.image('toy', 'assets/sprites/rubber_duck.png');
        phaser.load.image('arrow', 'assets/sprites/arrow.png');
        phaser.load.spritesheet('pet', 'assets/sprites/pet.png', 97, 83, 5, 1, 1);
      },
      create:()=>{
        phaser.ratio = (phaser.width/nativeResolution.width);
        phaser.scale.pageAlignHorizontally = true;
        phaser.scale.pageAlignVertically = true;

        phaser.background = phaser.add.sprite(phaser.width/2,phaser.height/2, 'backyard');
        phaser.background.anchor.setTo(0.5,0.5);
        phaser.background.scale.setTo(phaser.ratio,phaser.ratio);
        phaser.background.inputEnabled = true;
        phaser.background.events.onInputDown.add(MainGame.placeItem, phaser);

        phaser.pet = phaser.add.sprite(100*phaser.ratio, 400*phaser.ratio, 'pet',0);
        phaser.pet.anchor.setTo(0.5, 0.5);
        phaser.pet.scale.setTo(phaser.ratio,phaser.ratio);
        phaser.pet.animations.add('funnyfaces', [0, 1, 2, 3, 2, 1, 0], 7, false);
        phaser.pet.inputEnabled = true;
        phaser.pet.input.enableDrag();
        phaser.pet.customParams = {health: 100, fun: 100};

        phaser.apple = phaser.add.sprite(72*phaser.ratio, 570*phaser.ratio, 'apple');
        phaser.apple.anchor.setTo(0.5);
        phaser.apple.scale.setTo(phaser.ratio,phaser.ratio);
        phaser.apple.fixedToCamera = true;
        phaser.apple.cameraOffset = new Phaser.Point(phaser.camera.width*0.15,phaser.camera.height*0.9);
        phaser.apple.customParams = {health: 20};
        phaser.apple.inputEnabled = true;
        phaser.apple.events.onInputDown.add(MainGame.pickItem, phaser);

        phaser.candy = phaser.add.sprite(144*phaser.ratio, 570*phaser.ratio, 'candy');
        phaser.candy.anchor.setTo(0.5);
        phaser.candy.scale.setTo(phaser.ratio,phaser.ratio);
        phaser.candy.fixedToCamera = true;
        phaser.candy.cameraOffset = new Phaser.Point(phaser.camera.width*0.4,phaser.camera.height*0.9);
        phaser.candy.customParams = {health: -10, fun: 10};
        phaser.candy.inputEnabled = true;
        phaser.candy.events.onInputDown.add(MainGame.pickItem, phaser);

        phaser.toy = phaser.add.sprite(216*phaser.ratio, 570*phaser.ratio, 'toy');
        phaser.toy.anchor.setTo(0.5);
        phaser.toy.scale.setTo(phaser.ratio,phaser.ratio);
        phaser.toy.fixedToCamera = true;
        phaser.toy.cameraOffset = new Phaser.Point(phaser.camera.width*0.65,phaser.camera.height*0.9);
        phaser.toy.customParams = {fun: 30};
        phaser.toy.inputEnabled = true;
        phaser.toy.events.onInputDown.add(MainGame.pickItem, phaser);

        phaser.rotate = phaser.add.sprite(288*phaser.ratio, 570*phaser.ratio, 'rotate');
        phaser.rotate.anchor.setTo(0.5);
        phaser.rotate.scale.setTo(phaser.ratio,phaser.ratio);
        phaser.rotate.fixedToCamera = true;
        phaser.rotate.cameraOffset = new Phaser.Point(phaser.camera.width*0.90,phaser.camera.height*0.9);
        phaser.rotate.inputEnabled = true;

        phaser.rotate.events.onInputDown.add(MainGame.rotatePet, phaser);

        phaser.buttons = [phaser.apple, phaser.candy, phaser.toy, phaser.rotate];
        phaser.selectedItem = null;

        let style = { font: "20px Arial", fill: "#fff"};
        let healthtxt = phaser.add.text(10*phaser.ratio, 20*phaser.ratio, "Health:", style);
        healthtxt.scale.setTo(phaser.ratio,phaser.ratio);
        healthtxt.fixedToCamera = true;
        let funtxt = phaser.add.text(140*phaser.ratio, 20*phaser.ratio, "Fun:", style);
        funtxt.scale.setTo(phaser.ratio,phaser.ratio);
        funtxt.fixedToCamera = true;
        phaser.healthText = phaser.add.text(80*phaser.ratio, 20*phaser.ratio, "", style);
        phaser.healthText.scale.setTo(phaser.ratio,phaser.ratio);
        phaser.healthText.fixedToCamera = true;
        phaser.funText = phaser.add.text(185*phaser.ratio, 20*phaser.ratio, "", style);
        phaser.funText.scale.setTo(phaser.ratio,phaser.ratio);
        funtxt.fixedToCamera = true;
        MainGame.refreshStats();

        phaser.statsDecreaser = phaser.time.events.loop(Phaser.Timer.SECOND * 5, MainGame.reduceProperties, phaser);
        phaser.statsDecreaser.timer.start();

      },
      update:()=>{

        if(phaser.pet.customParams.health <= 0 || phaser.pet.customParams.fun <= 0) {
          phaser.pet.customParams.health = 0;
          phaser.pet.customParams.fun = 0;
          phaser.pet.frame = 4;
          phaser.uiBlocked = true;
          phaser.time.events.add(2000, MainGame.gameOver, phaser);
        }

      },
      pickItem:(sprite, event)=>{
        if(!phaser.uiBlocked) {
          //clear other buttons
          MainGame.clearSelection();
          //alpha to indicate selection
          sprite.alpha = 0.4;
          //save selection so we can place an item
          phaser.selectedItem = sprite;
        }

      },
      clearSelection:()=>{
        //set alpha to 1
        phaser.buttons.forEach((element)=>{element.alpha = 1});
        //clear selection
        phaser.selectedItem = null;
      },
      placeItem:(sprite, event)=>{
        if(phaser.selectedItem && !phaser.uiBlocked) {
          //position of the user input
          let x = event.position.x;
          let y = event.position.y;
          //create element in this place
          let newItem = phaser.add.sprite(x, y, phaser.selectedItem.key);
          newItem.anchor.setTo(0.5);
          newItem.scale.setTo(phaser.ratio,phaser.ratio);
          newItem.customParams = phaser.selectedItem.customParams;

          phaser.uiBlocked = true;
          let petMovement = phaser.add.tween(phaser.pet);
          petMovement.to({x: x, y: y}, 700);
          petMovement.onComplete.add(()=>{
            phaser.uiBlocked = false;
            //destroy item
            newItem.destroy();
            //animate pet
            phaser.pet.animations.play('funnyfaces');
            //update pet stats
            let stat;
            for(stat in newItem.customParams) {
              //make sure the property belongs to the object and not the prototype
              if(newItem.customParams.hasOwnProperty(stat)) {
                phaser.pet.customParams[stat] += newItem.customParams[stat];
              }
            }
            //show updated stats
            MainGame.refreshStats();
            //clear selection
            MainGame.clearSelection();
          });
          petMovement.start();
        }
      },
      refreshStats:()=>{
        phaser.healthText.text = phaser.pet.customParams.health;
        phaser.funText.text = phaser.pet.customParams.fun;
      },
      reduceProperties:()=>{
        phaser.pet.customParams.health = Math.max(0, phaser.pet.customParams.health - 20);
        phaser.pet.customParams.fun = Math.max(0, phaser.pet.customParams.fun - 30);
        MainGame.refreshStats();
      },
      gameOver:()=>{
        phaser.state.restart();
      },
      rotatePet:(sprite, event)=>{
        if(!phaser.uiBlocked) {
          phaser.uiBlocked = true;
          //alpha to indicate selection
          MainGame.clearSelection();
          sprite.alpha = 0.4;
          let petRotation = phaser.add.tween(phaser.pet);
          petRotation.to({ angle: '+720' }, 1000);
          petRotation.onComplete.add(()=>{
            phaser.uiBlocked = false;
            sprite.alpha = 1;
            phaser.pet.customParams.fun += 10;
            //show updated stats
            MainGame.refreshStats();
          });
          petRotation.start();
        }
      }
    };

    let nativeResolution = {
      width:360,
      height:640,
    };

    let phaser = new Phaser.Game(phaserElement.offsetWidth,phaserElement.offsetHeight,Phaser.AUTO,phaserElement);
    phaser.state.add('MainGame',MainGame);
    phaser.state.start('MainGame');

  }

}
