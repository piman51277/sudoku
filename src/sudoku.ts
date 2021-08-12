class Sudoku {
	positions: number[]
	possibilities: number[][];
	id: number
	parentid: number
	constructor(positions: number[], parentid: number, id: number) {
		this.parentid = parentid;
		this.id = id;
		this.positions = positions || new Array(81).fill(0);
		this.possibilities = new Array(81).fill([]);
	}
	private resolveIndex(row: number, col: number): number {
		//resolve row,col into an index number
		return row * 9 + col;
	}
	private getCell(row: number, col: number): number {
		return this.positions[row * 9 + col];
	}
	private getRow(row: number): number[] {
		const offset = row * 9;
		return [this.positions[offset], this.positions[offset + 1], this.positions[offset + 2], this.positions[offset + 3], this.positions[offset + 4], this.positions[offset + 5], this.positions[offset + 6], this.positions[offset + 7], this.positions[offset + 8]];
	}
	private getRowPositions(row: number): number[] {
		const offset = row * 9;
		return new Array(9).fill(offset).map((n, i) => n + i)
	}
	private getCol(col: number): number[] {
		//get columns
		return [this.positions[col], this.positions[col + 9], this.positions[col + 18], this.positions[col + 27], this.positions[col + 36], this.positions[col + 45], this.positions[col + 54], this.positions[col + 63], this.positions[col + 72]];
	}
	private getColPositions(col: number): number[] {
		//get columns
		return new Array(9).fill(col).map((n, i) => n + i * 9)
	}
	private getBox(row: number, col: number): number[] {
		//get upper left cell of box
		//fill in the rest
		const boxRow = Math.floor(row / 3) * 3;
		const boxCol = Math.floor(col / 3) * 3;
		return [this.getCell(boxRow, boxCol), this.getCell(boxRow, boxCol + 1), this.getCell(boxRow, boxCol + 2), this.getCell(boxRow + 1, boxCol), this.getCell(boxRow + 1, boxCol + 1), this.getCell(boxRow + 1, boxCol + 2), this.getCell(boxRow + 2, boxCol), this.getCell(boxRow + 2, boxCol + 1), this.getCell(boxRow + 2, boxCol + 2)];
	}
	private getBoxPositions(row: number, col: number): number[] {
		//get upper left cell of box
		//fill in the rest
		const boxRow = Math.floor(row / 3) * 3;
		const boxCol = Math.floor(col / 3) * 3;
		return [this.resolveIndex(boxRow, boxCol), this.resolveIndex(boxRow, boxCol + 1), this.resolveIndex(boxRow, boxCol + 2), this.resolveIndex(boxRow + 1, boxCol), this.resolveIndex(boxRow + 1, boxCol + 1), this.resolveIndex(boxRow + 1, boxCol + 2), this.resolveIndex(boxRow + 2, boxCol), this.resolveIndex(boxRow + 2, boxCol + 1), this.resolveIndex(boxRow + 2, boxCol + 2)];
	}
	private getCellPossibilities(index: number): number[] {
		//grab the row, max, and col
		const row = this.getRow(Math.floor(parseInt(index.toString()) / 9));
		const col = this.getCol(index % 9);
		const box = this.getBox(Math.floor(parseInt(index.toString()) / 9), index % 9);

		//get the union set of row, col, and box
		const possibilities = [...new Set(row.concat(col).concat(box))];

		//get the set differences between possibilities and [1-9]
		const diff = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(x => possibilities.indexOf(x) == -1);

		//push diff to proper position in this.possibilities
		this.possibilities[index] = diff;

		return diff
	}
	private pass() {
		//find empty cells in this.posistions
		for (let i = 0; i < this.positions.length; i++) {
			if (this.positions[i] == 0) {
				const diff = this.getCellPossibilities(i);

				//if diff.length is 1, push index to guarentees
				if (diff.length == 1) {
					//also set the value of this.positions[i] to the value of diff[0]
					this.positions[i] = diff[0];

					const row = this.getRowPositions(Math.floor(i * 0.111));
					const col = this.getColPositions(i % 9);
					const box = this.getBoxPositions(Math.floor(i * 0.111), i % 9);

					const searchSpace = [...new Set(row.concat(col).concat(box))];

					//get cell possibilities for every index in searchSpace
					searchSpace.filter(n => this.positions[n] == 0).forEach(x => this.getCellPossibilities(x));

				}


			}
		}
	}
	private countMissing() {
		//count the number of missing values
		return this.positions.filter(x => x == 0).length;
	}
	process(): void {
		let lastMissing = this.countMissing();
		let newMissing = Infinity;
		while (lastMissing != newMissing && newMissing != 0) {
			this.pass();
			lastMissing = newMissing;
			newMissing = this.countMissing();
		}
	}
	print(): void {
		//print this.positions in a 9x9 grid
		let str = ""
		for (let i = 0; i < this.positions.length; i++) {
			if (i % 9 == 0) {
				console.log(str);
				str = "";
			}
			str += " " + this.positions[i];
		}
		console.log(str);
	}
}

//TODO add process forking
//split off into multiple branches when a cell has multiple possibilities


const tmp = new Sudoku([
	5, 8, 0, 6, 1, 3, 9, 0, 7,
	0, 0, 6, 0, 0, 0, 1, 0, 5,
	4, 9, 1, 7, 0, 8, 3, 0, 2,
	0, 0, 0, 2, 0, 0, 0, 1, 0,
	0, 4, 7, 0, 8, 6, 0, 0, 0,
	8, 2, 0, 0, 0, 0, 7, 0, 0,
	0, 0, 0, 8, 0, 5, 6, 9, 0,
	0, 0, 4, 0, 0, 0, 8, 0, 0,
	9, 0, 0, 0, 2, 1, 0, 7, 0
], 0, 1);

tmp.print();
tmp.process();
tmp.print();
tmp.process();