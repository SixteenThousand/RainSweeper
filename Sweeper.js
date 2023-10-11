(()=>{"use strict";const t=["#00ffff","#0000ff","#00ff00","#ff0000","#00ffff","#ffff00","#ff00ff","#ffffff"],e="http://www.w3.org/2000/svg",n=.15,i=new Event("incBombs"),s=new Event("decBombs"),l=new Event("incNumMapped"),a=new Event("decNumMapped");function d(t,e,n,i,s){let l=t,a=e,d="";for(let t=0;t<i;++t)d+=`${l},${a}`,t<i-1&&(d+=" "),l+=s*Math.cos(n+2*t*Math.PI/i),a+=s*Math.sin(n+2*t*Math.PI/i);return d}const r={SVGNS:e,RegularCell:class{constructor(t,n,i,s,l,a){let r=document.createElementNS(e,"polygon"),o=document.createElementNS(e,"polygon");this.cellSide=a*(1-.14*Math.sin(Math.PI/l)),r.setAttribute("points",d(n,i,s,l,a)),o.setAttribute("points",d(n+.07*a*Math.sin(Math.PI/l-s),i+.07*a*Math.cos(Math.PI/l-s),s,l,this.cellSide)),r.setAttribute("fill","transparent"),o.setAttribute("fill","white"),this.boundShape=r,this.cellShape=o,this.boundSide=a,this.numSides=l,this.svgcanvas=t,this.centreX=n+a*Math.sin(Math.PI/l-s)/(2*Math.sin(Math.PI/l)),this.centreY=i+a*Math.cos(Math.PI/l-s)/(2*Math.sin(Math.PI/l)),this.radius=this.cellSide/Math.tan(Math.PI/l),this.createFlag(),this.isBomb=!1,this.numAdjBombs=0,this.isRevealed=!1,this.isFlagged=!1,this.cellShape.addEventListener("click",(t=>{0===t.button&&this.reveal()})),this.cellShape.addEventListener("contextmenu",(t=>{t.preventDefault(),this.toggleFlag()})),t.appendChild(r),t.appendChild(o),t.appendChild(this.flagpole),t.appendChild(this.flag)}createFlag(){let t;this.flag=document.createElementNS(e,"polygon"),t=4==this.numSides?.125*this.cellSide:.25*this.cellSide/Math.tan(Math.PI/this.numSides);let i=this.centreX+.5*t*n,s=this.centreY-.5*t*3;this.flag.setAttribute("points","".concat(`${i},${s} `,`${i},${s+t} `,`${i+Math.sqrt(.75)*t},${s+.5*t}`)),this.flag.setAttribute("fill","transparent"),this.flagpole=document.createElementNS(e,"rect"),this.flagpole.setAttribute("x",(this.centreX-.5*t*n).toString()),this.flagpole.setAttribute("y",(this.centreY-.5*t*3).toString()),this.flagpole.setAttribute("width",(t*n).toString()),this.flagpole.setAttribute("height",(3*t).toString()),this.flagpole.setAttribute("fill","transparent")}setBomb(){this.isBomb=!0}incNumAdjBombs(){++this.numAdjBombs}toggleFlag(){this.isFlagged&&(document.dispatchEvent(i),document.dispatchEvent(a)),this.isFlagged||this.isRevealed?(this.flagpole.setAttribute("fill","transparent"),this.flag.setAttribute("fill","transparent")):(this.flagpole.setAttribute("fill","black"),this.flag.setAttribute("fill","red"),document.dispatchEvent(s),document.dispatchEvent(l)),this.isFlagged=!this.isFlagged}reveal(){if(!this.isFlagged&&!this.isRevealed)if(this.isRevealed=!0,document.dispatchEvent(l),this.isBomb){document.dispatchEvent(s),this.cellShape.setAttribute("opacity","0.2");let t=document.createElementNS(e,"image");t.setAttribute("x",(this.centreX-.5*this.radius).toString()),t.setAttribute("y",(this.centreY-.5*this.radius).toString()),t.setAttribute("width",this.radius.toString()),t.setAttribute("height",this.radius.toString()),t.setAttribute("href","./assets/raincloud.svg"),this.svgcanvas.appendChild(t)}else{let n,i=document.createElementNS(e,"text");n=this.numAdjBombs<t.length?t[this.numAdjBombs]:t[t.length-1],i.setAttribute("fill",n),i.setAttribute("x",this.centreX.toString()),i.setAttribute("y",this.centreY.toString()),i.setAttribute("text-anchor","middle"),i.setAttribute("dominant-baseline","middle"),i.setAttribute("font-size",Math.ceil(.5*this.cellSide).toString()),i.setAttribute("font-family","Helvetica, Arial");let s=document.createTextNode(this.numAdjBombs.toString());i.appendChild(s),this.svgcanvas.appendChild(i)}}}},o=r,h={CellGroup:class{constructor(t,e,n,i){this.cellsInfo=t,this.numCells=t.length,this.dx=e,this.dy=n,this.groupPadding=i}draw(t,e,n,i){let s,l=[];for(let a of this.cellsInfo)s=Math.PI*(.5-1/a.numSides),l[l.length]=new o.RegularCell(t,e+i*a.x,n+i*a.y,a.angle,a.numSides,i);return l}},Board:class{constructor(t,e,n,i,s,l){this.cells=[],this.boundSide=e,this.numCellsInGroup=n.numCells;let a=n.groupPadding*e,d=n.groupPadding*e;for(let l=0;l<i;++l)for(let i=0;i<s;++i)this.cells=this.cells.concat(n.draw(t,a+i*n.dx*e,d+l*n.dy*e,e));this.height=e*(n.dy*i+2*n.groupPadding),this.width=e*(n.dx*s+2*n.groupPadding),this.numBombs=l,document.addEventListener("click",(t=>{let e,n=[],i=[...this.cells.keys()],s=0;for(;s<i.length&&this.cells[s].cellShape!==t.target;)++s;i.splice(s,1);for(let t=0;t<l;++t)e=Math.floor(i.length*Math.random()),n.push(i[e]),i.splice(e,1);for(let t of n){this.cells[t].setBomb();for(let e=0;e<this.cells.length;++e)e!==t&&this.areAdjacent(t,e)&&this.cells[e].incNumAdjBombs()}}),{once:!0,capture:!0})}approxEqual(t,e){let[n,i]=t.split(",").map(parseFloat),[s,l]=e.split(",").map(parseFloat);return(n-s)**2+(i-l)**2<.4*this.boundSide}areAdjacent(t,e){if(this.cells[t]===this.cells[e])return!1;let n=this.numCols*this.numCellsInGroup,i=Math.trunc(t/n),s=Math.trunc(e/n),l=Math.trunc(t%n/this.numCellsInGroup),a=Math.trunc(e%n/this.numCellsInGroup);if(Math.abs(i-s)>1||Math.abs(l-a)>1)return!1;let d=this.cells[t].boundShape.getAttribute("points").split(" "),r=this.cells[e].boundShape.getAttribute("points").split(" ");for(let t=0;t<d.length;++t)for(let e=0;e<r.length;++e)if(this.approxEqual(d[t],r[e]))return!0;return!1}isWon(){for(let t of this.cells)if(!t.isRevealed&&!t.isBomb)return!1;return!0}}},u=h,c=Math.sqrt(2),g=Math.sqrt(3),m=Math.sqrt(.75),p=[{x:0,y:0,angle:0,numSides:8},{x:1+.5*c,y:.5*c,angle:0,numSides:4},{x:0,y:1+c,angle:0,numSides:4},{x:1+.5*c,y:1+.5*c,angle:0,numSides:8}],f=new u.CellGroup(p,2+c,2+c,1),S=[{x:0,y:0,angle:0,numSides:6},{x:1.5,y:m,angle:0,numSides:6}],b=new u.CellGroup(S,3,2*m,.8),M=[{x:0,y:0,angle:0,numSides:3},{x:.5,y:m,angle:-Math.PI/3,numSides:3},{x:.5,y:m,angle:0,numSides:3},{x:.5,y:m,angle:Math.PI/3,numSides:3}],v=new u.CellGroup(M,1,2*m,.6),y=[{x:0,y:0,angle:0,numSides:3},{x:1,y:0,angle:0,numSides:6},{x:.5,y:m,angle:Math.PI/3,numSides:3},{x:0,y:2*m,angle:0,numSides:6},{x:1,y:2*m,angle:0,numSides:3},{x:1.5,y:3*m,angle:Math.PI/3,numSides:3}],A=new u.CellGroup(y,2,4*m,.6),x=[{x:0,y:0,angle:0,numSides:12},{x:.5*(2+g),y:.5*(3+2*g),angle:0,numSides:4},{x:.5*(3+g),y:.5*(3+g),angle:Math.PI/3,numSides:3},{x:.5*(2+g),y:.5*(5+2*g),angle:0,numSides:3},{x:.5*(2+g),y:.5*(3+2*g),angle:Math.PI/2,numSides:3},{x:-.5*g,y:.5*(3+2*g),angle:Math.PI/6,numSides:3}],E={"Squares & Octagons":{groupType:f,sizes:[[3,3],[3,4],[4,4],[4,6],[5,5]]},"All Hexagons":{groupType:b,sizes:[[3,3],[5,5],[6,6],[10,10],[12,15]]},"All Triangles":{groupType:v,sizes:[[5,5],[10,10],[20,15]]},"The Six-Pointed Star":{groupType:A,sizes:[[3,4],[3,5],[3,6],[5,7]]},"The Twelve-Pointed Star":{groupType:new u.CellGroup(x,2+g,2+g,1.5),sizes:[[3,3],[3,5],[5,7],[5,10]]}};let I,B=0;function C(){let t=Math.trunc(B/I*100);return"Percentage Mapped: ".concat(t.toString().padStart(2,"0"),"%")}let w=document.createTextNode(C());document.getElementById("pcMapped-state").appendChild(w),document.addEventListener("incNumMapped",(t=>{++B,w.nodeValue=C(),q.isWon()&&alert("You Win!\nYou can start a new game using the menu above")})),document.addEventListener("decNumMapped",(t=>{--B,w.nodeValue=C()}));let P=0;function N(){let t=Math.abs(P).toString();return"Number of rainclouds left: ".concat(P<0?"-":"",t.padStart(3,"0"))}let T=document.createTextNode(N());document.getElementById("numBombs-state").appendChild(T),document.addEventListener("incBombs",(t=>{++P,T.nodeValue=N()})),document.addEventListener("decBombs",(t=>{--P,T.nodeValue=N()}));const G=document.getElementById("Mode-Selector");let F,V;for(const t in E)F=document.createElement("option"),V=document.createTextNode(t),F.appendChild(V),G.appendChild(F);const j=document.getElementById("size-Selector");G.addEventListener("change",(function(t){for(;j.children.length>0;)j.children[0].remove();let e,n,i;for(const t of E[G.value].sizes)e=document.createElement("option"),i=t[0]*t[1]*E[G.value].groupType.numCells,n=document.createTextNode(`${i} clouds`),e.setAttribute("value",t),e.appendChild(n),j.appendChild(e)}));const L=document.getElementById("numBombs-Selector");let $,q;L.setAttribute("value","9"),document.getElementById("New-Game").addEventListener("click",(t=>{void 0!==$&&$.remove(),$=document.createElementNS(o.SVGNS,"svg");const e=j.value.split(",").map((t=>parseInt(t)));q=new u.Board($,40,E[G.value].groupType,e[0],e[1],parseInt(L.value)),P=parseInt(L.value),T.nodeValue=N(),I=q.cells.length,B=0,w.nodeValue=C(),$.setAttribute("height",q.height.toString()),$.setAttribute("width",q.width.toString()),document.getElementById("game-container").appendChild($)})),$=document.createElementNS(o.SVGNS,"svg"),q=new u.Board($,40,E["Squares & Octagons"].groupType,4,6,16),P=16,T.nodeValue=N(),I=q.cells.length,w.nodeValue=C(),$.setAttribute("height",q.height.toString()),$.setAttribute("width",q.width.toString()),document.getElementById("game-container").appendChild($)})();