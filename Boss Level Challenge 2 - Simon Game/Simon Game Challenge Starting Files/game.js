let gamePattern = [];
let userClickedPattern = [];
let level = 0;
let started = false;
const buttonColours = ["red", "blue", "green", "yellow"];

// Start the game
$(document).keypress(function() {
    if (!started) {
        $("#level-title").text("Level " + level);
        nextSequence();
        started = true;
    }
});

function nextSequence() {
    // Reset the userClickedPattern
    userClickedPattern = [];

    // Increase the level
    level++;

    // Update the h1 with the level
    $("#level-title").text("Level " + level);

    // Generate a random number from 0 to 3
    let randomNumber = Math.floor(Math.random() * 4);
    let randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);

    // Search with the same id as the randomChosenColour and flash the item
    $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);

    // Play the sound
    playSound(randomChosenColour);
    
}

$(".btn").click(function() {
    // Get the id of the button that got clicked and add it to the userClickedPattern
    let userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);

    // Play the sound
    playSound(userChosenColour);

    // Animate the button
    animatePress(userChosenColour);

    // Check the answer
    checkAnswer(userClickedPattern.length - 1);
});

// Play the corresponding sound to a color
function playSound(name) {
    let audio = new Audio("./sounds/" + name + ".mp3");
    audio.play();
}

// Animate the button when pressed
function animatePress(currentColour) {
    $("#" + currentColour).addClass("pressed");

    // After 100ms remove the pressed class
    setTimeout(function() {
        $("#" + currentColour).removeClass("pressed");
    }, 100);
}


// Check the answer
function checkAnswer(currentLevel) {
    if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
        console.log("success");

        if (userClickedPattern.length === gamePattern.length){
            setTimeout(function () {
              nextSequence();
            }, 1000);
        }

    } else {
        console.log("wrong");
        playSound("wrong");
        $("body").addClass("game-over");
        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 200);

        $("#level-title").text("Game Over, Press Any Key to Restart");

        // Restart the game
        startOver();
    }
}

// Restart the game
function startOver(){
    level = 0;
    gamePattern = [];
    started = false;
}