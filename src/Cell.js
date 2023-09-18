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
const FLAG_CELL_RATIO = 0.25;
	// The side length of the flag (i.e. the triangle part) divided by 
	// twice the distance from the the centre of the cell to one of its sides
const POLEHEIGHT_FLAG_RATIO = 3;
const POLEWIDTH_FLAG_RATIO = 0.15;
const FLAG_COLOUR = "red";
const FLAGPOLE_COLOUR = "black";
const FONT_CELL_RATIO = 0.5;
	// the ratio of the font size to the cell side length


function toAttribute(num) {
	// rounds a number and converts it to a string;
	// for use in defining integer attribute in elements
	return Math.round(num).toString();
}

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


class RegularCell {
	constructor(svgcanvas,x,y,angle,numSides,side) {
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
			(Number) side: the side length of the polygon representing 
				the cell
		*/
		// ++++++++++++ creating the actual cell shape ++++++++++++
		let shape = document.createElementNS(SVGNS,"polygon");
		let tmpx = x, tmpy = y;
		let vertices = "";
		for(let i=0; i<numSides; ++i) {
			vertices += `${tmpx},${tmpy}`;
			if(i<numSides-1)
				vertices += " ";
			tmpx += side*Math.cos(angle + i*2*Math.PI/numSides);
			tmpy += side*Math.sin(angle + i*2*Math.PI/numSides);
		}
		shape.setAttribute("points",vertices);
		shape.setAttribute("fill",DEFAULT_COLOUR);
		
		this.shape = shape;
		// attributes assigned by parameters
		this.x = x;
		this.y = y;
		this.side = side;
		this.svgcanvas = svgcanvas;
			// attribute not assigned by parameters
		
		// ++++++++++++ centre of the cell ++++++++++++
		// (for postioning the flag/number of adjacent bombs) 
		this.centreX = x + (side * Math.sin(Math.PI/numSides - angle)) /
			(2 * Math.sin(Math.PI/numSides));
		this.centreY = y + (side * Math.cos(Math.PI/numSides - angle)) /
			(2 * Math.sin(Math.PI/numSides));
		
		// ++++++++++++ Cell Properties (to be reset later) ++++++++++++
		this.isBomb = false;
		this.numAdjBombs = 0;
		this.isRevealed = false;
		this.isFlagged = false;
			// indicates whether the player has flagged this cell as a bomb
				// or not
		
		// ++++++++++++ creating the flag (to be displayed later) +++++++++++
		this.flag = document.createElementNS(SVGNS,"polygon");
		this.flagpole = document.createElementNS(SVGNS,"rect");
		let flagSide;
		if(numSides == 4) {
			flagSide = FLAG_CELL_RATIO * 0.5*side;
		} else {
			flagSide = FLAG_CELL_RATIO * side/Math.tan(Math.PI/numSides);
		}
		
		this.flagpole.setAttribute("x",
			(this.centreX - 0.5*flagSide*POLEWIDTH_FLAG_RATIO).toString());
		this.flagpole.setAttribute("y",
			(this.centreY - 0.5*flagSide*POLEHEIGHT_FLAG_RATIO).toString());
		this.flagpole.setAttribute("width",
			(flagSide*POLEWIDTH_FLAG_RATIO).toString());
		this.flagpole.setAttribute("height",
			(flagSide*POLEHEIGHT_FLAG_RATIO).toString());
		this.flagpole.setAttribute("fill","transparent");
		
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
		
		// ++++++++++++ add event listeners ++++++++++++
		this.shape.addEventListener("click",
			event => {
				if(event.button === 0) {
					this.reveal();
				}
			}
		);
		this.shape.addEventListener("contextmenu",
			event => {
				event.preventDefault();
				this.toggleFlag();
			}
		);
		
		// ++++++++++++ add this cell to the svg element ++++++++++++
		svgcanvas.appendChild(this.shape);
		svgcanvas.appendChild(this.flagpole);
		svgcanvas.appendChild(this.flag);
	}
	
	getShape() {
		return this.shape;
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
			this.shape.setAttribute("fill","purple");
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
