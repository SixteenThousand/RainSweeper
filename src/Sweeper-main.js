import Cell from "./Cell.js";
import Board from "./Board.js";
import Mode from "./Mode.js";



// ++++++++++++ Mode Selector ++++++++++++
const modeSelector = document.getElementById("Mode-Selector");
let option, optionName;
for(const modeName in Mode) {
	option = document.createElement("option");
	optionName = document.createTextNode(modeName);
	option.appendChild(optionName);
	modeSelector.appendChild(option);
}



// ++++++++++++ Board Size Selector ++++++++++++
const sizeSelector = document.getElementById("size-Selector");
modeSelector.addEventListener("change",updateSizeSelector);
function updateSizeSelector(evt) {
	while(sizeSelector.children.length > 0)
		sizeSelector.children[0].remove();
	let option, optionName, totalCells;
	for(const dims of Mode[modeSelector.value].sizes) {
		option = document.createElement("option");
		totalCells = 
			dims[0]*dims[1]*Mode[modeSelector.value].groupType.numCells;
		optionName = document.createTextNode(`${totalCells} clouds`);
		option.setAttribute("value",dims);
		option.appendChild(optionName);
		sizeSelector.appendChild(option);
	}
}



// ++++++++++++ Number Of Bombs Input ++++++++++++
const numBombsInput = document.getElementById("numBombs-Input");
numBombsInput.setAttribute("value","9");
let numBombs = 0;
const NUM_BOMBS_LABEL_WIDTH = 3;
function format(num,width) {
	// returns a given number as a string with left-padding zeroes to make it 
	// a given width
	// (Number/integer) num: the given number
	// (Number/integer) width: the given width
	let numAsStr = num.toString();
	return "".padEnd(width-numAsStr.length,'0').concat(numAsStr);
}
let numBombsLabel = document.createTextNode(format(numBombs,3));
document.getElementById("current-game-state").appendChild(numBombsLabel);
document.addEventListener("incBombs",
	(evt) => {
		++numBombs;
		numBombsLabel.nodeValue = format(numBombs,3);
	}
);
document.addEventListener("decBombs",
	(evt) => {
		--numBombs;
		numBombsLabel.nodeValue =  format(numBombs,3);
	}
);



// ++++++++++++ New Game Button ++++++++++++
let svgcanvas;
const newGameButton = document.getElementById("New-Game");
let game;
function NewGame() {
	if(svgcanvas !== undefined)
		svgcanvas.remove();
	svgcanvas = document.createElementNS(Cell.SVGNS,"svg");
	const dims = sizeSelector.value.split(",").map((x) => parseInt(x));
	game = new Board.Board(
		svgcanvas,
		40,
		Mode[modeSelector.value].groupType,
		dims[0],dims[1],
		parseInt(numBombsInput.value)
	);
	svgcanvas.setAttribute("height",game.height.toString());
	svgcanvas.setAttribute("width",game.width.toString());
	document.body.appendChild(svgcanvas);
}
// NewGame();
newGameButton.addEventListener("click",event => {NewGame();});


// ++++++++++++ debug ++++++++++++
const debugButton = document.getElementById("debug-button");
debugButton.addEventListener("click",evt => {
	console.log(sizeSelector.children[0]);
});
