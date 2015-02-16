var email = null;
var fullName = null;
var user = null;
var hushhush = null;
var term = null;
var ws = null;
var colors = {};

function initialize() {
    fullName = document.getElementsByName('fullName')[0].content;
    email = document.getElementsByName('kerberos')[0].content;
    user = email.split('@')[0];
    port = window.location.hash.substring(1).split('/')[0];
    if(port == '') {
	port = '5001';
    }
    try {
	ws = new WebSocket("wss://hexnet.mit.edu:8888/localhost;" + port);
    } catch(err) {
	ws = new MozWebSocket("wss://hexnet.mit.edu:8888/localhost;" + port);
    }
    ws.onmessage = function(evt) {
	var parsed = parseMessage(evt.data);
	if (parsed) {
	    addToChatLog(parsed);
	}
    }
    auth(ws,"chatService");
    $("#chatbar").click(function(){
	$("#chatbox").slideToggle();
    });
    $("#chatbox").slideToggle();
}

function terminate() {
}

function sendMessage() {
    var message = {
	'username':user, 
	'chat':document.getElementById("usermsg").value
    }
    ws.send(JSON.stringify(message));
    document.getElementById("usermsg").value="";
}

function addToChatLog(message) {
    var chatlog = document.getElementById("chatlog");
    chatlog.innerHTML += message;
    chatlog.scrollTop = chatlog.scrollHeight;
}

function parseMessage(message) {
    message = JSON.parse(message);
    if ("chat" in message) {
	return '<p> <span style="color:' + colors[message.username] + '">' + message.username + ': </span>' + message.chat + '</p>';
    }
    else if ("usersonline" in message) {
	updateUsersOnline(message.usersonline);
	return "";
    }
}

function updateUsersOnline(usersOnline) {
    var usersOnlineParsed = "";
    for (var i=0 ; i < usersOnline.length ; i++) {
	userDict = usersOnline[i];
	var name = userDict.username;
	var color = userDict.color;
	colors[name] = color;
	usersOnlineParsed += '<p style="color:' + color + '">' + name + "</p>";
    }
    document.getElementById("usersonline").innerHTML = usersOnlineParsed;
}

window.onload = initialize;
window.onunload = terminate;
