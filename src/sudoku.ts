export default class Sudoku {
    cells: number[]
    poss: number[][]
    gen: number

    constructor(cells?: number[], gen?: number) {
        this.cells = cells || new Array(81).fill(0)
        this.poss = new Array(81).fill([])
        this.gen = gen || 0
    }

    private getRow(row: number): number[] {
        const offset = row * 9
        return this.cells.slice(offset, offset + 9)
    }

    private getCol(col: number): number[] {
        return new Array(9).fill(col).map((n, i) => n + i * 9).map(n => this.cells[n])
    }

    private getBox(row: number, col: number): number[] {
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        //slice three times to get the needed cells
        return [
            ...this.cells.slice(boxRow * 9 + boxCol, boxRow * 9 + boxCol + 3),
            ...this.cells.slice(boxRow * 9 + boxCol + 9, boxRow * 9 + boxCol + 12),
            ...this.cells.slice(boxRow * 9 + boxCol + 18, boxRow * 9 + boxCol + 21),
        ]
    }

    private getPossibilities(row: number, col: number): number[] {
        const usedPoss = [...new Set([...this.getRow(row), ...this.getCol(col), ...this.getBox(row, col)])]


        // get the difference bewteen usedPoss and [1,2,3,4,5,6,7,8,9]
        return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => !usedPoss.includes(n))
    }

    private makePass(): number {
        let changes = 0;

        //for every cell that is empty, get possibilities
        for (let i = 0; i < 81; i++) {
            if (this.cells[i] === 0) {
                this.poss[i] = this.getPossibilities(Math.floor(i / 9), i % 9)

                //if there is only one possibility, set it
                if (this.poss[i].length === 1) {
                    this.cells[i] = this.poss[i][0]

                    changes++;
                }
            }
        }

        return changes
    }

    //return true if the sudoku is solved
    solve(): boolean {
        //keep making passes until there are no more changes
        let changes = 0;
        do {
            changes = this.makePass()
        } while (changes > 0)

        //check if there are empty cells
        return this.cells.every(n => n !== 0)
    }

    //forks the sudoku into a copy. Used when solve() is ineffective
    fork(): Sudoku[] {
        //recalculate this.poss
        this.poss = new Array(81).fill([])
        this.makePass();

        //find the cell with the least possibilities
        let minPoss = 9;
        let minIndex = -1;
        for (let i = 0; i < 81; i++) {
            if (this.poss[i].length < minPoss && this.poss[i].length > 0) {
                minPoss = this.poss[i].length
                minIndex = i
                // 2 is minimum possibilities
                if (minPoss == 2) {
                    break;
                }
            }
        }

        const targetPoss = this.poss[minIndex]

        //for every possibility, clone the sudoku and set the possibility
        const clones = [];
        for (let p of targetPoss) {
            const clone = new Sudoku(this.cells, this.gen + 1)
            clone.cells[minIndex] = p
            clones.push(clone)
        }

        return clones
    }

    isValid(): boolean {
        //make a single pass
        this.makePass();

        //check if there are empty cells without possibilities
        for (let i = 0; i < 81; i++) {
            if (this.cells[i] === 0 && this.poss[i].length === 0) {
                return false;
            }
        }

        return true
    }

    //used for debugging
    toString(): string {
        //create a 9x9 grid from the cells
        return new Array(9).fill('').map((n, i) => new Array(9).fill('').map((n, j) => this.cells[i * 9 + j]).join(' ')).join('\n')
    }
}