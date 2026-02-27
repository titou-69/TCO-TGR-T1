let cantons = [
{occupied:false, incident:false},
{occupied:false, incident:false},
{occupied:false, incident:false},
{occupied:false, incident:false}
];

let train = {
canton:0,
progress:0
};

let running = true;

function updateSignals(){
for(let i=0;i<cantons.length;i++){
let signal = document.getElementById("s"+i);

if(i === cantons.length-1){
signal.setAttribute("fill","green");
continue;
}

if(cantons[i+1].occupied || cantons[i+1].incident){
signal.setAttribute("fill","red");
}else{
signal.setAttribute("fill","green");
}
}
}

function updateDisplay(){

cantons.forEach((c,i)=>{
let rect = document.getElementById("c"+i);

if(c.incident){
rect.setAttribute("fill","#800");
}
else if(c.occupied){
rect.setAttribute("fill","#0a0");
}
else{
rect.setAttribute("fill","#444");
}
});

let panel = document.getElementById("statusPanel");
panel.innerHTML = "";

cantons.forEach((c,i)=>{
panel.innerHTML += `
<p>Canton ${i} :
${c.occupied ? "🚆 Occupé" : "Libre"}
${c.incident ? " ⚠️ Incident" : ""}
</p>`;
});
}

function moveTrain(){

if(!running) return;

let current = train.canton;

if(train.progress >= 1){

if(current < cantons.length-1 &&
!cantons[current+1].occupied &&
!cantons[current+1].incident){

cantons[current].occupied = false;
train.canton++;
cantons[train.canton].occupied = true;
train.progress = 0;

}
}else{
train.progress += 0.01;
}

let x = 120 + train.canton*200 + train.progress*200;
document.getElementById("train").setAttribute("x",x);

updateSignals();
updateDisplay();
}

function loop(){
moveTrain();
requestAnimationFrame(loop);
}

function toggleSimulation(){
running = !running;
}

function addIncident(){
let i = Math.floor(Math.random()*cantons.length);
cantons[i].incident = true;
}

function saveState(){
let data = JSON.stringify(cantons);
let blob = new Blob([data], {type:"application/json"});
let a = document.createElement("a");
a.href = URL.createObjectURL(blob);
a.download = "etat_reseau.json";
a.click();
}

cantons[0].occupied = true;

loop();
