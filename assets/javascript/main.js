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
    canvas : document.getElementById("canvas"),
    context : canvas.getContext("2d"),

    // Active variables for the game
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
                game.context.drawImage(monster, i * 250, 500);
            };
    
            // console.log(monsterChosen);
            // console.log(game.monsterObjects[Math.floor(Math.random()) * 2])
            // document.getElementById("testdiv").append(monster);
            
        }
    },
    backgroundGenerate : function() {
        var backgroundImage = new Image();
        backgroundImage.src = game.backgroundArray[Math.floor(Math.random() * game.backgroundArray.length)]
        game.activeBackground = new component(game.canvas.clientWidth, game.canvas.clientHeight, backgroundImage.src, 0, 0);
        // backgroundImage.onload = function() {
        //     game.context.drawImage(backgroundImage, 0, 0, backgroundImage.width, backgroundImage.height,
        //                                             0, 0, game.canvas.width, game.canvas.height);
        // }
    }
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

    // push the entire monster into the monsterObjects array
    game.monsterObjects.push(monster);
}





console.log(game)
console.log(game.monsterObjects)
game.backgroundGenerate();
// document.addEventListener()
game.monsterGenerate();