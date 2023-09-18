import cellpkg from "./Cell.js";
import boardpkg from "./Board.js";

let svgcanvas = document.getElementById("sweepercanvas");

const root2 = Math.sqrt(2);
const sqOctInfo = [
	{x:0, y:0, angle:0, numSides:8},
	{x:1+0.5*root2, y:0.5*root2, angle:0, numSides:4},
	{x:0, y:1+root2, angle:0, numSides:4},
	{x:1+0.5*root2, y:1+0.5*root2, angle:0, numSides:8}
];
const squareAndOctagon = new boardpkg.CellGroup(sqOctInfo,2+root2,2+root2,1);

const root75 = Math.sqrt(.75);
const hexInfo = [
	{x:0, y:0, angle:0, numSides:6},
	{x:1.5, y:root75, angle:0, numSides:6}
];
const hexGroup = new boardpkg.CellGroup(hexInfo,3,2*root75,0.6);

const triInfo = [
	{x:0, y:0, angle:0.0, numSides:3},
	{x:0.5, y:root75, angle:-Math.PI/3, numSides:3},
	{x:0.5, y:root75, angle:0.0, numSides:3},
	{x:0.5, y:root75, angle:Math.PI/3, numSides:3}
];
const triGroup = new boardpkg.CellGroup(triInfo,1,2*root75,0.6);

const hexStarInfo = [
	{x:0, y:0, angle:0.0, numSides:3},
	{x:1, y:0, angle:0.0, numSides:6},
	{x:0.5, y:root75, angle:Math.PI/3, numSides:3},
	{x:0, y:2*root75, angle:0.0, numSides:6},
	{x:1, y:2*root75, angle:0.0, numSides:3},
	{x:1.5, y:3*root75, angle:Math.PI/3, numSides:3}
]
const hexStarGroup = new boardpkg.CellGroup(hexStarInfo,2,4*root75,0.6);

let game = new boardpkg.Board(svgcanvas,100,hexStarGroup,10,5,30);
