var ipc = require('ipc');
var http = require('http');
var $ = require('dombo');

$('#new-media').on('click', function() {
	ipc.send('open-file', 'image');
});

$('#new-song').on('click', function() {
	ipc.send('open-file', 'music');
});

$('#reddit-user').on('click', function() {
	getUserData($('.username'), returnUserData);
});

ipc.on('files-uploaded', function(payload) {
	console.log(payload);
	if(payload.type == 'image') {
		setBackground(payload.files);
	} else if (payload.type == 'music') {
		playMusic(payload.files);
	}
});

var getUserData = function(user, callback) {
	var data = "";
	var options = {
		hostname: 'api.reddit.com',
		path: '/user/' + user[0].value +'/about.json',
		method: 'GET',
		headers: {
			'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.52 Safari/537.36'
		}
	};

	var req = http.request(options, function(res) {
		console.log(options.hostname, options.path);
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			console.log('BODY: ' + chunk);
			data += chunk;
		});
		res.on('end', function() {
			callback(JSON.parse(data));
		});
	});
	req.end();
};

returnUserData = function(user) {
	console.log(user.data);
	user = user.data;
	var content =
		"<h1>" + user.name +"</h1>" +
		"<ul>" +
			"<li> <strong>Link Karma:</strong> " + user.link_karma + "</li>" +
			"<li> <strong>Comment Karma:</strong> " + user.comment_karma + "</li>" +
		"</ul>";
	$('.user')[0].innerHTML = content;
};

setBackground = function(files) {
	document.body.style.background = 'url(' + files[0] + ') no-repeat';
	document.body.style.backgroundSize = "cover";
}

playMusic = function(files) {
	console.log(files[0]);
	var nowPlaying = new Audio();
	nowPlaying.src = files[0];
	nowPlaying.play();
}