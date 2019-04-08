// console.log("this is a test!")

// Creating the monsterObjects via a function

var game = {
    monsterList : ["green_dragon", "fire_demon", "ghost", "medusa", "minotaur", "rat", "wolf", "worm"],
    monsterObjects : [],
    backgroundArray : ["assets/images/background/fantasy-1920-x-1080_full - Copy (2).png",
        "assets/images/background/fantasy-1920-x-1080_full - Copy (3).png",
        "assets/images/background/fantasy-1920-x-1080_full - Copy.png",
        "assets/images/background/fantasy-1920-x-1080_full.png",
        "assets/images/background/forest01-1920-x-1080_full.png",
        "assets/images/background/forest02-1920-x-1080_full.png",
        "assets/images/background/forest03-1920-x-1080_full.png",
        "assets/images/background/forest04-1920-x-1080_full.png",
        "assets/images/background/forest05-1920-x-1080_full.png",
        "assets/images/background/village01-1920-x-1080_full.png",
        "assets/images/background/village03-1920-x-1080_full.png",
        "assets/images/background/village04-1920-x-1080_full.png"],
    questionArray : [
        {question : "What is Love?",
        answers : {
            1 : "Yes or Yes",
            2 : "KNOCK KNOCK",
            3 : "Likey",
            4 : "I wanna know"
        },
        correctAnswer : 4,
        }
    ],
    gameArea : {
        canvas : document.createElement("canvas"),
        start : function() {
            this.canvas.width = 960;
            this.canvas.height = 640;
            this.context = this.canvas.getContext("2d");
            document.body.insertBefore(this.canvas, document.body.childNodes[0]);
            this.frameNo = 0;
            this.interval = setInterval(game.updateGameArea, 20);
            },
        clear : function() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        stop : function() {
            clearInterval(this.interval);
        }
    },

    // Active variables for the game
    currentQuestion : 0,
    activeBackground : "",
    activeMonster1 :  "",
    activeMonster2 :  "",
    activeMonster3 : "",
    activeMonster4 : "",

    // functions
    monsterGenerate : function() {
        // generate a monster for the number of answers 
        // ~~~~~~~~~~~~~~~~~~~~~~~ will need to figure out a better way to hold all the questions and stuff...
        for(let i=0; i < 4; i++) {
            // choose a random monster and set it to the variable monsterChosen
            var monsterChosen = this.monsterObjects[Math.floor(Math.random() * this.monsterObjects.length)];
            var monster = new Image();
            monster.src = monsterChosen.idle;
            // console.log("hey this ran " + i + "times");
            // Attach text to the image
            // https://www.w3schools.com/graphics/canvas_text.asp
    
    
            // have to do an onload.... otherwise the drawimage... doesn't work?
            // create a monster at a location, and then offset by i * some value later
            monster.onload = function() {
                game.gameArea.context.drawImage(monster, i * 250, 500);
            };
    
            // console.log(monsterChosen);
            // console.log(game.monsterObjects[Math.floor(Math.random()) * 2])
            // document.getElementById("testdiv").append(monster);
            
        }
    },
    backgroundGenerate : function() {
        // Create a new image for simplicity sake, but is not actually needed. Could just input the src into the function component
        var backgroundImage = new Image();
        backgroundImage.src = game.backgroundArray[Math.floor(Math.random() * game.backgroundArray.length)]
        game.activeBackground = new game.component(backgroundImage.src, 0, 0, game.gameArea.canvas.width, game.gameArea.canvas.height, "bg");
    },
    component : function(source, x, y, width, height, type, object) {
        this.type = type;
        this.image = new Image();
        this.image.src = source;
        this.width = width;
        this.height = height;
        // no speed yet...?
        // this.speedX = 0;
        // this.speedY = 0;
        this.x = x;
        this.y = y;
        this.object = object
        this.update = function() {
                game.gameArea.context.drawImage(this.image, this.x, this.y, this.width, this.height);
        };
        // for monster objects we need to keep more details for the answers. Pulling the entire object allows us to not have to add details but use the object within the object
            // otherwise, create new attributes from object.
        // positioning, also not yet required;
        // this.newPos = function() {
        //     this.x += this.speedX;
        //     this.y += this.speedY;        
        // }    

    },
    updateGameArea : function() {
        // game.gameArea.clear();
        // game.activeBackground.newPos();    
        game.activeBackground.update();
        // console.log(game.activeBackground)
        // game.activeMonster1.newPos();
        // game.activeMonster1.onload();
        // game.activeMonster1.update();

        testvariablee.update();
    },
}

for(i=0; i < game.monsterList.length; i++) {
    var monster = [];

    // creating the name of the monster with it capitalized
    monster.name = game.monsterList[i].charAt(0).toLocaleUpperCase() + game.monsterList[i].slice(1);
    if(monster.name.indexOf("_") === -1) {
        // nothing happens
    }
    else {
        monster.name = monster.name.slice(0, monster.name.indexOf("_")) + " " + monster.name.slice(monster.name.indexOf("_") + 1);
    }
    // Create the images for idle
    monster.idle = "assets/images/monsters/" + game.monsterList[i] + "_idle.gif"
    // Create the images for attack
    monster.attack = "assets/images/monsters/" + game.monsterList[i] + "_attack.gif"
    // Create the images for death
    monster.death = "assets/images/monsters/" + game.monsterList[i] + "_death.gif"

    // Create the question

    // push the entire monster into the monsterObjects array
    game.monsterObjects.push(monster);
}


var testvariablee = "sm";
testvariablee = new game.component("assets/images/monsters/minotaur_attack.gif", 20, 20, 60, 60, "image");
console.log(testvariablee)


// console.log(game)
// console.log(game.monsterObjects)
game.gameArea.start();
game.backgroundGenerate();

// document.addEventListener()
game.monsterGenerate();
// game.activeBackground.update();
// console.log(game.activeBackground)

console.log(testvariablee)
console.log(game.activeBackground)