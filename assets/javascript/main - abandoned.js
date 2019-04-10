// console.log("this is a test!")

// Creating the monsterObjects via a function

var game = {
    monsterList : ["green_dragon", "fire_demon", "medusa", "minotaur", "rat", "wolf", "worm"],
    // created dynamically, but is essentially derived from the monsterList to create a single object for each monster
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
        },
        listeners : function() {
            game.gameArea.canvas.addEventListener("click", function(event) {
                var x = event.pageX - this.offsetLeft;
                var y = event.pageY - this.offsetTop;
                // game.gameArea.context.drawImage(game.backgroundArray[0], x, y, 20, 20);
                // console.log(x, y);
            });
            game.gameArea.canvas.addEventListener("mousemove", function(event) {
                var x = event.pageX - this.offsetLeft;
                var y = event.pageY - this.offsetTop;
                // console.log(x, y);
                // game.gameArea.context.drawImage(game.backgroundArray[0], x, y, 20, 20)
            });
        },
    },

    // Active variables for the game
    currentQuestion : 0,
    // activeBackground : "",
    activeQuestion : "",
    activeMonster1 : "",
    activeMonster2 : "",
    activeMonster3 : "",
    activeMonster4 : "",
    trivia1 : "",
    trivia2 : "", 
    trivia3 : "",
    trivia4 : "",
    activeObjects : [],

    // isvariables for different modes of the game
    isGuessing : false,

    // functions
    // Creating the array of objects for monsters. Has no question information, just creates the list of monsters to use in the game.
    monsterSelection: function() {
        for(i=0; i < game.monsterList.length; i++) {
            var monster = [];
        
            // creating the name of the monster with it capitalized
            monster.name = game.monsterList[i].charAt(0).toLocaleUpperCase() + game.monsterList[i].slice(1);
            if(monster.name.indexOf("_") === -1) {
                // nothing happens
            }
            else {
                // Removing a single _ in the name and replacing it with a space
                monster.name = monster.name.slice(0, monster.name.indexOf("_")) + " " + monster.name.slice(monster.name.indexOf("_") + 1);
            }
            // Create the images for idle
            monster.idle = "assets/images/monsters/" + game.monsterList[i] + "_idle.gif"
            // Create the images for attack
            monster.attack = "assets/images/monsters/" + game.monsterList[i] + "_attack.gif"
            // Create the images for death
            monster.death = "assets/images/monsters/" + game.monsterList[i] + "_death.gif"

            // Find the size of the images
            monster.onload = function() {
                monster.width = monster.idle.naturalWidth;
                monster.height = monster.idle.naturalHeight;
            }
        
            // Create the question
        
            // push the entire monster into the monsterObjects array
            game.monsterObjects.push(monster);
        }
    },

    // Generates the monsters for the page. Will probably need to add a section to attach the questions.
    monsterGenerate : function() {
        // generate a monster for the number of answers 

            chosen = this.monsterObjects[0];


                                        // probably not needed... can just do the chosen stuff

                                        // chosen1 = chosen;
                                        // chosen1.answer = game.questionArray[0].answers[1]

                                        // chosen2 = chosen;
                                        // chosen2.answer = game.questionArray[0].answers[2]

                                        // chosen3 = chosen;
                                        // chosen3.answer = game.questionArray[0].answers[3]

                                        // chosen4 = chosen;
                                        // chosen4.answer = game.questionArray[0].answers[4]

            game.trivia1 = new game.triviaText(game.questionArray[0].answers[1], 70, 550, "30px Arial", "white", "left");
            game.trivia2 = new game.triviaText(game.questionArray[0].answers[2], 320, 550, "30px Arial", "white", "left");
            game.trivia3 = new game.triviaText(game.questionArray[0].answers[3], 120, 620, "30px Arial", "white", "left");
            game.trivia4 = new game.triviaText(game.questionArray[0].answers[4], 370, 620, "30px Arial", "white", "left");

        // var image = new Image();
        // image.src = chosen.idle;
        // image.onload = function() {

        // for loop, to attach the question/answer to each chosen


            game.activeMonster1 = new game.component(chosen.idle, 0, 480, 0, 0, chosen);
            game.activeMonster2 = new game.component(chosen.idle, 250, 480, 0, 0, chosen);
            game.activeMonster3 = new game.component(chosen.idle, 50, 550, 0, 0, chosen);
            game.activeMonster4 = new game.component(chosen.idle, 300, 550, 0, 0, chosen);
            
        // }
        // What's happening is that things aren't... working in order
        // console.log(game.activeMonster1)

        // for(let i=1; i < 5; i++) {
        //     // choose a random monster and set it to the variable monsterChosen
        //     var monsterChosen = this.monsterObjects[0];
        //     // var monsterChosen = this.monsterObjects[Math.floor(Math.random() * this.monsterObjects.length)];
        //     var monster = new Image();
        //     monster.src = monsterChosen.idle;
        //     game.activeMonster1 = new game.component(monsterChosen.idle, (i-1) * 250, 500, , , monsterObjects[0])
        //     // console.log("hey this ran " + i + "times");
        //     // Attach text to the image
        //     // https://www.w3schools.com/graphics/canvas_text.asp
        //     // have to do an onload.... otherwise the drawimage... doesn't work?
        //     // create a monster at a location, and then offset by i * some value later
        //     monster.onload = function() {
        //         game.gameArea.context.drawImage(monster, (i-1) * 250, 500);
        //     };
    
            // console.log(monsterChosen);
            // console.log(game.monsterObjects[Math.floor(Math.random()) * 2])
            // document.getElementById("testdiv").append(monster);
            
        // }
    },
    backgroundGenerate : function() {
        // Create a new image for simplicity sake, but is not actually needed. Could just input the src into the function component
        var backgroundImage = new Image();
        backgroundImage.src = game.backgroundArray[Math.floor(Math.random() * game.backgroundArray.length)]
        game.activeObjects[0] = new game.component(backgroundImage.src, 0, 0, game.gameArea.canvas.width, game.gameArea.canvas.height, "bg");
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
            // Checks if the width > 0, then returns the regular image
            if(this.width > 0) {
                game.gameArea.context.drawImage(this.image, this.x, this.y, this.width, this.height);
            }
            else{
                game.gameArea.context.drawImage(this.image, this.x, this.y);
            }
        };
        // https://stackoverflow.com/questions/8429011/how-to-write-text-on-top-of-image-in-html5-canvas
        // if(object.answers !== "") {}
        // for monster objects we need to keep more details for the answers. Pulling the entire object allows us to not have to add details but use the object within the object
            // otherwise, create new attributes from object.
        // positioning, also not yet required;
        // this.newPos = function() {
        //     this.x += this.speedX;
        //     this.y += this.speedY;        
        // }    
    },
    triviaText : function(text, x, y, size, color, align) {
        this.update = function() {
            game.gameArea.context.font = size;
            game.gameArea.context.fillStyle = color;
            game.gameArea.context.textAlign = align;
            game.gameArea.context.fillText(text, x, y);
        }

    },
    updateGameArea : function() {
        // game.gameArea.clear();
        // game.activeBackground.newPos();
        for(i = 0; i<game.activeObjects.length; i++) {
            game.activeObjects[i].update();
        }
        // game.activeBackground.update();
        game.activeMonster1.update();
        game.activeMonster2.update();
        game.activeMonster3.update();
        game.activeMonster4.update();
        game.trivia1.update();
        game.trivia2.update();
        game.trivia3.update();
        game.trivia4.update();
        // Ensure this last variable is always on bottom so that the image is always drawn last
        // testvariablee.update();
    },
    shuffle : function(array) {
        // console.log(array);
        for(i=0; i<array.length; i++) {
            var newPosition = Math.floor(Math.random() * array.length);
            // console.log(newPosition);
            var held = array[newPosition];
            // console.log(held);
            array[newPosition] = array[i];
            array[i] = held;
        }
        // console.log(array);
    },
    start : function() {
        game.initialvariables();
        game.gameArea.start();
        game.roundStart();
        game.gameArea.listeners();
    },
    initialvariables : function() {
        var activeBackground;
        game.activeObjects.push(activeBackground);
    },
    // Separated out because there needs to be an intro/opening page which will need to be drawn prior to a round starting
    roundStart : function() {
        game.monsterSelection();
        game.shuffle(game.questionArray);
        game.shuffle(game.monsterObjects);
        game.monsterGenerate();
        game.backgroundGenerate();
        this.isGuessing = true;
    }
}

// Test variable to make sure that all the steps work. Will keep this on the canvas until game is created.
// var testvariablee = "sm";
// testvariablee = new game.component("assets/images/monsters/minotaur_attack.gif", 20, 20, 60, 60, "image");

new game.component("assets/images/monsters/minotaur_attack.gif", 20, 20, 60, 60, "image");



// console.log(testvariablee)


// console.log(game)
// console.log(game.monsterObjects)
// game.monsterSelection();
// game.gameArea.start();
// game.backgroundGenerate();

// document.addEventListener()
// game.monsterGenerate();
// game.activeBackground.update();
// console.log(game.activeBackground)

// document.onload = function() {
    game.start();
// };