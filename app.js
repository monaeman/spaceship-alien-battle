//This code sets up a space invader-like game with aliens, a spaceship, bullets, and collision detection. It handles game initialization, movement, collisions, scoring, and game over conditions.

//This line adds an event listener to the "DOMContentLoaded" event, which fires when the initial HTML document has been completely loaded and parsed.
document.addEventListener("DOMContentLoaded", () => {
  //These lines declare variables using const and let keywords. It selects elements from the DOM using document.querySelector and document.getElementById. It also initializes variables with arrays and numbers.

  const grid = document.querySelector(".grid"),
    scoreId = document.getElementById("scoreId"),
    livesId = document.getElementById("livesId"),
    scoreText = document.querySelector(".score"),
    livesText = document.querySelector(".lives"),
    endMessage = document.querySelector(".endMessage"),
    start = document.querySelector(".start"),
    width = 15,
    //alienStart is an array that contains a sequence of numbers representing the initial positions of the aliens in the game. Each number corresponds to a specific square or grid position where an alien will be placed.
    alienStart = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
      25, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    ],
    alienMovement = [1, 1, 1, 1, width, -1, -1, -1, -1, width],
    squares = [];

  //These lines declare variables using the let keyword and initialize them with values.
  let scoreTally = 0,
    livesLeft = 3,
    alienArray = alienStart.slice(), // to create new array to use on reset - splice modifies existing array
    currentAlienMove = 0,
    spaceshipIndex = 217,
    gameInPlay = true,
    moveAliensTimerId,
    alienBombMovementId,
    alienBombId;

  //This line sets the text content of the start element to "Play game".
  start.innerText = "Play game";

  // Start game function. This line declares a function named gameInit.
  function gameInit() {
    //This line iterates over the squares array using the forEach method and removes multiple CSS classes from each square element.
    squares.forEach((square) =>
      square.classList.remove(
        "activeAlien",
        "explosion",
        "spaceship",
        "bullet",
        "bomb"
      )
    );

    //These lines initialize various variables and elements for the game to start. They set flags, remove/add CSS classes, set intervals, and update text content.
    gameInPlay = true;
    grid.classList.remove("hidden");
    scoreText.classList.remove("hidden");
    livesText.classList.remove("hidden");
    start.classList.add("hidden");
    currentAlienMove = 0;
    alienArray = alienStart.slice();
    createAlien();
    moveAliensTimerId = setInterval(moveAliens, 400);
    alienBombId = setInterval(alienBomb, 600);
    spaceshipIndex = 217;
    squares[spaceshipIndex].classList.add("spaceship");
    livesLeft = 3;
    scoreTally = 0;
    scoreId.innerText = 0;
    livesId.innerText = 3;
    endMessage.classList.add("hidden");
  }

  // CREATE GRID ===============================================================
  //This loop creates a grid by creating div elements, adding CSS classes to the first row and last row of squares, and appending them to the grid element. The squares array is populated with the created elements.
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    if (i < width) square.classList.add("ceiling");
    if (i > width ** 2 - width - 1) square.classList.add("floor");
    squares.push(square); //creates new array of divs
    grid.appendChild(square);
  }

  // USER SPACESHIP ============================================================
  //This function finds the square element with the class "spaceship", removes the class from the current square, and adds it to the square at the spaceshipIndex position.

  function moveSpaceship() {
    // find the square with the class of spaceship
    const spaceship = squares.find((square) =>
      square.classList.contains("spaceship")
    );
    // remove the class of spaceship from that square
    spaceship.classList.remove("spaceship");
    // add the class of player to square the player should move to
    squares[spaceshipIndex].classList.add("spaceship");
  }

  // ALIENS ====================================================================
  // This function adds the "activeAlien" CSS class to the squares representing the aliens.
  function createAlien() {
    // create alien array
    alienArray.forEach((alien) => {
      // console.log('alien array foreach', squares[alien])
      squares[alien].classList.add("activeAlien");
    });
  }

  // MOVE ALIENS ===============================================================
  function moveAliens() {
    alienArray.forEach((alien) => {
      squares[alien].classList.remove("activeAlien"); // loop through aliens & remove all aliens
    });
    alienArray = alienArray.map(
      (alien) => alien + alienMovement[currentAlienMove]
    ); //find new alien positions
    alienArray.forEach((alien) => {
      squares[alien].classList.add("activeAlien"); //add class of alien to all aliens
    });
    currentAlienMove++; // increment currentMove
    if (currentAlienMove === alienMovement.length) currentAlienMove = 0;
    if (alienArray.some((alien) => alien >= 210)) {
      gameOver('Game Over <i class="far fa-thumbs-down"></i>');
    }
    // let bottomAliens = alienArray.slice(20)
  }

  // ALIEN BOMB ================================================================
  //This function handles the behavior of the alien bombs. It selects a random alien square index, sets an interval to move the bomb, checks for collisions with the spaceship and the floor, and clears the interval when the game is not in play.
  function alienBomb() {
    let bombIndex = alienArray[Math.floor(Math.random() * alienArray.length)];

    const alienBombMovementId = setInterval(() => {
      bombIndex = drawBullet(bombIndex, width, "bomb");
      if (collision(bombIndex, "spaceship", "bomb", alienBombMovementId)) {
        loseLife();
      }
      collision(bombIndex, "floor", "bomb", alienBombMovementId);

      if (!gameInPlay) clearInterval(alienBombMovementId);
    }, 400);
  }

  // Lose life function ========================================================
  //This function handles the loss of a life. It decrements livesLeft and updates the text content of the lives element. If there are no lives left, it triggers a game over.
  function loseLife() {
    if (gameInPlay) livesLeft--;
    if (livesLeft !== 0) {
      livesId.innerText = livesLeft;
    } else {
      livesId.innerText = 0; // cheat here and use 0? sometimes lives keeps going below 0
      gameOver('Game Over <i class="far fa-thumbs-down"></i>');
    }
  }

  //This function handles the game over state. It sets the gameInPlay flag to false, clears intervals, updates CSS classes and text content, and displays the game over message.
  function gameOver(message) {
    gameInPlay = false;

    clearInterval(alienBombId);
    alienBombId = null;
    clearInterval(moveAliensTimerId);
    moveAliensTimerId = null;
    clearInterval(alienBombMovementId);
    alienBombMovementId = null;

    endMessage.classList.remove("hidden");
    endMessage.innerHTML = message;
    grid.classList.add("hidden");
    start.innerText = "Play game";
    start.classList.remove("hidden");
    scoreId.classList.remove("hidden");
    livesId.classList.remove("hidden");
    // livesLeft = 0
    livesId.innerText = livesLeft;
  }
  //This function draws a bullet on the grid. It adds and removes CSS classes from squares based on the movement of the bullet.
  function drawBullet(index, next, shot) {
    if (squares[index + next]) {
      squares[index].classList.remove(shot);
      index += next;
      squares[index].classList.add(shot);
    } else {
      squares[index].classList.remove(shot);
    }
    return index;
  }

  // COLLISION =================================================================
  //This function handles collisions between elements on the grid. If a collision occurs, it removes the shot CSS class from the square, adds the "explosion" CSS class, sets a timeout to remove the "explosion" class, clears the interval, and returns true. Otherwise, it returns false.
  function collision(index, target, shot, interval) {
    if (squares[index].classList.contains(target)) {
      squares[index].classList.remove(shot);
      squares[index].classList.add("explosion");
      setTimeout(() => {
        squares[index].classList.remove("explosion");
      }, 300);
      clearInterval(interval);
      return true;
    } else return false;
  }
  //This function handles the death of an alien. It removes the "activeAlien" CSS class from the square, finds the index of the alien in the alienArray, and removes it from the array.
  function alienDeath(index) {
    squares[index].classList.remove("activeAlien");
    const alienIndex = alienArray.indexOf(index);
    alienArray.splice(alienIndex, 1);
  }
  //This function updates the score by incrementing scoreTally and updating the text content of the score element.
  function updateScore() {
    scoreTally++;
    scoreId.innerText = scoreTally;
  }

  // FIRE BULLET ===============================================================
  //This function handles firing bullets from the spaceship. It sets an interval to move the bullet, checks for collisions with aliens and the ceiling, triggers the death of aliens and score update, and checks if all aliens are defeated to trigger a game win.
  function fire() {
    let bulletIndex = spaceshipIndex;
    const bulletIntervalId = setInterval(() => {
      bulletIndex = drawBullet(bulletIndex, -width, "bullet");
      if (collision(bulletIndex, "activeAlien", "bullet", bulletIntervalId)) {
        alienDeath(bulletIndex);
        updateScore();
        if (alienArray.length === 0) {
          gameOver(
            '<i class="far fa-hand-spock"></i> You win! <i class="far fa-hand-spock"></i>'
          );
        }
      }
      collision(bulletIndex, "ceiling", "bullet", bulletIntervalId);
    }, 100);
  }

  // USER BULLET ===============================================================
  //This event listener listens for the "keydown" event, specifically when the spacebar key (keyCode 32) is pressed. It calls the fire function to fire a bullet.
  document.addEventListener("keydown", (e) => {
    if (e.keyCode === 32) {
      // bulletAudio();
      fire();
    }
  });

  // USER SPACESHIP ============================================================
  //This event listener listens for the "keydown" event and checks for left (keyCode 37) and right (keyCode 39) arrow key presses. It updates the spaceshipIndex and calls the moveSpaceship function to move the spaceship accordingly.
  document.addEventListener("keydown", (e) => {
    switch (e.keyCode) {
      case 37:
        //left
        if (spaceshipIndex % width > 0) {
          spaceshipIndex--;
          moveSpaceship();
        }
        break;
      case 39:
        //right
        if (spaceshipIndex % width < width - 1) {
          spaceshipIndex++;
          moveSpaceship();
        }
        break;
    }
  });

  //This event listener listens for the "click" event on the start button and calls the gameInit function to start the game.
  start.addEventListener("click", gameInit);
});
