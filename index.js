let colors = ["green", "yellow", "black", "red", "blue"];
let choosenColors = [];
let maxRows = 5;
let currentMaxRows = maxRows;
let blockShuffle = false;

let shuffleButton = document.querySelector("#shuffle");
shuffleButton.addEventListener("click", shuffle);

generateGameTable();

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
	blockShuffle = true;
}
