var count = 0;
var bracketCount = 0;
var baseBrackets = [32,16,8,4,2]; // brackets with "perfect" proportions (full fields, no byes)

function addPlayer() {
	var ul = document.getElementById("playerList");
	var label = document.getElementById("playerName");
	var name = label.value;

	if (name == "") {
		return;
	}
	// var deleteButton = "<button class='delete btn btn-warning'>Delete</button>";

	var li = document.createElement("li");

	// button.classList.add("glythicon glythicon-trash");
	// create label
	li.appendChild(document.createTextNode(name));
	li.setAttribute("id", count);

	// create button
	var button = document.createElement("button");
	button.setAttribute("onclick", "removePlayer(this.parentNode.id)");
	button.classList.add("pull-right");
	button.innerHTML = "Remove";

	li.classList.add("list-group-item");

	li.appendChild(button);

	ul.appendChild(li);

	label.value = "";
	count++;
	updateCount();
}

function removePlayer(e) {
	var ul = document.getElementById("playerList");
	li = document.getElementById(e);
	ul.removeChild(li);
	updateCount();
}

function start() {
			var length = document.getElementById("playerList").getElementsByTagName("li").length;

	var rer = confirm("Generate Bracket?");
	if (rer) {
		document.getElementById("generate").style.display = "none";
				getBracket(length);

	} else {
	}
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function getClosest(num) {
	let curr = baseBrackets[0];
                var diff = Math.abs (num - curr);
                for (var val = 0; val < baseBrackets.length; val++) {
                    var newdiff = Math.abs (num - baseBrackets[val]);
                    if (newdiff < diff) {
                        diff = newdiff;
                        curr = baseBrackets[val];
                    }
                }
                return curr;
}

function getBracket(base) {

	var participants = [];
	var li;
	var ul = document.getElementsByTagName("li");
	console.log(li);
	// $('li').each(function(i, elem) {
	// 	participants.push($(elem).value);
	// })
	for(var i=0; i <ul.length; i++) {
  		participants.push(ul[i].firstChild.nodeValue);
  	}

	participants = shuffle(participants);

	console.log(participants);

	var closest = getClosest(base);
	var byes = closest - base;



	if(byes>0)	base = closest;
				
					var brackets 	= [],
						round 		= 1,
						baseT 		= base/2,
						baseC 		= base/2,
						teamMark	= 0,
						nextInc		= base/2;
						
					for(i=1;i<=(base-1);i++) {
						var	baseR = i/baseT,
							isBye = false;
							
						if(byes>0 && (i%2!=0 || byes>=(baseT-i))) {
							isBye = true;
							byes--;
						}
						
						var last = _.map(_.filter(brackets, function(b) { return b.nextGame == i; }), function(b) { return {game:b.bracketNo,teams:b.teamnames}; });


						console.log("last");
						console.log(last);
						brackets.push({
							lastGames:	round==1 ? null : [last[0].game,last[1].game],
							nextGame:	nextInc+i>base-1?null:nextInc+i,
							teamnames:	round==1 ? [participants[teamMark],participants[teamMark+1]] : [last[0].teams[_.random(1)],last[1].teams[_.random(1)]],
							bracketNo:	i,
							roundNo:	round,
							bye:		isBye
						});
						teamMark+=2;
						if(i%2!=0)	nextInc--;
						while(baseR>=1) {
							round++;
							baseC/= 2;
							baseT = baseT + baseC;
							baseR = i/baseT;
						}
					}
					console.log(brackets);
					renderBrackets(brackets);
}

	// 			/*
	// 			 * Inject our brackets
	// 			 */
				function renderBrackets(struct) {
					var groupCount	= _.uniq(_.map(struct, function(s) { return s.roundNo; })).length;
					var group	= $('<div class="group'+(groupCount+1)+'" id="b'+bracketCount+'"></div>'),
						grouped = _.groupBy(struct, function(s) { return s.roundNo; });
					for(g=1;g<=groupCount;g++) {
						var round = $('<div class="r'+g+'"></div>');
						_.each(grouped[g], function(gg) {
							if(gg.bye)
								round.append('<div></div>');
							else
								round.append('<div><div class="bracketbox"><span class="info">'+gg.bracketNo+'</span><span class="teama">'+gg.teamnames[0]+'</span><span class="teamb">'+gg.teamnames[1]+'</span></div></div>');
						});
						group.append(round);
					}
					group.append('<div class="r'+(groupCount+1)+'"><div class="final"><div class="bracketbox"><span class="teamc">'+_.last(struct).teamnames[_.random(1)]+'</span></div></div></div>');
					$('#brackets').append(group);
					
					bracketCount++;
					$('html,body').animate({
						scrollTop: $("#b"+(bracketCount-1)).offset().top
					});
				}
				

function updateCount() {
	var length = document.getElementById("playerList").getElementsByTagName("li").length;
	var count = document.getElementById("playerCount");
	count.innerHTML = length;
}
