var playerId = 0;
var winner = 1;
var baseBrackets = [32,16,8,4,2]; // brackets with "perfect" proportions (full fields, no byes)

// Actions

document.getElementById("playerName").addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        document.getElementById("addPlayerButton").click();
    }
});

function addPlayer() {

	var ul = document.getElementById("playerList");
	var label = document.getElementById("playerName");
	var name = label.value;

	if (name == "") {
		return;
	}

	if (ul.getElementsByTagName("li").length >= 32) {
		alert("Max 32 Players")
		return;
	}

	var li = document.createElement("li");
	li.classList.add("list-group-item");

	// create label
	li.appendChild(document.createTextNode(name));
	li.setAttribute("id", "playerUID" + playerId);

	// create button
	var button = document.createElement("button");
	button.innerHTML = "✕";
	button.setAttribute("type", "button");
	button.setAttribute("onclick", "removePlayer(this.parentNode.id)");
	button.classList.add("btn");
	button.classList.add("btn-danger");
	button.classList.add("pull-right");
	button.classList.add("btn-xs");

	li.appendChild(button);
	ul.appendChild(li);

	label.value = "";
	playerId++;
	updateCount();
}

function removePlayer(id) {
	var ul = document.getElementById("playerList");
	li = document.getElementById(id);
	ul.removeChild(li);
	updateCount();
}

function playerAdvance(id) {

	var winnerId = id;
	var loserId = findLoserId(id);
	var nextBracketId = findNextBracketId(id);

	var winner = document.getElementById(winnerId);
	var loser = document.getElementById(loserId);
	var nextBracket = document.getElementById(nextBracketId);

	var winnerName = winner.innerHTML;

	if (winner.hasAttribute("onclick") && loser.hasAttribute("onclick")) {
		winner.classList.remove("btn-default");
		winner.classList.add("btn-success");
		winner.removeAttribute("onclick");

		loser.classList.remove("btn-default");
		loser.classList.add("btn-danger");
		loser.removeAttribute("onclick");

		if (nextBracket.classList.contains("winner")) {
			nextBracket.classList.remove("btn-default");
			nextBracket.classList.add("btn-success");
			nextBracket.innerHTML = "♛ " + winnerName;
		} else {
			nextBracket.setAttribute("onclick", "playerAdvance(this.id)");
			nextBracket.innerHTML = winnerName;
		}
	}

}

function generateBracket() {

	var length = document.getElementById("playerList").getElementsByTagName("li").length;

	if (length < 2) {
		alert("Need more players");
		return;
	}

	var status = confirm("Generate Bracket?");
	if (status) {
		document.getElementById("generate").style.display = "none";
		getBracket(length);
	}
}

// Brackets functions

function getBracket(count) {

	// Get participants
	var participants = getParticipants();

	// Get Bracket size
	var closest = getClosest(count);

	var byeCount = closest - count;
	var byeOffset = 0;
	if (byeCount > 0)	{
		byeOffset = 1;
	}

	var pairs = [];
	var byes = [];
	var totalRounds = Math.log2(closest);
	var teamCount = 0;

	for ( i = 0; i < totalRounds; i++) {
		pairs.push({
			teamA: participants[teamCount],
			teamB: participants[teamCount+1]
		})
		teamCount += 2;
	}

	for ( i =0; i < byeCount; i++) {
		byes.push({
			team:participants[teamCount]
		})
		teamCount++;
	}

	drawBracket(participants, pairs, byes, closest)
}

function drawBracket(players, pairs, byes, seeds) {

	var totalRounds = Math.log2(seeds);
	var roundMatches = seeds/2;
	var playerCount = players.length - 1;
	var pairCount = pairs.length - 1;
	var byeCount = byes.length;
	var brackets = document.getElementById("brackets");
	var rounds = totalRounds + 1;
	var roundId = "roundId" + rounds;

	var layout = document.createElement("div");
	layout.classList.add(roundId);
	brackets.appendChild(layout);
	var i;
	var bracketCounts = Math.max(seeds/2, 1);

	var bracketId = 1;
	var prevBracketColumnId = 1;

	for (i=1; i <= totalRounds; i++) {

		bracketId = Math.pow(10, i) + prevBracketColumnId;
		prevBracketColumnId = bracketId;

		var columnId = "columnId"+i;

		var column = document.createElement("div");
		column.classList.add(columnId);
		layout.appendChild(column);

		// add the bracket itself now
		for (j = 0; j < bracketCounts; j++) {
			var bracketLayout = document.createElement("div");
			column.appendChild(bracketLayout);

			if (byeCount <= 0) {
				var bracketBox = document.createElement("div");
				bracketBox.classList.add("bracketbox");
				bracketLayout.appendChild(bracketBox);

				var buttonLayout = document.createElement("span");
				buttonLayout.classList.add("buttonLayout");
				bracketBox.appendChild(buttonLayout);

				var player1 = document.createElement("button");
				player1.setAttribute("id", bracketId);
				bracketId = bracketId + Math.pow(2, i-1);
				player1.classList.add("player1");
				player1.classList.add("btn");
				player1.classList.add("btn-default");
									// player1.setAttribute("onclick", "playerAdvance(this.id)");
				if(playerCount >= 0) {
					player1.setAttribute("onclick", "playerAdvance(this.id)");
					player1.classList.add("leftBracket");
					player1.innerHTML = players[playerCount];
					playerCount--;
				} else {
					player1.innerHTML = "??????";
				}
				buttonLayout.appendChild(player1);
				
				//middle margin
				var spacing = document.createElement("div");
				spacing.classList.add("buttonSpace");
				buttonLayout.appendChild(spacing);

				var player2 = document.createElement("button");
				player2.setAttribute("id", bracketId);
				bracketId = bracketId + Math.pow(2, i-1);
				player2.classList.add("player2");
				player2.classList.add("btn");
				player2.classList.add("btn-default");
									// player2.setAttribute("onclick", "playerAdvance(this.id)");
				if(playerCount >= 0) {
					player2.setAttribute("onclick", "playerAdvance(this.id)");
					player2.classList.add("leftBracket");
					player2.innerHTML = players[playerCount];
					playerCount--;
				} else {
					player2.innerHTML = "??????";
				}					
				buttonLayout.appendChild(player2);
				
			} else {
				byeCount--;
				bracketId+=2;
			}
		}
		bracketCounts = Math.max(bracketCounts/2, 1);
	}
	var columnId = "columnId"+i;
	var column = document.createElement("div");
	column.classList.add(columnId);
	layout.appendChild(column);
	
	var bracketLayout = document.createElement("div");
	bracketLayout.classList.add("final");
	column.appendChild(bracketLayout);

	var bracketBox = document.createElement("div");
	bracketBox.classList.add("bracketbox");
	bracketLayout.appendChild(bracketBox);

	bracketId = Math.pow(10, i) + prevBracketColumnId;
	prevBracketId = bracketId;

	var winner = document.createElement("button");
	winner.setAttribute("id", bracketId);
	winner.classList.add("winner");
	winner.classList.add("btn");
	winner.classList.add("btn-default");
	winner.classList.add("btn-lg")
	winner.innerHTML = "♛ ??????";
	bracketBox.appendChild(winner);
}

// Helper functions

function getParticipants() {
	// Get participants
	var participants = [];
	var ul = document.getElementsByTagName("li");
	for(var i=0; i <ul.length; i++) {
  		participants.push(ul[i].firstChild.nodeValue);
  	}
  	// shuffle participants
	var currentIndex = participants.length, temporaryValue, randomIndex;

	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = participants[currentIndex];
		participants[currentIndex] = participants[randomIndex];
		participants[randomIndex] = temporaryValue;
	}

	return participants;
}

function findNextBracketId(id) {

	var idLength = id.length;
	id = parseInt(id);

	var base = "1"; 
	for (i = 1; i < idLength; i++) {
		base = base + "1"; // base is 1111,,,,
	}
	var distance = Math.pow(2,idLength-2); // 2, 4, 8, 16,,,,
	
	base = id - parseInt(base); // 2 4 6 8 10 12 14 16,,,

	if ((base%(distance*2)) == 0) { // eg : 4/8 8/8 12/8 16/8
		return Math.pow(10, idLength) + id; // if the id is in the top of bracket
	} else {
		return Math.pow(10, idLength) + id - distance; // if the id is in the bottom of bracket
	}
}

function findLoserId(id) {

	var base = "1"; 
	for (i = 1; i < id.length; i++) {
		base = base + "1"; // base is 1111,,,,
	}
	var distance = Math.pow(2,id.length-2); // 2 4 8 16,,,,
	
	id = parseInt(id);
	base = id - parseInt(base); // 2 4 6 8 10 12 14 16,,,

	if ((base%(distance*2)) == 0) { // eg : 4/8 8/8 12/8 16/8
		return id + distance; // if the id is in the top of bracket
	} else {
		return id - distance; // if the id is in the bottom of bracket
	}
}

function getClosest(num) {

	var index = baseBrackets[0];
	for (i = 0; i < baseBrackets.length; i++) {
		if (baseBrackets[i] >= num) {
			index = baseBrackets[i];
		} else {
			break;
		}
	}
	return index;
}

function updateCount() {
	// # Players label
	var length = document.getElementById("playerList").getElementsByTagName("li").length;
	var count = document.getElementById("playerCount");
	count.innerHTML = length;
}
