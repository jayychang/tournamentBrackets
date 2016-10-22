var playerId = 0;
// var bracketCount = 0;
var winner = 1;
var baseBrackets = [32,16,8,4,2]; // brackets with "perfect" proportions (full fields, no byes)

// Actions

function addPlayer() {
	var ul = document.getElementById("playerList");
	var label = document.getElementById("playerName");
	var name = label.value;

	if (name == "") {
		return;
	}

	if (ul.length > 32) {
		alert("Max 32 Players")
	}

	var li = document.createElement("li");
	li.classList.add("list-group-item");

	// create label
	li.appendChild(document.createTextNode(name));
	li.setAttribute("id", playerId);

	// create button
	var button = document.createElement("button");
	button.innerHTML = "✕";
	button.setAttribute("type", "button");
	button.setAttribute("onclick", "removePlayer(this.parentNode.id)");
	button.classList.add("btn");
	button.classList.add("btn-default");
	button.classList.add("pull-right");
	button.classList.add("btn-xs");

	li.appendChild(button);
	ul.appendChild(li);

	label.value = "";
	playerId++;
	updateCount();
}

function removePlayer(e) {
	var ul = document.getElementById("playerList");
	li = document.getElementById(e);
	ul.removeChild(li);
	updateCount();
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
	console.log(participants);

	// Get Bracket size
	var closest = getClosest(count);
	console.log("count");
	console.log(count);
	console.log("closest");
	console.log(closest);

	var byeCount = closest - count;
	var byeOffset = 0;
	if (byeCount > 0)	{
		// count = closest;
		byeOffset = 1;
	}

	var pairs = [];
	var byes = [];
	var totalRounds = Math.log2(closest);
	console.log(totalRounds);
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

	console.log(pairs);
	console.log(byes);
	drawBracket(pairs, byes, closest)
}

function drawBracket(pairs, byes, seeds) {
	console.log("draw function");
	console.log(pairs);
	console.log(byes);
	// console.log(totalRounds);

	var totalRounds = Math.log2(seeds);
	var roundMatches = seeds/2;

	var pairCount = pairs.length;
	var brackets = document.getElementById("brackets");
	var rounds = totalRounds + winner;
	var roundId = "roundId" + rounds;

	var layout = document.createElement("div");
	layout.classList.add(roundId);
	brackets.appendChild(layout);

	var bracketCounts = Math.max(seeds/2, 1);
	for (i=1; i <= rounds; i++) {
		console.log("bracket");
		console.log(bracketCounts);
		console.log(rounds);

		var columnId = "columnId"+i;

		var column = document.createElement("div");
		column.classList.add(columnId);
		layout.appendChild(column);

		// add the bracket itself now
		for (j = 0; j < bracketCounts; j++) {
			bracketLayout = document.createElement("div");
			column.appendChild(bracketLayout);

			var bracketBox = document.createElement("div");
			bracketBox.classList.add("bracketbox");
			bracketLayout.appendChild(bracketBox);
		}
		// pairCount--;

		bracketCounts = Math.max(bracketCounts/2, 1);
	}
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
	var length = document.getElementById("playerList").getElementsByTagName("li").length;
	var count = document.getElementById("playerCount");
	count.innerHTML = length;
}
