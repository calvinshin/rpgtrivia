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
        dead : "assets/images/1. Characters/Knight/PNG/knight_die_005.png"
    },

    // AJAX variables for the game
    gameLength : 10,
    // options available are easy, medium hard, random
    gameDifficulty : "random",

    // Other variables for the game
    questionListeners : [],
    difficultyListeners : [],

    // Cap the amount of damage that a character can have to a certain amount, say 20.
    roundDamage : 0,
    maxDamage : 25,
    heroHeal : 10,

    // isvariables for different modes of the game
    isGuessing : false,

    // timer intervals to clear/set
        // triggers the next round happening
        autoRound : "",
        // triggers the damage
        autoDamage : "",
        // triggers the countdown before damage starts (5 seconds)
        autoDamageCountdown : "",

    // functions

    // Initialize the default values for the variables
    variableInitialize : function() {
        // Active variables for the game that will need to be changed.
        game.currentQuestion = 0;
        game.currentAnswer = "";
        game.score = 0;
        // Could do score as a calculation of correct - incorrect, floored at 0.
        // game.correct = 0;
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
                // nothing happens if there is no _ character
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
            // push the entire monster into the monsterObjects array
            game.monsterObjects.push(monster);
        }
    },

    titleScreen : function() {
        // Set a background
        var backgroundImg = new Image();
        backgroundImg.src = "assets/images/other/world_map_wallpaper.png";
        backgroundImg.id = "backgroundimg";
        document.getElementById("gamediv").append(backgroundImg);

        // Set title screen
        var titletext = document.createElement("div");
        titletext.innerHTML = "RPG Trivia";
        titletext.id = "titletext";
        document.getElementById("gamediv").append(titletext);

        // Toggle options for trivia difficulty. 4 options, Easy, Medium, Hard, Random
        var difficulty = ["random", "easy", "medium", "hard"]
        // Create a div buttonContainer to insert all the buttons
        var buttonContainer = document.createElement("div");
        buttonContainer.id = "buttonContainer";
        buttonContainer.innerHTML = "Difficulty<p>";

        for(i = 0; i < difficulty.length; i++) {
            var button = document.createElement("div");
            button.innerText = game.capitalize(difficulty[i]);
            button.setAttribute("difficulty", difficulty[i]);
            button.classList = "difficultyButtons";
            // append the div into the button container
            buttonContainer.append(button);
        }
        // append buttoncontainer to the gamediv
        document.getElementById("gamediv").append(buttonContainer);
        
        // Add a listener for the buttons
        // buttons = document.getElementsByClassName("difficultyButtons")
        game.difficultyListeners = document.getElementsByClassName("difficultyButtons");
        game.difficultyListeners[0].classList.add("active");

        for(i = 0; i < difficulty.length; i++) {
            document.getElementsByClassName("difficultyButtons")[i].onclick = function() {
                for(j = 0; j < game.difficultyListeners.length; j++) {
                    game.difficultyListeners[j].classList.remove("active")
                };
                this.classList.add("active");
                game.difficulty = this.getAttribute("difficulty");
            }
        }

        // Create a start button
        var startButton = document.createElement("div");
        startButton.id = "startButton";
        startButton.innerHTML = "Start!";
        document.getElementById("gamediv").append(startButton);
        // Add a listener for the startButton
        document.getElementById("startButton").onclick = function() {
            game.titleScreenStart();
        }
    },

    triviaPull : function(category) {
        if(game.gameDifficulty === "random") {
            $.ajax({
                url: "https://opentdb.com/api.php?amount=" + game.gameLength,
                method: "GET"
                }).then(function(response) {
                game.questionArray = response.results;
                document.getElementById("gamediv").innerHTML = "";
                game.roundStart();
                })
        } else{
            $.ajax({
                url: "https://opentdb.com/api.php?amount=" + game.gameLength + "&difficulty=" + game.gameDifficulty,
                method: "GET"
                }).then(function(response) {
                game.questionArray = response.results;
                document.getElementById("gamediv").innerHTML = "";
                game.roundStart();
                })
        };
    },

    shuffle : function(array) {
        for(i=0; i<array.length; i++) {
            var newPosition = Math.floor(Math.random() * array.length);
            var held = array[newPosition];
            array[newPosition] = array[i];
            array[i] = held;
        }
    },

    capitalize : function(string) {
        return string.charAt(0).toLocaleUpperCase() + string.slice(1);
    },

    roundSetup : function() {
        var questionDiv = document.createElement("div");
            questionDiv.id = "question";
        document.getElementById("gamediv").append(questionDiv);

        var backgroundImg = new Image();
            backgroundImg.src = game.backgroundArray[Math.floor(Math.random() * game.backgroundArray.length)];
            backgroundImg.id = "backgroundimg";
        document.getElementById("gamediv").append(backgroundImg);

        var answerDiv = document.createElement("div");
            answerDiv.id = "answers";
        document.getElementById("gamediv").append(answerDiv);

        var scoreDiv = document.createElement("div");
            scoreDiv.id = "score";
            scoreDiv.innerHTML = "Score : <div id='scorevalue'>" + game.score + "</div>";
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
            heroHPDiv.id = "herohptext";
            var heroHPRemaining = document.createElement("div");
            heroHPRemaining.id = "herohpremaining";
            heroHPDiv.width = "120px";
            heroHPDiv.innerText = game.heroHP;
            heroDiv.append(heroHPDiv);
        document.getElementById("gamediv").append(heroDiv);

        var counterdiv = document.createElement("div");
            counterdiv.id = "counterdiv";
            counterdiv.innerHTML = 
                    '<svg viewBox="-400 -200 1000 1000" height="100%">\n' +
                        '<!--  " -->\n' +
                        '<defs>\n' +
                            '<filter id="goo">\n' +
                                '<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"></feGaussianBlur>\n' +
                                '<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -5" result="goo"></feColorMatrix>\n' +
                                '<feComposite in="SourceGraphic" in2="goo" operator="atop"></feComposite>\n' +
                                '<circle fill="#000000" cx="0" cy="0" r="200" />\n' +
                            '</filter>\n' +
                        '</defs>\n' +
                        '<g filter="url(#goo)">\n' +
                            '<text x="0" y="150">5</text>\n' +
                            '<text x="0" y="150">4</text>\n' +
                            '<text x="0" y="150">3</text>\n' +
                            '<text x="0" y="150">2</text>\n' +
                            '<text x="0" y="150">1</text>\n' +
                            '<text x="0" y="150">!</text>\n' +
                        '</g>\n' +
                    '</svg>\n';
        document.getElementById("gamediv").append(counterdiv);


    },

    questionPick : function() {
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
        questiondiv.id = "questiontext";
        document.getElementById("question").append(questiondiv);

        // Create an array that will eventually have four divs
        var answerArray = [];
        // Create divs for all the answers 
        for(i = 0; i < question.incorrect_answers.length + 1; i++) {
            var parentanswerdiv = document.createElement("div");
            parentanswerdiv.setAttribute("value", i);
            parentanswerdiv.classList.add("answer");
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
                };

            // append the answerdiv to the parentanswerdiv
            parentanswerdiv.append(answerdiv);
            
            // append the entire div into the answer array
            answerArray.push(parentanswerdiv);
        }
        // shuffle the divs
        game.shuffle(answerArray);
        // push the divs inside of the question section of the array.
        for(i = 0; i < answerArray.length; i++) {
            document.getElementById("answers").append(answerArray[i]);
        };
        // Update the currentAnswer
        game.currentAnswer = question.correct_answer;
    },

    // Triggers the damage timer variable game.autoDamage().

    // After creating damageTimer, need to check several things:
    // Start damageTimer on questionPick
    // Stop damageTimer on questionClick

    damageTimer : function() {
        // Set the timer for executing the function to 5 seconds.
        game.autoDamageCountdown = setTimeout(function() {
            // Set auto damage at 5 hp per second, done at 1/200ms
            game.autoDamage = setInterval(function() {
                game.heroHP -= 1;
                document.getElementById("herohptext").innerText = game.heroHP;
                if(game.heroHP <= 0) {
                    game.gameOver();
                }
            }, 200);
        }, 5000);
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
                    document.getElementById("counterdiv").classList.add("hidden");

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
                        resultText = "<p></p>Correct!"

                        // All the images should change to death images and then disappear...?
                        var monsterdeaths = document.getElementsByClassName("monsterimage");
                        for(i = 0; i < monsterdeaths.length; i++) {
                            monsterdeaths[i].src = game.monsterObjects[0].death;
                        }
                    }
                    // Incorrect answer was picked
                    else{
                        // Should show the correct answer.
                        resultText = "<p></p>Correct Answer : " + game.currentAnswer;
                        game.incorrect ++;
                        // Should make the hero trigger damage capped at 20 if roundDamage <20
                        if(game.roundDamage <= 20) {
                            game.heroHP -= game.maxDamage - game.roundDamage;
                        }
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
                        // turn off guessing
                        game.isGuessing = false;
                        // Stop all timers from running:
                        clearInterval(game.autoDamage);
                        clearInterval(game.autoDamageCountdown);

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
                        game.gameOver();
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
        game.shuffle(game.backgroundArray)

        game.titleScreen();
    },

    titleScreenStart : function() {
        // Want to add a game loading screen here...?

        // Added trivia pull at the beginning for testing. Should make a promise on the triviapull to do the roundstart.
        game.triviaPull();
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
        if(game.questionArray.length === 0) {
            game.triviaPull();
        }
    },

    gameOver : function() {
        // Stop a few functions from running
        game.isGuessing = false;
        // Stop all timers from running:
        clearInterval(game.autoDamage);
        clearInterval(game.autoDamageCountdown);
        // Death of character
        document.getElementById("heroImage").src = game.heroObject.dead;
        // Create a new div as a popup
        var roundEnd = document.createElement("div");
        roundEnd.id = "roundEndDiv";
        roundEnd.innerHTML = "Correct Answer : " + game.currentAnswer + "<br>You ran out of HP.<br>Correct : " + game.score + " Incorrect : " + game.incorrect;
        roundEndButton = document.createElement("div");
        roundEndButton.innerText = "Quit";
        roundEndButton.id = "roundEndButton";
        roundEndButton.classList = "button";
        roundEnd.append(roundEndButton);
        document.getElementById("gamediv").append(roundEnd);
        // Add a listener for the new roundEndButton
        document.getElementById("roundEndButton").onclick = function() {
            game.gameOverReset();
        }
    },

    gameOverReset : function() {
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