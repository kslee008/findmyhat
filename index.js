import promptSync from "prompt-sync";
const prompt = promptSync({ sigint: true });

// * Game elements/assets constants
const HAT = "^";
const HOLE = "0";
const GRASS = "░";
const PLAYER = "*";

// * UP / DOWN / LEFT / RIGHT / QUIT keyboard constants
const UP = "W";
const DOWN = "S";
const LEFT = "A";
const RIGHT = "D";
const QUIT = "Q";

// * MSG_UP / MSG_DOWN / MSG_LEFT / MSG_RIGHT / MSG_ QUIT / MSG_INVALID message constants
const FEEDBACK_UP = "You move up.";
const FEEDBACK_DOWN = "You move down.";
const FEEDBACK_LEFT = "You move left.";
const FEEDBACK_RIGHT = "You move right.";
const FEEDBACK_QUIT = "You have quit the game.";
const FEEDBACK_INVALID = "Invalid entry";

// * WIN / LOSE / OUT / QUIT messages constants
const FEEDBACK_WIN_MSG = "Congratulations, you won!";
const FEEDBACK_LOST_MSG = "You fell into a hole. Game over.";
const FEEDBACK_OUT_MSG = "You stepped out of the platform. Game over";
const FEEBBACK_QUIT_MSG = "You quit the game. Thank you for playing.";

// * MAP ROWS, COLUMNS AND PERCENTAGE
const ROWS = 10;
const COLS = 10;
const PERCENT = .2;   // Percentage on the number of holes in the game map


class Field {

  // * constructor, a built-in method of a class (invoked when an object of a class is instantiated)
  constructor(field = [[]]) {
    this.field = field;
    this.gamePlay = false;
    this.playerX = 0;
    this.playerY = 0;
  }

  // * generateField is a static method, returning a 2D array of the fields
  static generateField(rows, cols, percentage) {

    const map = [[]];

    for (let i = 0; i < rows; i++) {
      map[i] = [];                      // Generate the row for the map

      for (let j = 0; j < cols; j++) {
        map[i][j] = Math.random() > PERCENT ? GRASS : HOLE;              // ~80% GRESS, ~ 20% HOLE

      }
    }
    return map;    // return the generated 2D array
  }

  // * welcomeMessage is a static method, displays a string
  static welcomeMsg(msg) {
    console.log(msg);
  }

  // * setHat positions the hat along a random x and y position within field array
  setHat() {
    const x = Math.floor(Math.random() * (ROWS - 1)) + 1;    // establish a random position of X in the field
    const y = Math.floor(Math.random() * (COLS - 1)) + 1;    // establish a random position of Y in the field
    this.field[x][y] = HAT;  // set the HAT along the derived random position this.field[x][y]
  }

  // * printField displays the updated status of the field position
  printField() {

    // An array has a built-in method to iterate through each element
    // this.field.forEach(row => console.log(row.join('')));
    this.field.forEach((row) => {
      console.log(row.join(''));
    })
  }

  // * updateMove displays the move (key) entered by the user
  updateMove(direction) {
    console.log(direction);
  }

    // !! TODO: updateGame Assessment Challenge
    updateGame(direction) {

      // Check the following conditions:
      // Store current position
      let newX = this.playerX;
      let newY = this.playerY;

      // Update coordinates based on direction
      switch (direction) {
        case FEEDBACK_UP:
          newX--;
          break;
        case FEEDBACK_DOWN:
          newX++;
          break;
        case FEEDBACK_LEFT:
          newY--;
          break;
        case FEEDBACK_RIGHT:
          newY++;
          break;
        default:
          return;  //ignore invalid input
      }

      // 1. Out of bounds, the player moved out of the map, end the game
      if (
        newX < 0 ||
        newX >= this.field.length ||
        newY < 0 ||
        newY >= this.field[0].length
      ) {
        console.log(FEEDBACK_OUT_MSG);
        this.#end();
        return;
      }

      const tile = this.field[newX][newY];

      // 2. Hole, the player fell into HOLE, end the game
      if (tile === HOLE) {
        console.log(FEEDBACK_LOST_MSG);
        this.#end();
        return;
      }

      // 3. Hat, the player moved to the HAT, win the game
      if (tile === HAT) {
        console.log(FEEDBACK_WIN_MSG);
        this.#end();
        return;
      }

      // 4. Valid move, the player moved to a GRASS spot, update the player's position and continue with the game

      // Clear current position
      this.field[this.playerX][this.playerY] = GRASS;

      // Update coordinates
      this.playerX = newX;
      this.playerY = newY;

      // Place player
      this.field[this.playerX][this.playerY] = PLAYER;
    }

    //  * start() a public method of the class to start the game
    start() {
      this.gamePlay = true;

      this.field[0][0] = PLAYER;  // set the player's start position [0][0]
      this.playerX = 0;
      this.playerY = 0;
      this.setHat();              // set the HAT position (ramdonly)

      // set the player's position to the start of the map:

      while (this.gamePlay) {        // while gamePlay is true, ask the user for an input (D), (U), (L), (R)

        this.printField();
        const input = prompt("Enter (w)up, (s)down, (a)left, (d)right. Press (q) to quit: ");
        let flagInvalid = false;     // use a flag to determine if the game entry is correct
        let feedback = "";

        switch (input.toUpperCase()) {
          case UP:
            feedback = FEEDBACK_UP;
            break;
          case DOWN:
            feedback = FEEDBACK_DOWN;
            break;
          case LEFT:
            feedback = FEEDBACK_LEFT;
            break;
          case RIGHT:
            feedback = FEEDBACK_RIGHT;
            break;
          case QUIT:
            feedback = FEEDBACK_QUIT;
            this.#end();
            break;
          default:
            feedback = FEEDBACK_INVALID;
            flagInvalid = true;
            break;
        }

        this.updateMove(feedback);

        if (!flagInvalid) {        // flagInvalid is a boolean (if flagInvalid is NOT false)
          // update the gamePlay
          this.updateGame(feedback);
        }

      }
    }

    // * end() a private method to end the game
    #end() {
      this.gamePlay = false;

    }

  }

  // * Generate a new field - using Field's static method: generateField
  const createField = Field.generateField(ROWS, COLS, PERCENT);

// * Generate a welcome message
Field.welcomeMsg("\n************WELCOME TO FIND YOUR HAT************\n");

  // * Create a new instance of the game
  // * by passing createField as a parameter to the new instance of Field
  const gameField = new Field(createField);    // Create a new instance of Field with an empty 2D array


// * Invoke method start(...) from the instance of game object
gameField.start();

//  ! method #end() cannot be accessed by the instance of Field - it is a private method
// gameField.#end(); // ❌