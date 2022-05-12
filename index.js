let colors = ["green", "yellow", "pink", "blue", "red"];
let choosenColors = [];
let currentPlayerColors = [undefined, undefined, undefined, undefined];
let currentRowPlayingNumber = 1;
let maxRows = 5;
let currentMaxRows = maxRows;
let currentPositionHandlers = [];
let blockShuffle = false;
let blockCheck = true;

let finalMessage = document.getElementById("finalMessage");

let shuffleButton = document.querySelector("#shuffle");
shuffleButton.addEventListener("click", shuffle);

let resetButton = document.getElementById("reset");
resetButton.addEventListener("click", handleReset);

let checkButton = document.getElementById("check");
checkButton.addEventListener("click", check);
// window.addEventListener("keyup", function (e) {
// 	if (e.key === "Enter") {
// 		//alert("a");
// 		check(e);
// 	}
// });

let yieldButton = document.getElementById("yield");
yieldButton.addEventListener("click", yield);

let setRowsButton = document.getElementById("setRows");
setRowsButton.addEventListener("click", setRows);

let numRows = document.getElementById("numRows");
numRows.value = maxRows;
numRows.addEventListener("input", setMaxRow);

function generateGameTable() {
	let gameRow = "";
	// console.log("maxrows", maxRows);
	//let maxRows = 4;

	// let gameRows = document.createElement("div");
	// gameRows.className = " card card-body container ";
	let br = document.createElement("br");

	let gameTable = document.getElementById("gameTable");
	//console.log(gameTable);

	for (let i = 1; i < currentMaxRows + 1; i++) {
		let gameRow = document.createElement("div");
		gameRow.className = "row ";
		gameRow.id = `gameRow${i}`;
		gameRow.style = "margin-bottom: 10px;padding-top:15px";

		// console.log("iter ", i);

		let currentgameRowContent = `       
            <div class="col-sm" >
                <div class="ball" id="try1"></div>
            </div>
            <div class="col-sm" >
                <div class="ball" id="try2"></div>
            </div>
            <div class="col-sm" >
                <div class="ball" id="try3"></div>
            </div>
            <div class="col-sm" >
                <div class="ball" id="try4"></div>
            </div>

            <div class="col-sm" id="control${i}" >
                <div id="pins${i}"
                    class="row"
                    style="
                        border: solid 2px black;
                        border-radius: 10px;
                        height: 60px;
                        margin-top: -15px;
                        width: 95px;
                        padding-top: 8px;
                    "
                >                    
                    <div class="col"><div class="check "  id="control1"></div></div>
                    <div class="col" ><div class="check "  id="control2"></div></div>
                    <div class="w-60"></div>
                    <div class="col"><div class="check "  id="control3"></div></div>
                    <div class="col"><div class="check "  id="control4"></div></div>
                </div>
            </div>           
               `;
		//let gameRowContent = document.createTextNode(currentgameRowContent);
		//gameRow.appendChild(gameRowContent);
		gameTable.insertAdjacentElement("beforeend", gameRow);

		document.getElementById(`gameRow${i}`).innerHTML = currentgameRowContent;

		//	console.log(document.getElementById(`gameRow${i}`));
	}
	//console.log(gameTable);
}

function shuffle() {
	if (blockShuffle) return;

	if (choosenColors.length === 0) {
		updateRowColors();
	}

	let positions = document.getElementById("master").children;
	choosenColors = [];
	for (let i = 0; i < positions.length; i++) {
		if (positions[i].id != "buttonShuffle") {
			let colorName = generateRandomColor();
			//positions[i].children[0].className = "ball " + colorName;
			positions[i].children[0].textContent = "?";
			positions[i].children[0].style.textAlign = "center";
			positions[i].children[0].style.fontWeight = "bolder";
			choosenColors.push(colorName);
		}
	}
	console.log(choosenColors);
	blockCheck = false;
}

function generateRandomColor() {
	return colors[Math.floor(Math.random() * colors.length)];
}

function updateRowColors() {
	currentPositionHandlers = [];
	let currentRowPlaying = document.getElementById(
		"gameRow" + currentRowPlayingNumber
	);
	for (let i = 0; i < maxRows; i++) {
		let tr = currentRowPlaying.children[i];
		currentPositionHandlers.push(tr);
	}

	for (let i = 0; i < currentPositionHandlers.length; i++) {
		if (
			currentPositionHandlers[i] != undefined &&
			currentPositionHandlers[i].children[0].className === "ball"
		) {
			currentPositionHandlers[i].children[0].addEventListener(
				"click",
				changeColorBall
			);
			currentPositionHandlers[i].children[0].className += " playable";
		}
	}

	currentRowPlaying.style.backgroundColor = "lightyellow";
}

function changeColorBall(e) {
	//console.log(e.target);
	//e.target.className="ball "+colors[]
	let indexColor = 0;
	let indexPositionInTheRow = 0;
	if (e.target.className !== "ball") {
		let currentColor = e.target.className.replace("ball playable ", "");
		indexColor = colors.indexOf(currentColor);
		//console.log(indexColor, currentColor);
		if (indexColor < colors.length - 1) {
			indexColor++;
		} else {
			indexColor = 0;
		}
	}
	e.target.className = "ball playable " + colors[indexColor];
	indexPositionInTheRow = e.target.id.replace("try", "");
	currentPlayerColors[indexPositionInTheRow - 1] = colors[indexColor];
	//console.log(currentPlayerColors);
}

function check(e) {
	if (blockCheck) return;

	blockShuffle = true;
	for (let i = 0; i < currentPlayerColors.length; i++) {
		if (currentPlayerColors[i] == undefined) return;
	}

	shuffleButton.className += " disabled";

	//control de aciertos
	let contCorrect = 0;
	let contSemiCorrect = 0;

	let indexChecked = {};
	let indexCheckedPlayer = {};

	//to find corrects
	for (let j = 0; j < choosenColors.length; j++) {
		for (let i = 0; i < currentPlayerColors.length; i++) {
			if (choosenColors[j] === currentPlayerColors[i]) {
				if (j === i) {
					contCorrect++;
					indexChecked[j] = true;
					indexCheckedPlayer[j] = true;
					break;
				}
			}
		}
	}

	//console.log(indexChecked);
	//to find semi corrects
	for (let j = 0; j < choosenColors.length; j++) {
		for (let i = 0; i < currentPlayerColors.length; i++) {
			if (
				choosenColors[j] === currentPlayerColors[i] &&
				!indexChecked[j] &&
				!indexCheckedPlayer[i]
			) {
				contSemiCorrect++;

				indexChecked[j] = true;
				indexCheckedPlayer[i] = true;
				break;
			}
		}
	}

	let currentRowPlaying = document.getElementById(
		"gameRow" + currentRowPlayingNumber
	);

	currentRowPlaying.style.backgroundColor = "azure";
	//console.log("correctas", contCorrect, "semicorrectas", contSemiCorrect);
	currentPlayerColors = [undefined, undefined, undefined, undefined];

	removeListenersCurrentRow();
	//assignacion de pins negros/blancos

	//despues de la asignacion de pines si no se ha ganado
	showPins(contCorrect, contSemiCorrect);

	if (contCorrect < 4) {
		if (currentRowPlayingNumber === maxRows) {
			gameOver();
			return;
		}
		currentRowPlayingNumber++;
		updateRowColors();
	} else {
		gameOver(true);
	}
}

function showPins(contCorrect, contSemiCorrect) {
	let currentPins = document.getElementById(
		"pins" + currentRowPlayingNumber
	).children;
	//console.log(currentPins);

	for (let i = 0; i < currentPins.length; i++) {
		if (currentPins[i].className === "col") {
			if (contCorrect > 0) {
				currentPins[i].children[0].className = "check correct";
				contCorrect--;
			} else if (contSemiCorrect > 0) {
				currentPins[i].children[0].className = "check semi-correct";
				contSemiCorrect--;
			}
			//console.log(currentPins[i].children[0]);
		}
	}
}

function removeListenersCurrentRow() {
	for (let i = 0; i < currentPositionHandlers.length; i++) {
		if (currentPositionHandlers[i] != undefined) {
			currentPositionHandlers[i].children[0].removeEventListener(
				"click",
				changeColorBall
			);
			currentPositionHandlers[i].children[0].className =
				currentPositionHandlers[i].children[0].className.replace(
					"playable",
					""
				);
		}
	}
}

function gameOver(win = false) {
	if (win) {
		finalMessage.innerHTML = `<h3>You Win</h3> <h5 style="text-align:center">${currentRowPlayingNumber}/${maxRows}</h5>`;
		finalMessage.style.color = "green";
	} else {
		finalMessage.innerHTML = `<h3>You Lose</h3>`;
		finalMessage.style.color = "red";
	}
	shuffleButton.className += " disabled";
	blockShuffle = true;
	showWinnerColors();
}

function showWinnerColors() {
	let positions = document.getElementById("master").children;
	for (let i = 0; i < positions.length; i++) {
		if (positions[i].id != "buttonShuffle") {
			positions[i].children[0].className = "ball " + choosenColors[i];
			positions[i].children[0].textContent = "";
		}
	}
}

function yield() {
	if (choosenColors.length == 0) return;
	removeListenersCurrentRow();
	gameOver();
	showWinnerColors();
}

function setMaxRow(e) {
	// console.log(e.target.value);
	if (e.target.value > 0) {
		maxRows = parseInt(e.target.value);
	}
}

function setRows() {
	reset();
	if (maxRows > 0) {
		//console.log("entra set rows amb ", maxRows);
		currentMaxRows = maxRows;
		generateGameTable();
	}
	//setRowsButton.className += " disabled";
}

function handleReset() {
	reset();
	generateGameTable();
}

function reset() {
	//location.reload();
	for (let i = 1; i < currentMaxRows + 1; i++) {
		let element = document.getElementById(`gameRow${i}`);
		if (element != undefined) element.remove();
	}
	choosenColors = [];
	currentPlayerColors = [undefined, undefined, undefined, undefined];

	let positions = document.getElementById("master").children;
	for (let i = 0; i < positions.length; i++) {
		if (positions[i].id != "buttonShuffle") {
			positions[i].children[0].className = "ball";
			positions[i].children[0].textContent = "";
		}
	}
	blockShuffle = false;
	blockCheck = true;
	currentRowPlayingNumber = 1;

	//setRowsButton.className = setRowsButton.className.replace("disabled", "");
	shuffleButton.className = shuffleButton.className.replace("disabled", "");
	finalMessage.innerHTML = "";
}

generateGameTable();
