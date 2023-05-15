// variables 
var gameOver = false; 
var height = 4; 
var width = 4; 
var row = 0; 
var col = 0;
var word;
var wordHint;
var numWords;
var dict;
var words;

// getting random word from dictionary and hint
const apiKey = "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv";
const apiURL = "https://api.masoudkf.com/v1/wordle";

function squares() {
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            const gameBoard = document.getElementById("board");
            let square = document.createElement("span");
            square.classList.add("square");
            square.innerText = "";
            square.id = r.toString() + "." + c.toString();
            gameBoard.appendChild(square);
        }
    }
    document.getElementById("start-button").disabled = false;
    document.getElementById("start-button").innerText = "Start Over";
}

function key() {
    document.addEventListener('keyup' , (e) => {
        console.log("column", col);
        console.log("row", row);
        if (gameOver) return; 
        if ("KeyA" <= e.code && e.code <= "KeyZ") {
            let currKey = document.getElementById("display-key");
            currKey.innerText = e.code[3];
            if (col < width) {
                let currSquare = document.getElementById(row.toString() + "." + col.toString());
                if (currSquare.innerText == "") {
                    currSquare.innerText = e.code[3];
                    col++;
                }
            }
        }
        else if (e.code == "Enter") {
            let currKey = document.getElementById("display-key");
            currKey.innerText = "↵";
            if (col < width){
                window.alert("Please complete the word");
            }
            else {
                update();
                row += 1;
                col = 0;
            }
        }
        else if (e.code == "Backspace") {
            let currKey = document.getElementById("display-key");
            currKey.innerText = "⌫";
            if (0 < col && col <= width) {
                col--;
            }
            let currSquare = document.getElementById(row.toString() + "." + col.toString());
            currSquare.innerText = "";
        } 
        if (!gameOver && row == height) {
            gameOver = true;
        }

    })
}
key();

window.onload = function(){
    document.getElementById("start-button").disabled = true;
    document.getElementById("start-button").innerText = "Loading...";
    fetch (apiURL, {
        headers: {
            "x-api-key": apiKey,
        },
    })
    
    .then((response) => {
        if (response.ok) {
            return response.json();
        }
        else{
            throw new Error("Request failed, status: " + response.status);
        }
    })
    
    .then((data) => {
        console.log("Data:", data);
        dict = data.dictionary;
        console.log("Dictionary", dict);
        words = Object.keys(dict);
        console.log("numWords:", words);
        numWords = words.length; 
    
        console.log("numberofwords", numWords); 
    
        const random = Math.floor(Math.random() * numWords);
        word = dict[random].word.toUpperCase(); 
        wordHint = dict[random].hint; 
    
        console.log("word", word); 
        console.log("hint", wordHint); 
    })
    squares();
}

//--------

// blur buttons after click
function blur1(){
    document.getElementById("button1").blur();
}

function blur2(){
    document.getElementById("button2").blur();
}

function blur3(){
    document.getElementById("button3").blur();
}

function blurStartOver() {
    document.getElementById("start-button").blur();
}

// dark mode button functions 
function darkMode() {
    var element = document.body;
    element.classList.toggle("dark-mode");
 }

function buttonCol() {
    document.getElementById("button1").classList.toggle("dark-mode");
    document.getElementById("button2").classList.toggle("dark-mode");
    document.getElementById("button3").classList.toggle("dark-mode");
 }

 // hint button functions 
 function giveHint() {
    let currHint = document.getElementById("hint-block");
    currHint.style.backgroundColor = 'wheat'; 
    currHint.innerText = "Hint: " + wordHint;
 }

// info page functions 
function info() {
    startOver();
    const infoblock = document.getElementById("info");
    const displayKey = document.getElementById("display-key");
    if (infoblock.style.display == "none") {
        infoblock.style.display = "block";
        displayKey.style.display = "none";
        const mainBlock = document.getElementById("main");
        mainBlock.style.marginLeft = "200px";
        mainBlock.style.marginTop = "50px";
        mainBlock.style.width = "500px"
        const start = document.getElementById("start-block");
        start.style.width = "500px"
        start.style.marginLeft = "200px";
        const hintBlock = document.getElementById("hint-block");
        hintBlock.style.marginTop = "153px";
    }
    else {
        infoblock.style.display = "none";
        displayKey.style.display = "block";
        const mainBlock = document.getElementById("main");
        mainBlock.style.margin = "0 auto";
        mainBlock.style.width = "650px";
        const start = document.getElementById("start-block");
        start.style.width = "650px"
        start.style.margin = "0 auto";
        const hintBlock = document.getElementById("hint-block");
        hintBlock.style.marginTop = "60px";
    }
}

//---------

// win game message
function wonGameMessage() {
    let currHint = document.getElementById("hint-block");
    currHint.style.backgroundColor = 'palegreen'; 
    currHint.innerText = "You guessed the word " + word + " correctly!";
 }

// lost game message
function lostGameMessage() {
    let currHint = document.getElementById("hint-block");
    currHint.style.backgroundColor = 'red'; 
    currHint.innerText = "You did not get the word " + word + " correct.";
 }

// game code 
function update() {
    let correct = 0;
    for (let c = 0; c < width; c++) {
        let currSquare = document.getElementById(row.toString() + '.' + c.toString());
        let letter = currSquare.innerText;

        //Is it in the correct position?
        if (word[c] == letter) {
            currSquare.classList.add("correct");
            correct += 1;
        } // Is it in the word?
        else if (word.includes(letter)) {
            currSquare.classList.add("exist");
        } // Not in the word
        else {
            currSquare.classList.add("wrong");
        }

        if (correct == width) {
            gameOver = true;
            wonGameMessage(); 
            const image = document.getElementById("image-block");
            image.style.display = "block";
            const gameBoard = document.getElementById("board");
            gameBoard.style.display = "none";
        }

        if (gameOver == false && row == 3){
            lostGameMessage();
        }
    }
}

function disableGif(){
    const image = document.getElementById("image-block");
    image.style.display = "none";
}

function randomize() {
    const random = Math.floor(Math.random() * numWords);
    word = dict[random].word.toUpperCase(); 
    wordHint = dict[random].hint; 
}

function reset(){
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            let currSquare = document.getElementById(r.toString() + "." + c.toString());
            currSquare.innerText = "";
            currSquare.classList.remove("correct"); 
            currSquare.classList.remove("exist"); 
            currSquare.classList.remove("wrong"); 
        }
    }

    let currHint = document.getElementById("hint-block");
    currHint.style.backgroundColor = ''; 
    currHint.innerText = "";

    let currKey = document.getElementById("display-key");
    currKey.innerText = "";
}

function startOver() {

    disableGif();

    reset();
    const gameBoard = document.getElementById("board");
    gameBoard.style.display = "grid";
    gameBoard.innerHTML = "";
    randomize();
    squares();

    console.log("word", word); 
    console.log("hint", wordHint); 

    gameOver = false;
    row = 0;
    col = 0;

}