import Cell from "./Cell.js";
import Board from "./Board.js";
import Mode from "./Mode.js";



let svgcanvas;
const newGameButton = document.getElementById("New-Game");
const modeSelector = document.getElementById("Mode-Selector");
const sizeSelector = document.getElementById("size-Selector");


let option;
let optionName;
for(const modeName in Mode) {
	option = document.createElement("option");
	optionName = document.createTextNode(modeName);
	option.appendChild(optionName);
	modeSelector.appendChild(option);
}


let game;

function NewGame() {
	if(svgcanvas !== undefined)
		svgcanvas.remove();
	svgcanvas = document.createElementNS(Cell.SVGNS,"svg");
	game = new Board.Board(
		svgcanvas,
		100,
		Mode[modeSelector.value].groupType,
		3,3,
		9);
	svgcanvas.setAttribute("height",game.height.toString());
	svgcanvas.setAttribute("width",game.width.toString());
	document.body.appendChild(svgcanvas);
}

// NewGame(squareAndOctagon);
svgcanvas = document.createElementNS(Cell.SVGNS,"svg");
game = new Board.Board(svgcanvas,100,Mode["Squares & Octagons"].groupType,4,3,9);
svgcanvas.setAttribute("height",game.height.toString());
svgcanvas.setAttribute("width",game.width.toString());
document.body.appendChild(svgcanvas);

newGameButton.addEventListener("click",event => {NewGame();});
