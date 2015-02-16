var PORT = 5000
var HOST = "18.239.5.231"

function Graph(port, host) {
    try {
	this.ws = new WebSocket("ws://" + host + ":8889/localhost;" + port);
    } catch(err) {
	this.ws = new MozWebSocket("ws://" + host + ":8889/localhost;" + port);
    }
    this.ws.onmessage = function(evt) {
	var message = JSON.parse(evt.data);
	console.log(message)
	switch(message['command']) {
	    case 'found':
	    if(message['content'].length != 0) {	
		Clear();
		console.log(Nodes[message['content'][0].ID]);
		RemoveFocus(0);
		AddFocus(parseInt(message['content'][0].ID));
		Focused = parseInt(message['content'][0].ID);
		content_block.innerHTML = ("<h1>" + Nodes[Focused].name + "</h1><h3>" + Nodes[Focused].content+"</h3>");
		Display(0);
	    }
	    break;
	    case 'addNode': AddNode(message['content'].name, message['content'].content, message['content'].ID); AddFocus(message['content'].ID); ShowNode(message['content'].ID); break;
	    case 'deleteNode': RemoveNode(message.node); break;
	    case 'addEdge': AddEdge(message.edge[0], message.edge[1]); ShowEdge(EdgeCount-1); break;
	    case 'deleteEdge': RemoveEdge(message.edge[0], message.edge[1]); break;
	    case 'editContent': EditContent(message['content'].ID, message['content'].content); break;
	    case 'tree': InitializeGraph(message.nodes, message.edges); DrawEverything(); break;
	};
	// Notifications? Maybe warning of attempted loop
    }

    this.addNode = function(nodeName, content) {
	var message = {
	    'command':'addNode',
	    'args':[nodeName, content]
	};
	this.ws.send(JSON.stringify(message));
    }

    this.deleteNode = function(nodeID) {
	var message = {
	    'command':'deleteNode',
	    'args':[nodeID]
	};
	this.ws.send(JSON.stringify(message));
    }
    
    this.addEdge = function(parentID, childID) {
	var message = {
	    'command':'addEdge',
	    'args':[parentID, childID]
	};
	this.ws.send(JSON.stringify(message));
    }

    this.deleteEdge = function(parentID, childID) {
	var message = {
	    'command':'deleteEdge',
	    'args':[parentID, childID]
	};
	this.ws.send(JSON.stringify(message));
    }

    this.editContent = function(nodeID, newContent) {
	var message = {
	    'command':'editContent',
	    'args':[nodeID, newContent]
	};
	this.ws.send(JSON.stringify(message));
    }

    this.searchNode = function(keywords) {
	var message = {
	    'command':'searchNode',
	    'args':[keywords]
	};
	this.ws.send(JSON.stringify(message));
    }
}

knowledgeTree = new Graph(PORT, HOST);
