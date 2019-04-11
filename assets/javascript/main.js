var game = {
    monsterList : ["green_dragon", "fire_demon", "medusa", "minotaur", "rat", "wolf", "worm"],
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
    heroObject : {
        idle : "assets/images/1. Characters/Knight/GIF/knight_jump.gif",
        attack : "assets",
        hit : "assets/images/1. Characters/Knight/GIF/knight_hit.gif",
    },

    // AJAX variables for the game
    gameLength : 10,

    // Other variables for the game
    questionListeners : [],

    // Cap the amount of damage that a character can have to a certain amount, say 20.
    roundDamage : 0,
    maxDamage : 20,
    heroHeal : 10,

    // isvariables for different modes of the game
    isGuessing : false,
    autoRound : "",
    autoDamage : "",

    // functions

    // Initialize the default values for the variables
    variableInitialize : function() {
        // Active variables for the game that will need to be changed.
        game.currentQuestion = 0;
        game.currentAnswer = "";
        game.score = 0;
        game.incorrect = 0;
        game.questionArray = [];

        // Character variables
        game.heroHP = 100;

        // created dynamically, but is essentially derived from the monsterList using monsterSelection() to create a single object for each monster.
        game.monsterObjects = [];
    },

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
            url: "https://opentdb.com/api.php?amount=" + game.gameLength,
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

    roundSetup : function() {
        var questionDiv = document.createElement("div");
        questionDiv.id = "question";
        document.getElementById("gamediv").append(questionDiv);

        var answerDiv = document.createElement("div");
        answerDiv.id = "answers";
        document.getElementById("gamediv").append(answerDiv);

        var scoreDiv = document.createElement("div");
        scoreDiv.id = "score";
        scoreDiv.innerHTML = "Score : <div id='scorevalue'>0</div>";
        document.getElementById("gamediv").append(scoreDiv);

        var heroDiv = document.createElement("div");
        heroDiv.id = "hero";
        
        // Insert image
        heroImage = new Image();
        heroImage.src = game.heroObject.idle;
        heroImage.id = "heroImage";
        heroDiv.append(heroImage);

        // Insert HP
        var heroHPDiv = document.createElement("div");
        heroHPDiv.id = "herohptext"
        heroHPDiv.innerText = game.heroHP;
        heroDiv.append(heroHPDiv);

        document.getElementById("gamediv").append(heroDiv);
    },

    questionPick : function() {
        console.log("the quesitonPick is starting!")
        game.isGuessing = true;
        // Reset roundDamage to 0.
        game.roundDamage = 0;

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
            // insert in the image of the monster
            var monster = new Image();
            monster.src = game.monsterObjects[0].idle;
            monster.classList = "monsterimage";
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

    // Triggers the damage timer variable game.autoDamage().

    // After creating damageTimer, need to check several things:
    // Start damageTimer on questionPick
    // Stop damageTimer on questionClick

    damageTimer : function() {

    },

    // Click on the question and evaluate whether the answer was correct or not.
    questionClick : function() {
        game.questionListeners = document.getElementsByClassName("answer");
        for(i = 0; i < game.questionListeners.length; i++) {
            game.questionListeners[i].onclick = function() {
                if(game.isGuessing === true) {    
                    // Correct answer was picked by comparing innerHTML to the currentanswer;
                    // childnodes[1] is currently the answer text of the first child div
                    var resultText = "";
                    game.isGuessing = false;
                    if(this.childNodes[1].innerHTML === game.currentAnswer) {
                        // Should increase the score by one
                        game.score ++;
                        // Display an updated score
                        document.getElementById("scorevalue").innerHTML = game.score;
                        // Heal the hero a little bit for getting the question right.
                        game.heroHP += game.heroHeal
                        document.getElementById("herohptext").innerText = game.heroHP;
                        // Should also make the hero cheer... probably
                        // Should insert resultText to Congratulations!
                        resultText = "Correct!"

                        // All the images should change to death images and then disappear...?
                        var monsterdeaths = document.getElementsByClassName("monsterimage");
                        for(i = 0; i < monsterdeaths.length; i++) {
                            monsterdeaths[i].src = game.monsterObjects[0].death;
                            // console.log(monsterdeaths[i])
                            // setInterval(function() {
                            //     monsterdeaths[i].parentNode.removeChild();
                            // }, 1000)
                        }
                    }
                    // Incorrect answer was picked
                    else{
                        // Should show the correct answer.
                        resultText = "Correct Answer : " + game.currentAnswer;
                        // Should make the hero trigger damage capped at 20.
                        game.incorrect ++;
                        game.heroHP -= game.maxDamage - game.roundDamage;

                        document.getElementById("herohptext").innerText = game.heroHP;
                        // monsters attack!
                        var monsterattacks = document.getElementsByClassName("monsterimage");
                        for(i = 0; i < monsterattacks.length; i++) {
                            monsterattacks[i].src = game.monsterObjects[0].attack;
                        }
                        document.getElementById("heroImage").src = game.heroObject.hit;
                    }
                    // Check if the user is dead or not
                    // If not dead, get the next round ready!
                    if(game.heroHP > 0) {
                        // Create a new div as a popup
                        var roundEnd = document.createElement("div");
                        roundEnd.id = "roundEndDiv";
                        // Insert the text into the popup into the center of the div
                        roundEnd.innerHTML = resultText;
                        // Insert a next round button
                        roundEndButton = document.createElement("div");
                        roundEndButton.innerText = "Next Question"
                        roundEndButton.id = "roundEndButton"
                        roundEndButton.classList = "button"
                        roundEnd.append(roundEndButton);
                        // Append the div to the screen
                        document.getElementById("gamediv").append(roundEnd);

                        // Add a listener for the new roundEndButton
                        document.getElementById("roundEndDiv").onclick = function() {
                            game.roundEnd();
                        }
                        // but if you don't click fast enough, trigger the next round in 3 seconds.
                        game.autoRound = setTimeout(function() {
                            game.roundEnd();
                        }, 3000);
                    }
                    // Death so reset.
                    else{
                        // Create a new div as a popup
                        var roundEnd = document.createElement("div");
                        roundEnd.id = "roundEndDiv";
                        roundEnd.innerHTML = "You ran out of HP.<br>Game Over.";
                        roundEndButton = document.createElement("div");
                        roundEndButton.innerText = "Quit"
                        roundEndButton.id = "roundEndButton"
                        roundEndButton.classList = "button"
                        document.getElementById("gamediv").append(roundEnd);
                        // Add a listener for the new roundEndButton
                        document.getElementById("roundEndDiv").onclick = function() {
                            game.gameOver();
                        
                        }
                    }
                }
            }
        }
    },

    // starting function
    start : function() {
        game.variableInitialize();
        // Creates the objects in the monster array with all of the elements, including each of the gifs.
        game.monsterSelection();
        // Shuffles the monsterobjects
        game.shuffle(game.monsterObjects);




        // Added trivia pull at the beginning for testing. Should make a promise on the triviapull to do the roundstart.
        game.triviaPull();
        // Added here for now, but there should be a start window that then starts the game
        setTimeout(function() {
            game.roundStart();
        }, 1500);
    },

    // Separated out because there needs to be an intro/opening page which will need to be drawn prior to a round starting
    roundStart : function() {
        // Establish the divs for the round setup
        game.roundSetup();

        // Pick the question
        game.questionPick();

        // Create the timers for damage!
        game.damageTimer();

        // Create the listeners for the click events
        game.questionClick();
    },

    // When the round ends, things are cleared and then roundstart is done.
    roundEnd : function() {
        clearTimeout(game.autoRound);
        console.log(game.roundEnd);
        document.getElementById("gamediv").innerHTML = "";
        game.shuffle(game.monsterObjects);
        game.roundStart();
    },

    gameOver : function() {
        document.getElementById("gamediv").innerHTML = "";
        questionArray = [];
        game.start();
    }

}

game.start();


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