import cellpkg from "./Cell.js";

const SVGNS = "http://www.w3.org/2000/svg";
const ADJ_TOL = 0.1;
	// the tolerance for two vertices of different cells to be considered
	// "approximately the same", divided by the side length of a cell


class CellGroup {
	/*
		Organises a group of cells that can then be replicated in a grid
		formation to form the board. Specifically, it organises:
			- drawing the cells onto an svg canvas
			- determining which cells are adjacnent to each other
	*/
	
	constructor(cellsInfo,dx,dy,padding) {
		/*
			++++++++++++ parameters ++++++++++++
			(Number/int[][]) cellsInfo: information about each cell in the
				group. Specifically, each entry in the array is itself an
				array containing:
					- the x-coord of the top-leftmost vertex
					- the y-coord of the top-leftmost vertex
					- the angle the baseline of the cell makes with the horizontal
					- the number of sides of the cell
				in that order.
				Note that the coordinates are measured relative to the
				coordinates of the top-leftmost vertex of the top-leftmost
				cell in the group, and in units of the side length of each cell
				Also note that cells must be positioned to be adjacent to each
				other, without padding.
			(Number) dx,dy: the difference in x/y-coordinates between
				the top-leftmost and bottom-rightmost vertices of the cells
				when rendered
			(Number) padding: dx,dy above define a rectangle used to position
				the cell group. padding is the padding need around this rectangle
				needed to fit all of the cell shapes onto a screen
		*/
		this.cellsInfo = cellsInfo;
		this.numCells = cellsInfo.length;
		this.dx = dx;
		this.dy = dy;
		this.padding = padding;
	}
	
	draw(svgcanvas,x,y,side) {
		/*
			creates a copy of the cells that this CellGroup represents in
			the given svg element at given coordinates
			(svg element) svgcanvas: the svg element
			(Number/int) x,y: the coordinates of the top-leftmost vertex of the
				top-leftmost cell in this CellGroup
			(Number) side: the side-length of each cell
		*/
		let cells = [];
		for(let info of this.cellsInfo) {
			cells[cells.length] = new cellpkg.RegularCell(
				svgcanvas,
				x+side*info[0],
				y+side*info[1],
				info[2],
				info[3],
				side
			);
		}
		return cells;
	}
}


class Board {
	constructor(svgcanvas,side,groupType,numRows,numCols,numBombs) {
		/*
			(CellGroup) groupType: the type of cell group being used to
				contruct this board
			(Number/int) numRows,numCols: the number of rows/columns in the
				grid of cell groups
			(Number/int) totalBombs: the total number of bombs to be 
				placed on the board
		*/
		this.cells = [];
		this.side = side;
		this.numCellsInGroup = groupType.numCells;
		let x0 = groupType.padding * side;
		let y0 = groupType.padding * side;
		for(let i=0; i<numRows; ++i) {
			for(let j=0;j<numCols;++j) {
				this.cells = this.cells.concat(
					groupType.draw(
						svgcanvas,
						x0+j*groupType.dx*side,
						y0+i*groupType.dy*side,
						side
					)
				);
			}
		}
		
		// dealing with the first click
		document.addEventListener("click",
			event => {
				let bombIndices = [];
				let cellIndices = [...this.cells.keys()];
				// remove the cell that was clicked on first
				// so it doesn't become a bomb
				let firstCellIndex = 0;
				while(firstCellIndex < cellIndices.length &&
					this.cells[firstCellIndex].getShape() !== event.target) {
					++firstCellIndex;
				}
				cellIndices.splice(firstCellIndex,1);
				let bombIndex;
				for(let j=0; j<numBombs; ++j) {
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
		// 	up to a tolerance of ADJ_TOL times the side length of a cell
		let [x1,y1] = vertex1.split(",").map(parseFloat);
		let [x2,y2] = vertex2.split(",").map(parseFloat);
		return (x1-x2)**2 + (y1-y2)**2 < ADJ_TOL*this.side;
	}
	
	areAdjacent(index1,index2) {
		// calculates whether the cells at indices index1,index2 in this.cells
		// are adjacent or not; i.e. whether they share a cell border
		if(this.cells[index1] === this.cells[index2]) {
			return false;
		}
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
		let vertices1 = this.cells[index1].getShape().getAttribute("points").split(" ");
		let vertices2 = this.cells[index2].getShape().getAttribute("points").split(" ");
		for(let i=0; i<vertices1.length; ++i) {
			for(let j=0; j<vertices2.length; ++j) {
				if(this.approxEqual(vertices1[i],vertices2[j]) &&
						this.approxEqual(
							vertices1[(i+1)%vertices1.length],
							vertices2[(vertices2.length+j-1)%vertices2.length]
						)
				) {
					return true;
				}
			}
		}
		return false;
	}
}


const boardpkg = {
	"CellGroup":CellGroup,
	"Board":Board,
}

export default boardpkg
