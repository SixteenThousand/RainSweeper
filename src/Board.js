import Cell from "./Cell.js";

const SVGNS = "http://www.w3.org/2000/svg";
const ADJ_TOL = 0.4;
	// the tolerance for two vertices of different cells to be considered
	// "approximately the same", divided by the side length of the bounding
	// shape of a cell


class CellGroup {
	/*
		Organises a group of cells that can then be replicated in a grid
		formation to form the board. Specifically, it organises:
			- drawing the cells onto an svg canvas
			- determining which cells are adjacnent to each other
	*/
	
	constructor(cellsInfo,dx,dy,groupPadding) {
		/*
			++++++++++++ parameters ++++++++++++
			(Number/int[][]) cellsInfo: information about each cell in the
				group. Specifically, each entry in the array is an object with 
				properties:
					- x: the x-coord of the top-leftmost vertex of the bounding shape
					- y: the y-coord of the top-leftmost vertex of the bounding shape
					- angle: the angle the baseline of the bounding shape makes with the 
						horizontal
					- numSides: the number of sides of the cell
				in that order.
				Note that the coordinates are measured relative to the
				coordinates of the top-leftmost vertex of the top-leftmost
				cell in the group, and in units of the side length of the bounding shape
				of a cell.
			(Number) dx,dy: the difference in x/y-coordinates between
				the top-leftmost and bottom-rightmost vertices of the cells
				when rendered
			(Number) groupPadding: dx,dy above define a rectangle used to position
				the cell group. padding is the padding need around this rectangle
				needed to fit all of the cell shapes onto a screen
		*/
		this.cellsInfo = cellsInfo;
		this.numCells = cellsInfo.length;
		this.dx = dx;
		this.dy = dy;
		this.groupPadding = groupPadding;
	}
	
	draw(svgcanvas,x,y,boundSide) {
		/*
			creates a copy of the cells that this CellGroup represents in
			the given svg element at given coordinates
			(svg element) svgcanvas: the svg element
			(Number/int) x,y: the coordinates of the top-leftmost vertex of the
				top-leftmost cell in this CellGroup
			(Number) boundSide: the boundSide-length of the bounding shape of each cell
		*/
		let cells = [];
		let tmpAngle;
		for(let info of this.cellsInfo) {
			tmpAngle = Math.PI*(0.5-(1/info.numSides));
			cells[cells.length] = new Cell.RegularCell(
				svgcanvas,
				x + boundSide * info.x,
				y + boundSide * info.y,
				info.angle,
				info.numSides,
				boundSide
			);
		}
		return cells;
	}
}


class Board {
	constructor(svgcanvas,boundSide,groupType,numRows,numCols,totalBombs) {
		/*
			(CellGroup) groupType: the type of cell group being used to
				contruct this board
			(Number/int) numRows,numCols: the number of rows/columns in the
				grid of cell groups
			(Number/int) totalBombs: the total number of bombs to be 
				placed on the board
		*/
		this.cells = [];
		this.boundSide = boundSide;
		this.numCellsInGroup = groupType.numCells;
		let x0 = groupType.groupPadding * boundSide;
		let y0 = groupType.groupPadding * boundSide;
		for(let i=0; i<numRows; ++i) {
			for(let j=0;j<numCols;++j) {
				this.cells = this.cells.concat(
					groupType.draw(
						svgcanvas,
						x0+j*groupType.dx*boundSide,
						y0+i*groupType.dy*boundSide,
						boundSide
					)
				);
			}
		}
		
		this.height = boundSide * (
			groupType.dy * numRows +
			groupType.groupPadding * 2
		);
		this.width = boundSide * (
			groupType.dx * numCols +
			groupType.groupPadding * 2
		);
		
		this.numBombs = totalBombs;
		
		// dealing with the first click
		document.addEventListener(
			"click",
			event => {
				let bombIndices = [];
				let cellIndices = [...this.cells.keys()];
				// remove the cell that was clicked on first
				// so it doesn't become a bomb
				let firstCellIndex = 0;
				while(firstCellIndex < cellIndices.length &&
					this.cells[firstCellIndex].cellShape !== event.target) {
					++firstCellIndex;
				}
				cellIndices.splice(firstCellIndex,1);
				let bombIndex;
				for(let j=0; j<totalBombs; ++j) {
					bombIndex = Math.floor(cellIndices.length*Math.random());
					bombIndices.push(cellIndices[bombIndex]);
					cellIndices.splice(bombIndex,1);
				}
				for(let i of bombIndices) {
					this.cells[i].setBomb();
					for(let j=0; j<this.cells.length; ++j) {
						if(j === i) {
							continue;
						}
						if(this.areAdjacent(i,j)) {
							this.cells[j].incNumAdjBombs();
						}
					}
				}
				// this.cells[firstCellIndex].reveal();
			},
			{once:true,capture:true}
		);
	}
	
	approxEqual(vertex1,vertex2) {
		// determines whether two given points are the same,
		// 	up to a tolerance of ADJ_TOL times the side length of the bounding
		// shape of a cell
		let [x1,y1] = vertex1.split(",").map(parseFloat);
		let [x2,y2] = vertex2.split(",").map(parseFloat);
		return (x1-x2)**2 + (y1-y2)**2 < ADJ_TOL*this.boundSide;
	}
	
	areAdjacent(index1,index2) {
		// calculates whether the cells at indices index1,index2 in this.cells
		// are adjacent or not; i.e. whether they share a cell border
		if(this.cells[index1] === this.cells[index2]) {
			return false;
		}
		// caculate which cellgroups these two cells are part of
		let numCellsInRow = this.numCols * this.numCellsInGroup;
		let row1 = Math.trunc(index1 / numCellsInRow);
		let row2 = Math.trunc(index2 / numCellsInRow);
		let col1 = Math.trunc((index1 % numCellsInRow) / 
			this.numCellsInGroup);
		let col2 = Math.trunc((index2 % numCellsInRow) / 
			this.numCellsInGroup);
		if(Math.abs(row1-row2) > 1 || Math.abs(col1-col2) > 1) {
			return false;
		}
		// calculate whether the two cells have any vertices in common
		let vertices1 = this.cells[index1].boundShape.getAttribute("points").split(" ");
		let vertices2 = this.cells[index2].boundShape.getAttribute("points").split(" ");
		for(let i=0; i<vertices1.length; ++i) {
			for(let j=0; j<vertices2.length; ++j) {
				if(this.approxEqual(vertices1[i],vertices2[j])) {
					return true;
				}
			}
		}
		return false;
	}
	
	isWon() {
		// determines whether the player has won the game when it is called
		for(let cell of this.cells) {
			if(!cell.isRevealed && !cell.isBomb)
				return false;
		}
		return true;
	}
}


const exports = {
	"CellGroup":CellGroup,
	"Board":Board,
}

export default exports;
