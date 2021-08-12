import Sudoku from './sudoku';

export default class Supervisor {
    queue: Sudoku[];
    constructor(board: number[]) {
        this.queue = [new Sudoku(board, 0)];
    }
    solve() {
        let solution = null;
        while (this.queue.length > 0) {
            const working = this.queue.shift();

            //skip if invalid
            if (!working.isValid()) continue;

            //solve is valid
            if (working.solve()) {
                solution = working;
                break;
            } else {
                this.queue = this.queue.concat(working.fork());
            }
        }
        return solution;
    }
}