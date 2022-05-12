let colors = ["green", "yellow", "black", "red", "blue", "pink"];
let choosenColors = [];
let maxRows = 5;
let currentMaxRows = maxRows;
let blockShuffle = false;
let blockCheck = true;
let currentPositionHandlers = [];
let currentRowPlayingNumber = 1;
let currentPlayerColors = [undefined, undefined, undefined, undefined];

let shuffleButton = document.querySelector("#shuffle");
shuffleButton.addEventListener("click", shuffle);

let checkButton = document.getElementById("check");
checkButton.addEventListener("click", check);

generateGameTable();
updateRowColors();

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

function generateRandomColor() {
	return colors[Math.floor(Math.random() * colors.length)];
}

function shuffle() {
	if (blockShuffle) return;

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
}

function check(e) {
	//e.preventDefault();
	//if (blockCheck) return;

	blockShuffle = true;

	for (let i = 0; i < currentPlayerColors.length; i++) {
		if (currentPlayerColors[i] == undefined) return;
	}

	shuffleButton.className += " disabled";

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

	//console.log("correct", contCorrect, "semi-correct", contSemiCorrect);
	showPins(contCorrect, contSemiCorrect);
	removeListenersCurrentRow();

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
}
