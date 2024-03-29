import Cell from "./Cell.js";
import Board from "./Board.js";
import Mode from "./Mode.js";

const CELL_SIZE = 40;
const DEFAULT_NUM_BOMBS = 16;
const DEFAULT_ROWS = 4;
const DEFAULT_COLS = 6;
const DEFAULT_MODE = "Squares & Octagons";


// ++++++++++++ INDICATORS ++++++++++++
	// +++ Note +++
	// This section uses some magic numbers. This is because any changes
	// made to this part in the future will likely involve refactoring how the 
	// code itself works, meaning any constants would need to be changed anyway.

//  percentage of cells revealed indicator 
let numMapped = 0, totalCells;
function mappedFormat() {
	let pc = Math.trunc((numMapped/totalCells) * 100);
	return pc.toString().concat("%");
}
let pcMappedLabel = document.createTextNode(mappedFormat());
document.getElementById("pcMapped-state").appendChild(pcMappedLabel);
document.addEventListener(
	"incNumMapped",
	(evt) => {
		++numMapped;
		pcMappedLabel.nodeValue = mappedFormat();
		if(game.isWon()) {
			alert("You Win!\nYou can start a new game using the menu above");
		}
	}
);
document.addEventListener(
	"decNumMapped",
	(evt) => {
		--numMapped;
		pcMappedLabel.nodeValue = mappedFormat();
	}
);
		

//  current number of bombs indicator 
let numBombs = 0;
function bombsFormat() {
	// returns the string to be used as the current number of bombs
	// indicator
	let numAsStr = Math.abs(numBombs).toString();
	return "".concat(
		numBombs < 0 ? "-":" ",
		numAsStr
	);
}
let numBombsLabel = document.createTextNode(bombsFormat());
document.getElementById("numBombs-state").appendChild(numBombsLabel);
document.addEventListener(
	"incBombs",
	(evt) => {
		++numBombs;
		numBombsLabel.nodeValue = bombsFormat();
	}
);
document.addEventListener(
	"decBombs",
	(evt) => {
		--numBombs;
		numBombsLabel.nodeValue =  bombsFormat();
	}
);


// number of exploded bombs indicator
let numExploded = 0;
let numExplodedLabel = document.createTextNode(numExploded.toString());
document.getElementById("numExploded-state").appendChild(numExplodedLabel);
document.addEventListener(
	"incNumExploded",
	(evt) => {
		++numExploded;
		numExplodedLabel.nodeValue = numExploded.toString();
	}
)



// ++++++++++++ CREATE NEW GAME (SELECTORS) ++++++++++++
//  mode selector 
const modeSelector = document.getElementById("Mode-Selector");
let option, optionName;
for(const modeName in Mode) {
	option = document.createElement("option");
	optionName = document.createTextNode(modeName);
	option.appendChild(optionName);
	modeSelector.appendChild(option);
}

//  board size selector 
const sizeSelector = document.getElementById("size-Selector");
modeSelector.addEventListener("change",updateSizeSelector);
function updateSizeSelector(evt) {
	while(sizeSelector.children.length > 0)
		sizeSelector.children[0].remove();
	let option, optionName, numCellsInOption;
	for(let dims of Mode[modeSelector.value].sizes) {
		option = document.createElement("option");
		numCellsInOption = 
			dims[0]*dims[1]*Mode[modeSelector.value].groupType.numCells;
		optionName = document.createTextNode(`${numCellsInOption} clouds`);
		option.value = dims;
		option.appendChild(optionName);
		sizeSelector.appendChild(option);
	}
}

//  number of bombs selector
const numBombsInput = document.getElementById("numBombs-Selector");
function updateNumBombsInput(evt) {
	let maxCells = sizeSelector.value
		.split(",")
		.map((x)=>parseInt(x))
		.reduce(
			(acc,entry) => acc * entry,
			1
		)
		* Mode[modeSelector.value].groupType.numCells;
	numBombsInput.max = maxCells.toString();
	numBombsInput.value = Math.round(maxCells/6);
}
sizeSelector.addEventListener("change",updateNumBombsInput);
modeSelector.addEventListener("change",updateNumBombsInput);


//  new game button 
let svgcanvas, game;
document.getElementById("New-Game").addEventListener(
	"click",
	(evt) => {
		// get rid of existing game
		if(svgcanvas !== undefined)
			svgcanvas.remove();
		svgcanvas = document.createElementNS(Cell.SVGNS,"svg");
		
		// actually make the game
		const dims = sizeSelector.value.split(",").map((x) => parseInt(x));
		game = new Board.Board(
			svgcanvas,
			CELL_SIZE,
			Mode[modeSelector.value].groupType,
			dims[0],dims[1],
			parseInt(numBombsInput.value)
		);
		
		// set initial indicator values
		numBombs = parseInt(numBombsInput.value);
		numBombsLabel.nodeValue = bombsFormat();
		totalCells = game.cells.length;
		numMapped = 0;
		pcMappedLabel.nodeValue = mappedFormat();
		numExploded = 0;
		numExplodedLabel.nodeValue = numExploded.toString();
		
		// add the game to the DOM
		svgcanvas.setAttribute("height",game.height.toString());
		svgcanvas.setAttribute("width",game.width.toString());
		document.getElementById("game-container").appendChild(svgcanvas);
	}
);


// ++++++++++++ CREATE DEFAULT GAME ++++++++++++
// (i.e. the version the user will see loading the website)
svgcanvas = document.createElementNS(Cell.SVGNS,"svg");
game = new Board.Board(
	svgcanvas,
	CELL_SIZE,
	Mode[DEFAULT_MODE].groupType,
	DEFAULT_ROWS,DEFAULT_COLS,
	DEFAULT_NUM_BOMBS
);

numBombs = DEFAULT_NUM_BOMBS;
numBombsLabel.nodeValue = bombsFormat();
totalCells = game.cells.length;
pcMappedLabel.nodeValue = mappedFormat();

svgcanvas.setAttribute("height",game.height.toString());
svgcanvas.setAttribute("width",game.width.toString());
document.getElementById("game-container").appendChild(svgcanvas);
