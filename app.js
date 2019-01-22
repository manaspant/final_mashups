// Declare Requirements
var express = require("express"),
bodyParser = require('body-parser'),
errorHandler = require('errorhandler'),
Twitter = require('twitter');
var Request = require('request');

//Create the app
var app = express();

// Set up the views directory
app.set("views", __dirname + '/views');

// Set EJS as templating language, but allow for .html extension

app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

//Add connection to public folder for css & js files
app.use(express.static(__dirname + '/public'));
// app.use(favicon(__dirname + '/public/media/favicon.ico'));

app.use(bodyParser.json());

// Set up Express error handling
app.use(errorHandler());


//******* DATABASE Configuration *******

var CLOUDANT_USERNAME="manaspant";
var CLOUDANT_DATABASE="finalmashups";
var CLOUDANT_KEY="arlyhoughtedintogallusai";
var CLOUDANT_PASSWORD="612f495050346608848e88cf07443277bfab324c";

var CLOUDANT_URL = "https://" + CLOUDANT_USERNAME + ".cloudant.com/" + CLOUDANT_DATABASE;

/********************************
Twitter Config
********************************/

var TWITTER_CONSUMER_KEY = 'a3JKyhPvViOz88XVEAuxuV8fX';
var TWITTER_CONSUMER_SECRET = 'JvVaDIR0BT3drSlyRLxOdUzVLpY642TtU3ZnBW7XfLCN4OD9HV';
var TWITTER_ACCESS_TOKEN_KEY = '801768642438381569-5QOQnvoULsaivxOnfL8mm4M5zC25zfi';
var TWITTER_ACCESS_SECRET = 'YprCoWEvSrXxSBZPkkOc77EncurrVN7YqxlhqDNvDgXdO';

var client = new Twitter({
	consumer_key: TWITTER_CONSUMER_KEY,
	consumer_secret: TWITTER_CONSUMER_SECRET,
	access_token_key: TWITTER_ACCESS_TOKEN_KEY,
	access_token_secret: TWITTER_ACCESS_SECRET
});

/*--------------------------------------------
For this example, you need a twitter user's id
This site can help you with this
http://gettwitterid.com/
--------------------------------------------*/

//ROUTES

//What is this doing?

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/", function(req, res){
	res.render('index.html');
});

app.get("/cover", function(req, res){
	res.render('cover.html');
});

app.get("/about", function(req, res){
	res.render('about.html');
});

app.get("/leader", function(req, res){
	res.render('leader.html');
});


// Using the 'Twitter' lib - https://www.npmjs.com/package/twitter

app.get("/search", function(req, res){

	// console.log("\n\n\n....\n\n\n" , req , "and this is the response\n\n\n\n", res);

	var params = {
		user_id: (req.query.id)
	};
	client.get('statuses/user_timeline', params, function(error, tweets, response){
		if (error){
			throw error;
		}
		console.log(tweets[0].text);
		var theTweet = {'tweet': tweets[0].text };
		res.json(theTweet);
	});

});



//SAVE an object to the db
app.post("/save", function(req,res){
	console.log("A POST!!!!");
	//Get the data from the body
	var data = req.body;
	console.log(data);
	//Send the data to the db
	Request.post({
		url: CLOUDANT_URL,
		auth: {
			user: CLOUDANT_KEY,
			pass: CLOUDANT_PASSWORD
		},
		json: true,
		body: data
	},
	function (error, response, body){
		if (response.statusCode == 201){
			console.log("Saved!");
			res.json(body);
		}
		else{
			console.log("Uh oh...");
			console.log("Error: " + res.statusCode);
			res.send("Something went wrong...");
		}
	});
});

//JSON Serving route - ALL Data
app.get("/api/all", function(req,res){
	console.log('Making a db request for all entries');
	//Use the Request lib to GET the data in the CouchDB on Cloudant
	Request.get({
		url: CLOUDANT_URL+"/_all_docs?include_docs=true",
		auth: {
			user: CLOUDANT_KEY,
			pass: CLOUDANT_PASSWORD
		},
		json: true
	},
	function (error, response, body){
		var theRows = body.rows;
		//Send the data
		res.json(theRows);
	});
});

app.get("*", function(req,res){
	res.redirect("/");
});

// Start the server
var port = process.env.PORT || 3000;
var server = app.listen(port);
console.log('Express started on port: ' + port);