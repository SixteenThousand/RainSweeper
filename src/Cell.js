// cell background 
const UNREVEALED_COLOUR = "white";
// 	the padding to be put around each cell
// (as a fraction of the bounding shape's side length)
const PADDING = 0.07;
const PADDING_COLOUR = "transparent";
const NO_BOMB_BACKGROUND = "#00ffff";
const BOMB_OPACITY = "0.2";

// the label (showing the # of adjacent bombs) 
const LABEL_COLOURS = [
	"#00ffff",
	"#0000ff",
	"#00ff00",
	"#ff0000",
	"#00ffff",
	"#ffff00",
	"#ff00ff",
	"#000000"
];
const LABEL_FONT = "Arial";
// the ratio of the font size to the cell side length
const FONT_CELL_RATIO = 0.5;

// assets
const SVGNS = "http://www.w3.org/2000/svg";
const BOMB_IMAGE_LOC = "./assets/raincloud.svg";
const FLAG_IMAGE_LOC= "./assets/umbrella-alt.svg";



const incBombs = new Event("incBombs");
const decBombs = new Event("decBombs");
const incNumMapped = new Event("incNumMapped");
const decNumMapped = new Event("decNumMapped")


function regularPoly(x,y,angle,numSides,side) {
	/*
		returns the coordinates of the veritces of a regular polygon
			(Number,Number) x,y: the coordinates of one vertex of the
				polygon
			(Number) angle: the clockwise angle one side at (x,y) makes
				with the positive x-axis
			(Number/Integer) numSides: the number of sides of the polygon
			(Number) side: the side length of the polygon
	*/
	let tmpx = x, tmpy = y;
	let vertices = "";
	for(let i=0; i<numSides; ++i) {
		vertices += `${tmpx},${tmpy}`;
		if(i<numSides-1)
			vertices += " ";
		tmpx += side*Math.cos(angle + i*2*Math.PI/numSides);
		tmpy += side*Math.sin(angle + i*2*Math.PI/numSides);
	}
	return vertices;
}



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
		let cellShape = document.createElementNS(SVGNS,"polygon");
		
		this.cellSide = boundSide * (
			1 - 2*PADDING*Math.sin(Math.PI/numSides)
		);
		
		boundShape.setAttribute(
			"points",
			regularPoly(x,y,angle,numSides,boundSide)
		);
		cellShape.setAttribute(
			"points",
			regularPoly(
				x + boundSide * PADDING * Math.sin(Math.PI/numSides - angle),
				y + boundSide * PADDING * Math.cos(Math.PI/numSides - angle),
				angle,
				numSides,
				this.cellSide
			)
		);
		boundShape.setAttribute("fill",PADDING_COLOUR);
		cellShape.setAttribute("fill",UNREVEALED_COLOUR);
		
		this.boundShape = boundShape;
		this.cellShape = cellShape;
		this.boundSide = boundSide;
		this.numSides = numSides;
		this.svgcanvas = svgcanvas;
		
		// ++++++++++++ geometric properties of the cell ++++++++++++
		// (for positioning stuff on the cell, such as the flag) 
		this.centreX = x + (boundSide * Math.sin(Math.PI/numSides - angle)) /
			(2 * Math.sin(Math.PI/numSides));
		this.centreY = y + (boundSide * Math.cos(Math.PI/numSides - angle)) /
			(2 * Math.sin(Math.PI/numSides));
		this.radius = this.cellSide / Math.tan(Math.PI/numSides);
		
		// ++++++++++++ Cell Properties (to be reset later) ++++++++++++
		this.isBomb = false;
		this.numAdjBombs = 0;
		this.isRevealed = false;
		this.isFlagged = false;
		
		// ++++++++++++ the flag ++++++++++++
		this.flagImage = document.createElementNS(SVGNS,"image");
		this.flagImage.setAttribute(
			"x",
			(this.centreX - 0.5*this.radius).toString()
		);
		this.flagImage.setAttribute(
			"y",
			(this.centreY - 0.5*this.radius).toString()
		);
		this.flagImage.setAttribute("width",this.radius.toString());
		this.flagImage.setAttribute("height",this.radius.toString());
		this.flagImage.setAttribute("href",FLAG_IMAGE_LOC);
		
		// ++++++++++++ add event listeners ++++++++++++
		this.cellShape.addEventListener(
			"click",
			event => {
				if(event.button === 0) {
					this.reveal();
				}
			}
		);
		this.cellShape.addEventListener(
			"contextmenu",
			event => {
				this.toggleFlag(event);
			}
		);
		this.flagImage.addEventListener(
			"contextmenu",
			event => {
				this.toggleFlag(event);
			}
		);
		
		// ++++++++++++ add this cell to the svg element ++++++++++++
		svgcanvas.appendChild(boundShape);
		svgcanvas.appendChild(cellShape);
	}
	
	setBomb() {
		this.isBomb = true;
	}
	
	incNumAdjBombs() {
		++this.numAdjBombs;
	}
	
	toggleFlag(event) {
		event.preventDefault();
		if(this.isRevealed) {
			return;
		}
		if(this.isFlagged) {
			document.dispatchEvent(incBombs);
			document.dispatchEvent(decNumMapped);
			this.svgcanvas.removeChild(this.flagImage);
		} else {
			document.dispatchEvent(decBombs);
			document.dispatchEvent(incNumMapped);
			this.svgcanvas.appendChild(this.flagImage);
		}
		this.isFlagged = !this.isFlagged;
	}
	
	reveal() {
		if(this.isFlagged)
			return;
		if(this.isRevealed)
			return;
		this.isRevealed = true;
		document.dispatchEvent(incNumMapped);
		if(this.isBomb) {
			document.dispatchEvent(decBombs);
			this.cellShape.setAttribute("opacity",BOMB_OPACITY);
			let bombImage = document.createElementNS(SVGNS,"image");
			bombImage.setAttribute(
				"x",
				(this.centreX - 0.5*this.radius).toString()
			);
			bombImage.setAttribute(
				"y",
				(this.centreY - 0.5*this.radius).toString()
			);
			bombImage.setAttribute("width",this.radius.toString());
			bombImage.setAttribute("height",this.radius.toString());
			bombImage.setAttribute("href",BOMB_IMAGE_LOC);
			this.svgcanvas.appendChild(bombImage);
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
			label.setAttribute(
				"font-size",
				Math.ceil(this.cellSide*FONT_CELL_RATIO).toString()
			);
			label.setAttribute("font-family",LABEL_FONT);
			let labelText = document.createTextNode(this.numAdjBombs.toString());
			label.appendChild(labelText);
			this.svgcanvas.appendChild(label);
		}
	}
}



const exports = {
	"SVGNS":SVGNS,
	"RegularCell": RegularCell
}



export default exports;
