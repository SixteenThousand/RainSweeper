import cellpkg from "./Cell.js";
import boardpkg from "./Board.js";

let svgcanvas = document.getElementById("sweepercanvas");

const root2 = Math.sqrt(2);
const sqOctInfo = [
	[0,0,0,8],
	[1+0.5*root2,0.5*root2,0,4],
	[0,1+root2,0,4],
	[1+0.5*root2,1+0.5*root2,0,8]
];
const squareAndOctagon = new boardpkg.CellGroup(sqOctInfo,2+root2,2+root2,1);

const root75 = Math.sqrt(.75);
const hexInfo = [
	[0,0,0.0,6],
	[1.5,root75,0.0,6]
];
const hexGroup = new boardpkg.CellGroup(hexInfo,3,2*root75,0.6);

const triInfo = [
	[0,0,0.0,3],
	[0.5,root75,-Math.PI/3,3],
	[0.5,root75,0.0,3],
	[0.5,root75,Math.PI/3,3]
];
const triGroup = new boardpkg.CellGroup(triInfo,1,2*root75,0.6);

const hexStarInfo = [
	[0,0,0.0,3],
	[1,0,0.0,6],
	[0.5,root75,Math.PI/3,3],
	[0,2*root75,0.0,6],
	[1,2*root75,0.0,3],
	[1.5,3*root75,Math.PI/3,3]
]
const hexStarGroup = new boardpkg.CellGroup(hexStarInfo,2,4*root75,0.6);

let game = new boardpkg.Board(svgcanvas,100,hexStarGroup,10,5,30);
