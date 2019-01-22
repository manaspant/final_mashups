var listTweet = [];
var searchTwitter;
var idTweeterset;
var idNameset;
var win;
var indiScore = 0;
var curNameID;
var curTweetID;
var turn = 0;


console.log("New?");

// Hardcoding list of people 

var idsOfGreatPeopleRandom = ['27260086', '27760317','79293791', '17919972', '14230524', '169686021', '21447363'];
var namesOfGreatPeopleRandom = ['Justin Bieber','The Beatles', 'Rihanna', 'Taylor Swift', 'Lady Gaga', 'Kanye West', 'Katy Perry'];

var idsOfGreatPeople = ['79293791', '27260086', '21447363', '17919972', '14230524', '27760317', '169686021'];
var namesOfGreatPeople = ['Rihanna', 'Justin Bieber', 'Katy Perry', 'Taylor Swift', 'Lady Gaga', 'The Beatles', 'Kanye West'];
var headings = ['t1', 't2', 't3', 't4', 't5'];

//Trying to create html elements dynamically. didn't work

// for (i = 0; i < 5; i++) {
// 	$( "<div><h6 id= 't'+ i  class= 'tweetClass' >Waiting for tweet...</h6></div>" ).appendTo( "body" );
// }

// $( "<p id='test' + i >My <em>new</em> text</p>" ).appendTo( "body" );

// Making tweet function

function makeTwitterSearchRequest(heading, id){
	$.ajax({
		url: '/search?id='+id,
		type: 'GET',
		dataType: 'JSON',
		error: function(err){
			console.log(err);
		},
		success: function(data){
			console.log(data);
			var theTweet = data.tweet || 'Waiting...';
			heading.html(theTweet);
			listTweet.push(theTweet);
		}
	});
}

$('document').ready(function(){

	//Printing tweets on the page in a loop. Attaching an attribute that will help me check when there is a correct match.
	for (i = 0; i < idsOfGreatPeople.length; i++) {
		makeTwitterSearchRequest($('#t'+i), idsOfGreatPeople[i]);
		$("#t" + i).attr("data-id", idsOfGreatPeople[i]);
	}


	//Printing names on the page in for loop. Attaching attribute. 
	for (i = 0; i < namesOfGreatPeopleRandom.length; i++) {
		$("#n" + i).text(namesOfGreatPeopleRandom[i]);
		$("#n" + i).attr("data-nameID", idsOfGreatPeopleRandom[i]);
	}

	if (turn == 7){
		$('#container').show();
		getAllData();
	}
	else{
		$('#container').hide();
		
	}

	$('#enterButton').click(function(){
		var userName = $("#name").val() || 'XXX';
		var dataScore = indiScore || 'XXX';
		var timeStamp = new Date();
		//Create data object to be saved
		var data = {
			user: userName,
			score: dataScore,
			date: timeStamp,
			school: "NYUAD"
		};
		console.log(data);
		getAllData();
		saveData(data);
		
	});

});

// Performing Click. 

$('.tweetClass').click(function() {
    var text = $(this).text();    //Unnecessary
    console.log("This is the id of the tweet you clicked on: " + idTweeterset); //Unnecessary

    idTweeterset = $(this).attr('data-id'); //defining global var based on its html element 'ID' 
    curTweetID = $(this).attr('id');

    if (typeof idNameset !== 'undefined') {

		if (idTweeterset == idNameset){
			console.log("Correct answer!");
			win = true;

			$('#' + curTweetID).css('background-color', 'green');
			$('#' + curNameID).css('background-color', 'green');


			setTimeout(function() {

				$('#' + curTweetID).empty();
				$('#' + curNameID).empty();

			}, 1500);

			indiScore += 100;
			console.log(indiScore);
			idTweeterset = undefined;
			idNameset = undefined;
			turn += 1;

			if (turn == 7){
  				console.log("its empty!!!!!!");
  				$('#game-done-container').show();
  				$('#game-score').html(indiScore);
			}

		} else{
			console.log("Wrong answer");

			$('#' + curTweetID).css('background-color', 'red');
			$('#' + curNameID).css('background-color', 'red');


			setTimeout(function() {

			$('#' + curTweetID).css('background-color', '#4099FF');
			$('#' + curNameID).css('background-color', '#4099FF');

			}, 1500);

			win = false;
			indiScore -= 100;
			idTweeterset = undefined;
			idNameset = undefined;
			console.log(indiScore);

		}
	} else{
		console.log("This is the first click.");
	}
});


$('.nameClass').click(function() {
    var ID = $(this).text();
    idNameset = $(this).attr('data-nameID');
    console.log("This is the id of the name you clicked on: " + idNameset);

    curNameID = $(this).attr('id');

    if (typeof idTweeterset !== 'undefined') {

		if (idTweeterset == idNameset){
			console.log("Correct answer!");
			win = true;
			
			$('#' + curTweetID).css('background-color', 'green');
			$('#' + curNameID).css('background-color', 'green');


			setTimeout(function() {

				$('#' + curTweetID).empty();
				$('#' + curNameID).empty();

			}, 1500);

			indiScore += 100;
			console.log(indiScore);
			idTweeterset = undefined;
			idNameset = undefined;
			turn += 1;

			if (turn == 7){
  				console.log("its empty!!!!!!");
  				$('#game-done-container').show();
  				$('#game-score').html(indiScore);
			}

		} else{
			console.log("Wrong answer");

			$('#' + curTweetID).css('background-color', 'red');
			$('#' + curNameID).css('background-color', 'red');


			setTimeout(function() {

			$('#' + curTweetID).css('background-color', '#4099FF');
			$('#' + curNameID).css('background-color', '#4099FF');

			}, 1500);





			// $('#' + curTweetID).css('background-color', 'red');
			// $('#' + curNameID).css('background-color', 'red');

			win = false;
			indiScore -= 100;
			idTweeterset = undefined;
			idNameset = undefined;
			console.log(indiScore);
		}
			} else{
		console.log("This is the first click");
	}

});

// Using Craig's functions to store data

function makeHTML(theData){
	var htmlString = '<ol>';
	theData.forEach(function(d){
		htmlString += '<li>' + d.user + ' : ' + d.score + '</li>';
	});
	htmlString += '</ol>';
	return htmlString;
}


function getAllData(){
	$.ajax({
		url: '/api/all',
		type: 'GET',
		dataType: 'json',
		error: function(data){
			console.log(data);
			alert("Oh No! Try a refresh?");
		},
		success: function(data){
			console.log("We have data");
			console.log(data);
			//Clean up the data on the client
			//You could do this on the server
			var theData = data.map(function(d){
				return d.doc;
			});
			var htmlString = makeHTML(theData);
			$('body').append(htmlString);
		}
	});
}

function saveData(obj){
	$.ajax({
		url: '/save',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(obj),
		error: function(resp){
			console.log("Oh no...");
			console.log(resp);
		},
		success: function(resp){
			console.log('WooHoo!');
			console.log(resp);
			var htmlString = '<li>' + obj.user + ' : ' + obj.score + '</li>';
			$('#badID').append(htmlString);
		}
	});
}

var page = 'hi';

// Animations 

var addclass2 = 'color2';
var cols = $('.nameClass').click(function(e) {
    cols.removeClass(addclass2);
    $(this).addClass(addclass2);
});

var addclass = 'color';
var $cols = $('.tweetClass').click(function(e) {
    $cols.removeClass(addclass);
    $(this).addClass(addclass);
});

		$('#' + curTweetID).css('background-color', 'red');
		$('#' + curNameID).css('background-color', 'red');

//Function To Display Popup
function div_show() {
document.getElementById('abc').style.display = "block";
}
//Function to Hide Popup
function div_hide(){
document.getElementById('abc').style.display = "none";
}



