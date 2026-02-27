let cantons = {};
let trains = [];
let aiguillage = false;

document.querySelectorAll(".canton").forEach(c => {
cantons[c.id] = {
id:c.id,
type:c.classList.contains("station") ? "station" :
     c.classList.contains("depot") ? "depot" : "ligne",
occupied:false
};

c.addEventListener("click",()=>{
toggleOccupation(c.id);
});
});

document.getElementById("A1").addEventListener("click",()=>{
aiguillage = !aiguillage;
document.getElementById("A1").classList.toggle("active");
});

function toggleOccupation(id){
cantons[id].occupied = !cantons[id].occupied;
document.getElementById(id).classList.toggle("occupied");
updateInfo();
}

function addTrain(){
for(let id in cantons){
if(!cantons[id].occupied){
cantons[id].occupied = true;
document.getElementById(id).classList.add("occupied");
trains.push({position:id});
break;
}
}
updateInfo();
}

function updateInfo(){
let txt="";
for(let id in cantons){
txt += `${id} (${cantons[id].type}) : ${cantons[id].occupied ? "Occupé" : "Libre"}<br>`;
}
document.getElementById("info").innerHTML = txt;
}

function save(){
let data = {cantons, aiguillage};
let blob = new Blob([JSON.stringify(data)], {type:"application/json"});
let a=document.createElement("a");
a.href=URL.createObjectURL(blob);
a.download="tco_state.json";
a.click();
}

function load(){
document.getElementById("fileInput").click();
}

document.getElementById("fileInput").addEventListener("change",e=>{
let reader=new FileReader();
reader.onload=function(evt){
let data=JSON.parse(evt.target.result);
cantons=data.cantons;
aiguillage=data.aiguillage;
refresh();
};
reader.readAsText(e.target.files[0]);
});

function refresh(){
for(let id in cantons){
let el=document.getElementById(id);
if(cantons[id].occupied){
el.classList.add("occupied");
}else{
el.classList.remove("occupied");
}
}
document.getElementById("A1").classList.toggle("active",aiguillage);
updateInfo();
}

updateInfo();
