
let phaserElement = document.getElementById('phaser');

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
        phaser.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        phaser.scale.pageAlignHorizontally = true;
        phaser.scale.pageAlignVertically = true;

        phaser.background = phaser.add.sprite(180,320, 'backyard');
        phaser.background.anchor.setTo(0.5,0.5);
        phaser.background.inputEnabled = true;
        phaser.background.events.onInputDown.add(MainGame.placeItem, phaser);

        phaser.pet = phaser.add.sprite(100, 400, 'pet',0);
        phaser.pet.anchor.setTo(0.5, 0.5);
        phaser.pet.animations.add('funnyfaces', [0, 1, 2, 3, 2, 1, 0], 7, false);
        phaser.pet.inputEnabled = true;
        phaser.pet.input.enableDrag();
        phaser.pet.customParams = {health: 100, fun: 100};

        phaser.apple = phaser.add.sprite(72, 570, 'apple');
        phaser.apple.anchor.setTo(0.5);
        phaser.apple.customParams = {health: 20};
        phaser.apple.inputEnabled = true;
        phaser.apple.events.onInputDown.add(MainGame.pickItem, phaser);
        phaser.candy = phaser.add.sprite(144, 570, 'candy');
        phaser.candy.anchor.setTo(0.5);
        phaser.candy.customParams = {health: -10, fun: 10};
        phaser.candy.inputEnabled = true;
        phaser.candy.events.onInputDown.add(MainGame.pickItem, phaser);
        phaser.toy = phaser.add.sprite(216, 570, 'toy');
        phaser.toy.anchor.setTo(0.5);
        phaser.toy.customParams = {fun: 30};
        phaser.toy.inputEnabled = true;
        phaser.toy.events.onInputDown.add(MainGame.pickItem, phaser);
        phaser.rotate = phaser.add.sprite(288, 570, 'rotate');
        phaser.rotate.anchor.setTo(0.5);
        phaser.rotate.inputEnabled = true;

        phaser.rotate.events.onInputDown.add(MainGame.rotatePet, phaser);

        phaser.buttons = [phaser.apple, phaser.candy, phaser.toy, phaser.rotate];
        phaser.selectedItem = null;

        let style = { font: "20px Arial", fill: "#fff"};
        phaser.add.text(10, 20, "Health:", style);
        phaser.add.text(140, 20, "Fun:", style);
        phaser.healthText = phaser.add.text(80, 20, "", style);
        phaser.funText = phaser.add.text(185, 20, "", style);
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

let phaser = new Phaser.Game(nativeResolution.width,nativeResolution.height,Phaser.AUTO,phaserElement);
phaser.state.add('MainGame',MainGame);
phaser.state.start('MainGame');