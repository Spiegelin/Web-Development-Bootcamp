// Create two random numbers between 1-6
let randomNumber1 = Math.floor(Math.random() * 6) + 1; // 1-6
let randomNumber2 = Math.floor(Math.random() * 6) + 1; // 1-6

// Change the dice images to match the random numbers
document.querySelector(".img1").setAttribute("src", "images/dice" + randomNumber1 + ".png");
document.querySelector(".img2").setAttribute("src", "images/dice" + randomNumber2 + ".png");

// Change the title to show the winner depending which dice is higher
document.querySelector("h1").textContent = (randomNumber1 > randomNumber2) ? "🚩 Player 1 Wins!" : (randomNumber1 < randomNumber2) ? "Player 2 Wins! 🚩" : "Draw!";