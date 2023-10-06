import Cell from "./Cell.js";
import Board from "./Board.js";
import Mode from "./Mode.js";



// ++++++++++++ INDICATORS ++++++++++++
	// +++ Note +++
	// This section uses some magic numbers. This is because any changes
	// made to this part in the future will likely involve refactoring how the 
	// code itself works, meaning any constants would need to be changed anyway.

//  percentage of cells revealed indicator 
let numMapped = 0, totalCells;
function mappedFormat() {
	let pc = Math.trunc((numMapped/totalCells) * 100);
	return "% Mapped: ".concat(
		pc.toString().padStart(2,"0"),
		"%",
	);
}
let pcMappedLabel = document.createTextNode(mappedFormat());
document.getElementById("pcMapped-state").appendChild(pcMappedLabel);
document.addEventListener("incNumMapped",
	(evt) => {
		++numMapped;
		pcMappedLabel.nodeValue = mappedFormat();
	}
);
document.addEventListener("decNumMapped",
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
	return "# rainclouds left: ".concat(
		numBombs < 0 ? "-":"",
		numAsStr.padStart(3,"0")
	);
}
let numBombsLabel = document.createTextNode(bombsFormat());
document.getElementById("numBombs-state").appendChild(numBombsLabel);
document.addEventListener("incBombs",
	(evt) => {
		++numBombs;
		numBombsLabel.nodeValue = bombsFormat();
	}
);
document.addEventListener("decBombs",
	(evt) => {
		--numBombs;
		numBombsLabel.nodeValue =  bombsFormat();
	}
);



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

//  number of bombs input 
const numBombsInput = document.getElementById("numBombs-Input");
numBombsInput.setAttribute("value","9");


//  new game button 
let svgcanvas;
document.getElementById("New-Game").addEventListener("click",
	(evt) => {
		// get rid of existing game
		if(svgcanvas !== undefined)
			svgcanvas.remove();
		svgcanvas = document.createElementNS(Cell.SVGNS,"svg");
		
		// actually make the game
		const dims = sizeSelector.value.split(",").map((x) => parseInt(x));
		let game = new Board.Board(
			svgcanvas,
			40,
			Mode[modeSelector.value].groupType,
			dims[0],dims[1],
			parseInt(numBombsInput.value)
		);
		
		// set initial indicator values
		numBombs = parseInt(numBombsInput.value);
		numBombsLabel.nodeValue = bombsFormat();
		totalCells = game.cells.length;
		pcMappedLabel.nodeValue = mappedFormat();
		
		// add the game to the DOM
		svgcanvas.setAttribute("height",game.height.toString());
		svgcanvas.setAttribute("width",game.width.toString());
		document.body.appendChild(svgcanvas);
	}
);


// ++++++++++++ debug ++++++++++++
const debugButton = document.getElementById("debug-button");
debugButton.addEventListener("click",evt => {
	console.log(sizeSelector.children[0]);
});
