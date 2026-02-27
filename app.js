let mode = "edit";

let Network = {
nodes: [],
edges: [],
stations: [],
routes: []
};

let trains = [];

const svg = document.getElementById("canvas");
svg.setAttribute("width", window.innerWidth * 0.75);
svg.setAttribute("height", window.innerHeight * 0.9);

function setMode(m){
mode = m;
}

svg.addEventListener("click", e => {
if(mode !== "edit") return;

let rect = svg.getBoundingClientRect();
let x = e.clientX - rect.left;
let y = e.clientY - rect.top;

createNode(x,y);
});

function createNode(x,y){
let id = "N"+Network.nodes.length;
Network.nodes.push({id,x,y});
draw();
}

function draw(){

svg.innerHTML="";

Network.edges.forEach(e=>{
let n1 = Network.nodes.find(n=>n.id===e.from);
let n2 = Network.nodes.find(n=>n.id===e.to);

let line = document.createElementNS("http://www.w3.org/2000/svg","line");
line.setAttribute("x1",n1.x);
line.setAttribute("y1",n1.y);
line.setAttribute("x2",n2.x);
line.setAttribute("y2",n2.y);
line.setAttribute("class","edge");
if(e.occupied) line.classList.add("occupied");
svg.appendChild(line);
});

Network.nodes.forEach(n=>{
let c = document.createElementNS("http://www.w3.org/2000/svg","circle");
c.setAttribute("cx",n.x);
c.setAttribute("cy",n.y);
c.setAttribute("r",5);
c.setAttribute("class","node");
svg.appendChild(c);
});

trains.forEach(t=>{
let edge = Network.edges[t.positionEdgeIndex];
if(!edge) return;

let n1 = Network.nodes.find(n=>n.id===edge.from);
let n2 = Network.nodes.find(n=>n.id===edge.to);

let x = n1.x + (n2.x - n1.x) * t.progress;
let y = n1.y + (n2.y - n1.y) * t.progress;

let r = document.createElementNS("http://www.w3.org/2000/svg","circle");
r.setAttribute("cx",x);
r.setAttribute("cy",y);
r.setAttribute("r",6);
r.setAttribute("class","train");
svg.appendChild(r);
});
}

function addEdge(n1,n2){
let id="E"+Network.edges.length;
Network.edges.push({id,from:n1,to:n2,occupied:false});
draw();
}

function addTrain(routeId){
let route = Network.routes.find(r=>r.id===routeId);
if(!route) return;

trains.push({
route:routeId,
positionEdgeIndex:0,
progress:0,
delay:0
});
}

function simulationLoop(){

if(mode==="run"){

trains.forEach(t=>{
let route = Network.routes.find(r=>r.id===t.route);
let edgeId = route.edges[t.positionEdgeIndex];
let edge = Network.edges.find(e=>e.id===edgeId);

if(!edge) return;

if(!edge.occupied){
edge.occupied=true;
t.progress += 0.002;

if(t.progress>=1){
edge.occupied=false;
t.progress=0;
t.positionEdgeIndex++;
}
}
});
}

draw();
requestAnimationFrame(simulationLoop);
}

simulationLoop();

function saveProject(){
let data = {Network,trains};
let blob = new Blob([JSON.stringify(data)], {type:"application/json"});
let a=document.createElement("a");
a.href=URL.createObjectURL(blob);
a.download="pcc_project.json";
a.click();
}

function loadProject(){
document.getElementById("fileLoader").click();
}

document.getElementById("fileLoader").addEventListener("change",e=>{
let reader=new FileReader();
reader.onload=function(evt){
let data=JSON.parse(evt.target.result);
Network=data.Network;
trains=data.trains;
draw();
};
reader.readAsText(e.target.files[0]);
});
