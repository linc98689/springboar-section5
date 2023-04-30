/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

/** default values */
const WIDTH = 7;
const HEIGHT = 6;
const COLOR_P1 = 'red';
const COLOR_P2 = 'blue';

/** define class Player */
class Player{
  constructor(color,num){
    this.color = color;
    this.num = num;
  }
  setColor = (color)=>{
    this.color = color;
  }
}

/** define class Game */
class Game{
  // static fields
  static gameRoomCount = 0;

  // constructor
  constructor(width, height){
    Game.gameRoomCount++;
    this.prefix = `${Game.gameRoomCount}`;
    this.width = width;
    this.height = height;

    this.player1 = new Player(COLOR_P1 , '1');
    this.player2 = new Player(COLOR_P2 , '2');

    this.currPlayer = this.player1; // active player
    this.board = []; // array of rows, each row is array of cells  (board[y][x])
    this.gameEnabled = false;

    this.makeBoard();
    this.makeHtmlBoard();
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x){
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

/** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${this.prefix}-${y}-${x}`);
    spot.append(piece);
  }  

/** removePiecesInTable : reset game board*/
  removePiecesInTable = ()=>{
    for(let y=0; y< this.height; y++){
      for(let x=0; x<this.width;x++){
        if(this.board[y][x]){
          let spot = document.getElementById(`${this.prefix}-${y}-${x}`);
          spot.firstChild.remove();
        }
      }
    }
  }

/** setTopOfTable: enable or disable the cells in header */
  setTopOfTable = ()=>{
    if(this.gameEnabled){
      for (let x = 0; x < this.width; x++) {
        const headCell = document.getElementById(`${this.prefix}-${x}`);
        headCell.addEventListener('click', this.handleClick);
      }
    }
    else{
      for (let x = 0; x < this.width; x++) {
        const headCell = document.getElementById(`${this.prefix}-${x}`);
        headCell.removeEventListener('click', this.handleClick);
      }
    }
  }

/** endGame: announce game end */
  endGame(msg) {
    alert(msg);
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin = ()=>{
    const _win = (cells)=>{
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    }

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

  /** handleClick: handle click of column top to play piece */
 handleClick = (evt)=>{
    // get x from ID of clicked cell
    let id = evt.target.id;
    const x = +id.substring(id.indexOf("-")+1);

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      this.gameEnabled = false;
      this.setTopOfTable();
      setTimeout(() => this.endGame(`Player ${this.currPlayer.color} won!`), 200);
      return;
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      this.gameEnabled = false;
      this.setTopOfTable();
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer === this.player1 ? this.player2: this.player1;
  }

  // called when start button is clicked, resetting the board
  handleStartClick = (evt)=>{
    this.removePiecesInTable();
    this.board = [];
    this.makeBoard();
    this.gameEnabled = true;
    this.setTopOfTable();

    const playerColor_1 = document.getElementById(this.prefix + "-c1");
    this.player1.setColor(playerColor_1.value);

    const playerColor_2 = document.getElementById(this.prefix + "-c2");
    this.player2.setColor(playerColor_2.value);
  }

  //   MouseEnter
  handleMouseEnter = (evt)=>{
    let target = evt.target;
    if(this.gameEnabled){
      target.style.backgroundColor = 'gold';
    }
    else{
      target.style.backgroundColor = 'white';
    }
  }

  // MouseLeave
  handleMouseLeave = (evt)=>{
    let target = evt.target;
    target.style.backgroundColor = 'white';
  }

 /** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width}));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const body = document.querySelector("body");
    // create div for game
    const game = document.createElement('div');
    game.setAttribute("id", this.prefix + "-game");
    game.classList.add('game');
    body.append(game);

    // create div to host inputs of player color and start button
    const inputs = document.createElement('div');
    const color1 = document.createElement('input');
    color1.setAttribute('id', this.prefix + "-c1");
    inputs.append(color1);

    const color2 = document.createElement('input');
    color2.setAttribute('id', this.prefix + "-c2");
    inputs.append(color2);

    const btn_start = document.createElement("button");
    btn_start.innerText = "Start Game";
    btn_start.addEventListener("click", this.handleStartClick);
    inputs.append(btn_start);
    
    game.append(inputs)

    // create tabe for game board
    const board = document.createElement('table');
    board.setAttribute('id', this.prefix + "-board");
    board.classList.add('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', this.prefix + '-column-top');
    
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', `${this.prefix}-${x}`);
      headCell.classList.add("column-top");
      headCell.addEventListener("mouseenter", this.handleMouseEnter);
      headCell.addEventListener("mouseleave", this.handleMouseLeave);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${this.prefix}-${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
    game.append(board);
  }

  //reset main part of board
  makeHtmlBoardMain = ()=>{
   // remove pieces

  }
}

// create gameRoom-1
const game1 = new Game(WIDTH, HEIGHT);
const game2 = new Game(WIDTH, HEIGHT);


