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
    questionArray : [],

    // Active variables for the game
    currentQuestion : 0,
    currentAnswer : "",

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
    triviaPull : function(category) {
        $.ajax({
            url: "https://opentdb.com/api.php?amount=10",
            method: "GET"
            }).then(function(response) {
              game.questionArray = response.results
              console.log(game.questionArray)
              console.log("questions pulled!")
            })
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

    questionPick : function() {
        console.log("the quesitonPick is starting!")
        // Remove the question from the questionArray
        var question = game.questionArray[0];
        game.questionArray.shift();
        // Create the question div
        var questiondiv = document.createElement("div");
        // Push the question div into the question section of the array
        questiondiv.innerHTML = question.question;
        document.getElementById("question").append(questiondiv);

        // Create an array that will eventually have four divs
        var answerArray = [];
        // Create divs for all the answers 
        for(i = 0; i < question.incorrect_answers.length + 1; i++) {
            var parentanswerdiv = document.createElement("div");
            parentanswerdiv.setAttribute("value", i);
            parentanswerdiv.classList.add("answer")
            console.log(parentanswerdiv.getAttribute("value"))
            // insert in the image of the monster
            var monster = new Image();
            monster.src = game.monsterObjects[0].idle;
            parentanswerdiv.append(monster);
            // Create the answerdiv 
            var answerdiv = document.createElement("div");
            answerdiv.classList.add("answertext")
                // insert the wrong answer
                if(i < question.incorrect_answers.length) {
                answerdiv.innerHTML = question.incorrect_answers[i];
                }
                // adds the correct answer to the div as well
                else {
                answerdiv.innerHTML = question.correct_answer;
                }

            // append the answerdiv to the parentanswerdiv
            parentanswerdiv.append(answerdiv);
            
            // append the entire div into the answer array
            answerArray.push(parentanswerdiv);
        }
        // shuffle the divs
        game.shuffle(answerArray);
        // push the divs inside of the question section of the array.
        for(i = 0; i < answerArray.length; i++) {
            document.getElementById("answers").append(answerArray[i])
        };
        // Update the currentAnswer
        game.currentAnswer = question.correct_answer;
    },




    start : function() {
    // Creates the objects in the monster array with all of the elements, including each of the gifs.
    game.monsterSelection();
    // Shuffles the monsterobjects
    game.shuffle(game.monsterObjects);
    // Added trivia pull at the beginning for testing. Should make a promise on the triviapull to do the roundstart.
    game.triviaPull();

    // Added here for now, but there should be a start window that then starts the game
    setTimeout(function() {
        game.roundStart();
    }, 2500);
    },
    // Separated out because there needs to be an intro/opening page which will need to be drawn prior to a round starting
    roundStart : function() {
        game.questionPick();
    }

}

game.start();


setInterval(function() {
var test = document.getElementsByClassName("answer");
for(i = 0; i < test.length; i++) {
    test[i].onclick = function() {
        console.log("this worked!");
        if(this.childNodes[1].innerHTML === game.currentAnswer) {
            console.log("correct answer picked")   
        }
        else{
            console.log("wrong answer kiddo");
        }
    }
}
}, 6000);

// Example object for trivia:
// category: "Science: Computers"
// correct_answer: "Shellshock"
// difficulty: "hard"
// incorrect_answers: Array(3)
// 0: "Heartbleed"
// 1: "Bashbug"
// 2: "Stagefright"
// length: 3
// __proto__: Array(0)
// question: "What was the name of the security vulnerability found in Bash in 2014?"
// type: "multiple"