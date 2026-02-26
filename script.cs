let train = document.getElementById("train1");
let positionDisplay = document.getElementById("position");
let speedDisplay = document.getElementById("speed");
let statusDisplay = document.getElementById("status");

let position = 120;
let speed = 120;
let running = true;
let signalState = true;

function moveTrain() {

    if (running) {
        position += 1;
        train.setAttribute("x", position);

        let km = ((position - 100) / 1000 * 100).toFixed(1);
        positionDisplay.innerText = km;

        if (position > 1050) {
            position = 120;
        }
    }

    requestAnimationFrame(moveTrain);
}

function toggleTrain() {
    running = !running;
    statusDisplay.innerText = running ? "En circulation" : "À l'arrêt";
}

function toggleSignals() {

    signalState = !signalState;

    document.getElementById("signal1").setAttribute("fill", signalState ? "green" : "red");
    document.getElementById("signal2").setAttribute("fill", signalState ? "green" : "red");
    document.getElementById("signal3").setAttribute("fill", signalState ? "green" : "red");
}

moveTrain();
