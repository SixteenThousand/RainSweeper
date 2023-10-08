// This module is just a list of game modes of RainSweeper
import Board from "./Board.js";

const root2 = Math.sqrt(2);
const root3 = Math.sqrt(3);
const root75 = Math.sqrt(.75);


const sqOctInfo = [
	{x:0, y:0, angle:0, numSides:8},
	{x:1+0.5*root2, y:0.5*root2, angle:0, numSides:4},
	{x:0, y:1+root2, angle:0, numSides:4},
	{x:1+0.5*root2, y:1+0.5*root2, angle:0, numSides:8}
];
const squareAndOctagon = new Board.CellGroup(sqOctInfo,2+root2,2+root2,1);

const hexInfo = [
	{x:0, y:0, angle:0, numSides:6},
	{x:1.5, y:root75, angle:0, numSides:6}
];
const hexGroup = new Board.CellGroup(hexInfo,3,2*root75,0.8);

const triInfo = [
	{x:0, y:0, angle:0.0, numSides:3},
	{x:0.5, y:root75, angle:-Math.PI/3, numSides:3},
	{x:0.5, y:root75, angle:0.0, numSides:3},
	{x:0.5, y:root75, angle:Math.PI/3, numSides:3}
];
const triGroup = new Board.CellGroup(triInfo,1,2*root75,0.6);

const hexStarInfo = [
	{x:0, y:0, angle:0.0, numSides:3},
	{x:1, y:0, angle:0.0, numSides:6},
	{x:0.5, y:root75, angle:Math.PI/3, numSides:3},
	{x:0, y:2*root75, angle:0.0, numSides:6},
	{x:1, y:2*root75, angle:0.0, numSides:3},
	{x:1.5, y:3*root75, angle:Math.PI/3, numSides:3}
]
const hexStarGroup = new Board.CellGroup(hexStarInfo,2,4*root75,0.6);

const twelvePointInfo = [
	{x:0, y:0, angle:0.0, numSides:12},
	{
		x: (0.5 * (2+root3)),
		y: (0.5 * (3+2*root3)),
		angle: 0.0,
		numSides: 4
	},
	{
		x: (0.5 * (3+root3)),
		y: (0.5 * (3+root3)),
		angle: Math.PI/3,
		numSides: 3
	},
	// {
	// 	x: (0.5 * (4+root3)),
	// 	y: (0.5 * (3+2*root3)),
	// 	angle: Math.PI/6,
	// 	numSides: 3
	// },
	{x: (0.5 * (2+root3)),
		y: (0.5 * (5+2*root3)),
		angle: 0.0,
		numSides: 3
	},
	{
		x: (0.5 * (2+root3)),
		y: (0.5 * (3+2*root3)),
		angle: Math.PI/2,
		numSides: 3
	},
	{
		x: (-0.5 * root3),
		y: (0.5 * (3+2*root3)),
		angle: Math.PI/6,
		numSides: 3
	}
];
const twelvePointGroup = new Board.CellGroup(twelvePointInfo,2+root3,2+root3,1.5);


const exports = {
	"Squares & Octagons": {
		"groupType":squareAndOctagon,
		"sizes": [[3,3],[3,4],[4,4],[4,6],[5,5]]
	},
	"All Hexagons": {
		"groupType": hexGroup,
		"sizes": [[3,3],[5,5],[6,6],[10,10],[12,15]]
	},
	"All Triangles": {
		"groupType": triGroup,
		"sizes": [[5,5],[10,10],[20,15]]
	},
	"The Six-Pointed Star": {
		"groupType": hexStarGroup,
		"sizes": [[3,4],[3,5],[3,6],[5,7]]
	},
	"The Twelve-Pointed Star": {
		"groupType": twelvePointGroup,
		"sizes": [[3,3],[3,5],[5,7],[5,10]]
	}
};

export default exports;
