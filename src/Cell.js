const DEFAULT_COLOUR = "white";
const NO_BOMB_BACKGROUND = "#00ffff";
const BOMB_BACKGROUND = "#000099";
const LABEL_COLOURS = [
	"#00ffff",
	"#0000ff",
	"#00ff00",
	"#ff0000",
	"#00ffff",
	"#ffff00",
	"#ff00ff",
	"#000000",
	"#ffffff"
];
const LABEL_FONT = "Helvetica, Arial";
const SVGNS = "http://www.w3.org/2000/svg";
const BORDER_CELL_RATIO = 0.1;
// The side length of the flag (i.e. the triangle part) divided by 
// twice the distance from the the centre of the cell to one of its sides
const FLAG_CELL_RATIO = 0.25;
const POLEHEIGHT_FLAG_RATIO = 3;
const POLEWIDTH_FLAG_RATIO = 0.15;
const FLAG_COLOUR = "red";
const FLAGPOLE_COLOUR = "black";
// the ratio of the font size to the cell side length
const FONT_CELL_RATIO = 0.5;
// 	the padding to be put around each cell
// (as a fraction of the bounding shape's side length
const PADDING = 0.15;



function hlPoint(svgcanvas,x,y,colour) {
	// highlights a given point in a given SVG element
	// for debugging purposes only
	let dot = document.createElementNS(SVGNS,"circle");
	dot.setAttribute("cx",x.toString());
	dot.setAttribute("cy",y.toString());
	dot.setAttribute("r","6");
	dot.setAttribute("fill",colour);
	svgcanvas.appendChild(dot);
}

function regularPoly(x,y,angle,numSides,side) {
	


class RegularCell {
	constructor(svgcanvas,x,y,angle,numSides,boundSide) {
		/*
			(Reference to SVG element) svgcanvas: the svg element the cell
				will be drawn in
			(Number) x: the x-coordinate of the topmost and leftmost vertex
				of the polygon
			(Number) y:  the y-coordinate of the topmost and leftmost 
				vertex of the polygon
			(Number) angle: the angle (in radians) that the baseline (the 
				first side fo the polygon to be drawn) makes with the horizontal
			(Number/int) numSides: the number of sides of the polygon representing
				the cell
			(Number) boundSide: the side length of the "bounding shape" of the cell
				The "bounding shape" here is just a slightly larger copy of the cell
				shape used to give some padding between cells.
		*/
		// ++++++++++++ creating the actual cell shape ++++++++++++
		let boundShape = document.createElementNS(SVGNS,"polygon");
		let cellShape = document.createElementNS(SVGNS,"poygon");
		let tmpx = x, tmpy = y;
		let vertices = "";
		for(let i=0; i<numSides; ++i) {
			vertices += `${tmpx},${tmpy}`;
			if(i<numSides-1)
				vertices += " ";
			tmpx += boundSide*Math.cos(angle + i*2*Math.PI/numSides);
			tmpy += boundSide*Math.sin(angle + i*2*Math.PI/numSides);
		}
		boundShape.setAttribute("points",vertices);
		boundShape.setAttribute("fill",DEFAULT_COLOUR);
		
		this.boundShape = boundShape;
		this.cellShape = cellShape;
		this.boundSide = boundSide;
		this.cellSide = cellSide;
		this.svgcanvas = svgcanvas;
		
		// ++++++++++++ centre of the cell ++++++++++++
		// (for postioning the flag/number of adjacent bombs) 
		this.centreX = x + (boundSide * Math.sin(Math.PI/numSides - angle)) /
			(2 * Math.sin(Math.PI/numSides));
		this.centreY = y + (boundSide * Math.cos(Math.PI/numSides - angle)) /
			(2 * Math.sin(Math.PI/numSides));
		
		// ++++++++++++ Cell Properties (to be reset later) ++++++++++++
		this.isBomb = false;
		this.numAdjBombs = 0;
		this.isRevealed = false;
		this.isFlagged = false;
		
		createFlag();
		
		// ++++++++++++ add event listeners ++++++++++++
		this.cellShape.addEventListener("click",
			event => {
				if(event.button === 0) {
					this.reveal();
				}
			}
		);
		this.cellShape.addEventListener("contextmenu",
			event => {
				event.preventDefault();
				this.toggleFlag();
			}
		);
		
		// ++++++++++++ add this cell to the svg element ++++++++++++
		svgcanvas.appendChild(this.boundShape);
		svgcanvas.appendChild(this.cellShape);
		svgcanvas.appendChild(this.flagpole);
		svgcanvas.appendChild(this.flag);
	}
	
	createFlag() {
		this.flagpole = document.createElementNS(SVGNS,"rect");
		this.flagpole.setAttribute("x",
			(this.centreX - 0.5*flagSide*POLEWIDTH_FLAG_RATIO).toString());
		this.flagpole.setAttribute("y",
			(this.centreY - 0.5*flagSide*POLEHEIGHT_FLAG_RATIO).toString());
		this.flagpole.setAttribute("width",
			(flagSide*POLEWIDTH_FLAG_RATIO).toString());
		this.flagpole.setAttribute("height",
			(flagSide*POLEHEIGHT_FLAG_RATIO).toString());
		this.flagpole.setAttribute("fill","transparent");
		
		this.flag = document.createElementNS(SVGNS,"polygon");
		let flagSide;
		if(numSides == 4)
			flagSide = FLAG_CELL_RATIO * 0.5*this.side;
		else
			flagSide = FLAG_CELL_RATIO * this.side/Math.tan(Math.PI/numSides);
		let poleTopRightX = this.centreX + 0.5*flagSide*POLEWIDTH_FLAG_RATIO;
		let poleTopRightY = this.centreY - 0.5*flagSide*POLEHEIGHT_FLAG_RATIO;
		this.flag.setAttribute("points",
			"".concat(
			`${poleTopRightX},${poleTopRightY} `,
			`${poleTopRightX},${poleTopRightY + flagSide} `,
			`${poleTopRightX + Math.sqrt(0.75)*flagSide},${poleTopRightY + 0.5*flagSide}`
			)
		);
		this.flag.setAttribute("fill","transparent");
	}
	
	setBomb() {
		this.isBomb = true;
	}
	
	incNumAdjBombs() {
		++this.numAdjBombs;
	}
	
	toggleFlag() {
		if(this.isFlagged || this.isRevealed) {
			this.flagpole.setAttribute("fill","transparent");
			this.flag.setAttribute("fill", "transparent");
		} else {
			this.flagpole.setAttribute("fill",FLAGPOLE_COLOUR);
			this.flag.setAttribute("fill",FLAG_COLOUR);
		}
		this.isFlagged = !this.isFlagged;
	}
	
	reveal() {
		if(this.isFlagged) {
			return;
		}
		this.isRevealed = true;
		if(this.isBomb) {
			this.cellShape.setAttribute("fill","purple");
			console.log("bomb functionailty not built!");
		} else {
			let label = document.createElementNS(SVGNS,"text");
			let labelColour;
			if(this.numAdjBombs < LABEL_COLOURS.length) {
				labelColour = LABEL_COLOURS[this.numAdjBombs];
			} else {
				labelColour = LABEL_COLOURS[LABEL_COLOURS.length-1];
			}
			label.setAttribute("fill",labelColour);
			label.setAttribute("x",this.centreX.toString());
			label.setAttribute("y",this.centreY.toString());
			label.setAttribute("text-anchor","middle");
			label.setAttribute("dominant-baseline","middle");
			label.setAttribute("font-size",Math.ceil(this.side*FONT_CELL_RATIO).toString());
			label.setAttribute("font-family",LABEL_FONT);
			let labelText = document.createTextNode(this.numAdjBombs.toString());
			label.appendChild(labelText);
			this.svgcanvas.appendChild(label);
		}
	}
}



const cellpkg = {
	"SVGNS":SVGNS,
	"RegularCell": RegularCell,
}

export default cellpkg;
