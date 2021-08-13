import { Duplex, EventEmitter } from "stream";
import readline from 'readline';

var keypress = require('keypress');

/** Keybinds
 * CNTL+c - exit
 * s - solve
 */

export default class Terminal extends EventEmitter {
  stream: any
  cells: number[]
  cursor: [number, number]
  constructor(stream?: Duplex) {
    super()
    this.stream = stream || process.stdin
    this.cells = new Array(81).fill(0)
    this.cursor = [0, 0];

    //init this.sream
    keypress(this.stream);
    this.stream.setRawMode(true);
    this.stream.resume();

    //listen for keyboard input
    this.stream.on('keypress', (ch, key) => {
      if (key) {
        if (key.ctrl && key.name == 'c') process.exit(0);
        if (key.name == "s") this.emit("solve",this.cells)

        this.handleArrowInputs(key.code);
        this.print();
      }else{
        this.handleKeyPress(ch);
      }
    });
  }

  print() {
    //move the cursor to the top fo the screen
    readline.cursorTo(this.stream, 0, 0);

    readline.clearScreenDown(this.stream);

    //print out the grid
    let output = new Array(27).fill("█").join("") + "\n";
    for (let i = 0; i < 9; i++) {
      output += "█" + this.cells.slice(i * 9, (i + 1) * 9).join("██").replace(/0/g, " ") + "█\n";
      output += new Array(27).fill("█").join("") + "\n";
    }

    //convert string into array
    const outputArr = output.split("");

    //compute index position of cursor
    const realCursorX = this.cursor[1] * 3 + 1;
    const realCursorY = this.cursor[0] * 2 + 1;

    const cursorPos = realCursorY * 28 + realCursorX;

    outputArr[cursorPos] = "*";
    output = outputArr.join("");

    this.stream.write(output)
  }
  //we have to separate these, as non-special arrow keys cause extra keypress events
  private handleKeyPress(key: string) {
    //if key is a string between 1-9, set the cell at this.cursor[0] * 9 + this.cursor[1] to the value of key
    if (key >= "0" && key <= "9") {
      this.cells[this.cursor[0] * 9 + this.cursor[1]] = parseInt(key);
      this.print();
    }
  }
  private handleArrowInputs(key: string) {
    switch (key) {
      case '[C':
        this.cursor[1]++
        break;
      case '[D':
        this.cursor[1]--
        break;
      case '[A':
        this.cursor[0]--
        break;
      case '[B':
        this.cursor[0]++
        break;
    }

    //constrain both this.cursor[0] and this.cursor[1] to be between 0 and 9
    this.cursor[0] = Math.min(8, Math.max(0, this.cursor[0]))
    this.cursor[1] = Math.min(8, Math.max(0, this.cursor[1]))
  }
}