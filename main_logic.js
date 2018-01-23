'use strict';

var words = [];
var wordsDirections = [];
var sharedChars = [];
var matrix = {
	width: 0,
	height: 0
};
var wordChars = [];
var checkedWords = [];
var updatedChars = [];
var crossWords = [];

function SharedChar(name, posX, posY, indexX, indexY, words) {
	this.name = name;
	this.posX = posX;
	this.posY = posY;
	this.indexX = indexX;
	this.indexY = indexY;
	this.words = words;
}

function WordChar(name, posX, posY, word) {
	this.name = name;
	this.posX = posX;
	this.posY = posY;
	this.word = word;
}

function getSharedChar(word1, word2) {
	var name;
	var posX = 0;
	var posY = 0;
	var lastPosX = sharedChars.length > 1 ? sharedChars[sharedChars.length - 1].posX : 0;
	var lastPosY = sharedChars.length > 1 ? sharedChars[sharedChars.length - 1].posY : 0;
	var indexX;
	var indexY;
	var haveSharedChar = false;

	for (var x = 0; x < word1.length; x++) {

		for (var y = 0; y < word2.length; y++) {
			
			if(word1.charAt(x) === word2.charAt(y)) {

				name = word1.charAt(x);
				posX = getDirection(word1) === 'hor' ? lastPosY : y;
				posY = getDirection(word2) === 'ver' ? lastPosY : x;
				indexX = getDirection(word1) === 'hor' ? x : y;
				indexY = getDirection(word2) === 'ver' ? y : x;
				posX = indexX > posX ? indexX : posX;
				posY = indexY > posY ? indexY : posY;
				haveSharedChar = true;
			}
		}
	}

	if(haveSharedChar) {
		sharedChars.push(new SharedChar(name, posX, posY, indexX, indexY, [word1, word2]));
	}
}

function updateMatrixParams(w = null, h = null) {
	if(w !== null && matrix.width < w) {
		matrix.width = w;
	}

	if(h !== null && matrix.height < h) {
		matrix.height = h;
	}
}

function updateCharsPositions(diffX, diffY, crossWords) {
	for (var i = 0; i < crossWords.length; i++) {
		
		for (var j = 0; j < crossWords[i].length; j++) {
			
			for (var c = 0; c < wordChars.length; c++) {
				
				if(wordChars[c].word === crossWords[i] && updatedChars.indexOf(wordChars[c]) === -1) {

					wordChars[c].posX += diffX;
					wordChars[c].posY += diffY;

					updatedChars.push(wordChars[c]);

					if(wordChars[c].word[0] === wordChars[c].name) {

						var endingPosX = wordChars[c].posX + wordChars[c].word.length;
						var endingPosY = wordChars[c].posY + wordChars[c].word.length;

						if(getDirection(wordChars[c].word) === 'hor') {
							updateMatrixParams(endingPosX, 0);
						} else {
							updateMatrixParams(0, endingPosY);
						}
					}
				}
			}
		}
	}
}

function wordToChars(word) {
	var direction = getDirection(word);
	var sharedChar;
	var len = word.length - 1;
	var diff;
	var startingIndex = 0;
	var endingIndex = 0;
	var indexOfCrossWord;
	var crossWord;
	var pos;
	var changingIndex;
	var sameIndex;
	var diffX = 0;
	var diffY = 0;

	for (var i = 0; i < sharedChars.length; i++) {

		if(sharedChars[i].words.indexOf(word) !== -1) {

			sharedChar = sharedChars[i];
		}
	}

	indexOfCrossWord = sharedChar.words.indexOf(word);
	crossWord = indexOfCrossWord === 0 ? sharedChar.words[1] : sharedChar.words[0];

	for (var i = 0; i < sharedChars.length; i++) {
	 	
	 	if(sharedChars[i].words.indexOf(crossWord) !== -1) {

			var tempIndex = sharedChars[i].words.indexOf(crossWord);
			var tempWord = tempIndex === 0 ? sharedChars[i].words[1] : sharedChars[i].words[0];

			if(tempWord !== word) {

				crossWords.push(tempWord);
				diffX = sharedChar.posX - sharedChars[i].posX;
				diffY = sharedChar.posY - sharedChars[i].posY;
			}
		}
	}

	pos = direction === 'hor' ? sharedChar.posX : sharedChar.posY;
	changingIndex = direction === 'hor' ? sharedChar.indexX : sharedChar.indexY;
	sameIndex = direction === 'hor' ? sharedChar.posY : sharedChar.posX;

	diff = len - changingIndex;
	endingIndex = pos + diff;
	startingIndex = endingIndex - len;

	for (var i = 0; i < word.length; i++) {

		if(direction === 'hor') {
			wordChars.push(new WordChar(word[i], startingIndex++, sameIndex, word));
		} else {
			wordChars.push(new WordChar(word[i], sameIndex, startingIndex++, word));
		}
	}

	if(direction === 'hor') {
		updateMatrixParams(endingIndex + 1, null);

		if(diffX !== 0) {
			updateCharsPositions(diffX, 0, crossWords);
		}
	} else {
		updateMatrixParams(null, endingIndex + 1);

		if(diffY !== 0) {
			updateCharsPositions(0, diffY, crossWords);
		}
	}
}

function getAllSharedChars() {
	for (var i = 0; i < words.length; i++) {
		
		for (var j = i + 1; j < words.length; j++) {
			
			if(words[i] !== words[j] && checkedWords.indexOf(words[i]) === -1) {
				
				getSharedChar(words[i], words[j]);
				checkedWords.push(words[i]);
			}
		}

		wordToChars(words[i]);
	}
}

function getDirection(word) {
	var lastIndex = wordsDirections.length - 1;
	var lastDirection = wordsDirections[lastIndex].direction;
	var newDirection = lastDirection === 'hor' ? 'ver' : 'hor';

	for (var i = 0; i < wordsDirections.length; i++) {
		
		if(wordsDirections[i].name === word) {

			return wordsDirections[i].direction;
		}
	}

	wordsDirections.push({name: word, direction: newDirection});

	return newDirection;
}

console.log(sharedChars);
console.log(matrix);
console.log(wordChars);

function renderCrossword() {
	var htmlStr = '';
	var isWithChar;
	var name;
	htmlStr += '<table><tbody>';

	for (var row = 0; row < matrix.height; row++) {
		htmlStr += '<tr>';

		for (var col = 0; col < matrix.width; col++) {

			isWithChar = false;
			
			for (var i = 0; i < wordChars.length; i++) {
				
				if(wordChars[i].posX === col && wordChars[i].posY === row) {

					isWithChar = true;
					name = wordChars[i].name;
				}	
			}

			if(isWithChar) {
				htmlStr += '<td class="text"><input type="text" class="character" maxlength="1" size="1" placeholder="'
				+ name + '"/><td/>';
			} else {
				htmlStr += '<td class="empty"><td/>';
			}
		}

		htmlStr += '<tr/>';
	}

	htmlStr += '<tbody/><table/>';

	var elem = document.getElementById('crossword-container');
	elem.innerHTML = htmlStr;
	document.getElementById('btn-show-words').disabled = false;
}

var btnGenerate = document.getElementById('btn-generate');
var btnShowWords = document.getElementById('btn-show-words');

btnGenerate.onclick = function () {
	init();
	document.getElementById('crossword-container').innerHTML = "";
	var wordsString = document.getElementById('words').value;

	if(wordsString === '') {
		return false;
	}

	words = wordsString.split(" ");
	words = words.filter(function(n) { 
		return n != undefined 
	});
	wordsDirections = [
		{name: words[0], direction: 'hor'}
	];

	getAllSharedChars();
	renderCrossword();

	document.getElementById('words').value = '';
};

btnShowWords.onclick = function () {
	var chars = document.getElementsByClassName('character');

	if(chars[0].classList.contains('show-words')) {

		for (var i = 0; i < chars.length; i++) {
			
			chars[i].classList.remove('show-words')
		}
	} else {

		for (var i = 0; i < chars.length; i++) {
			
			chars[i].classList.add('show-words')
		}
	}
};

function init() {
	words = [];
	wordsDirections = [];
	sharedChars = [];
	matrix = {
		width: 0,
		height: 0
	};
	wordChars = [];
	checkedWords = [];
	updatedChars = [];
	crossWords = [];
}