var PORT = 5000
var HOST = "localhost"

function Graph(port, host) {
    try {
	this.ws = new WebSocket("wss://" + host + ":8888/localhost;" + port);
    } catch(err) {
	this.ws = new MozWebSocket("wss://" + host + ":8888/localhost;" + port);
    }
    this.ws.onmessage = function(evt) {
	var message = JSON.parse(evt.data);
	// switch(message['command']) {
	//     case 'found': focus(message['content'][0]['ID']); break;
	//     case 'addNode': addNode(message['content'].name, message['content'].content, message['content'].ID); break;
	//     case 'deleteNode': deleteNode(message['content'].node); break;
	//     case 'addEdge': addEdge(message['content'].edge[0], message['content'].edge[1]); break;
	//     case 'deleteEdge': deleteEdge(message['content'].edge[0], message['content'].edge[1]); break;
	//     case 'editContent': editDescription(message['content'].ID, message['content'].content); break;
	// };
	switch(message['command']) {
	    case 'found': console.log(message['content'][0]['ID']); break;
	    case 'addNode': console.log(message['content'].name, message['content'].content, message['content'].ID); break;
	    case 'deleteNode': console.log(message['content'].node); break;
	    case 'addEdge': console.log(message['content'].edge[0], message['content'].edge[1]); break;
	    case 'deleteEdge': console.log(message['content'].edge[0], message['content'].edge[1]); break;
	    case 'editContent': console.log(message['content'].ID, message['content'].content); break;
	};
	// Notifications? Maybe warning of attempted loop
    }

    function addNode(nodeName, content) {
	var message = {
	    'command':'addNode',
	    'args':[nodeName, content]
	};
	this.ws.send(JSON.stringify(message));
    }

    function deleteNode(nodeID) {
	var message = {
	    'command':'deleteNode',
	    'args':[nodeID]
	};
	this.ws.send(JSON.stringify(message));
    }
    
    function addEdge(parentID, childID) {
	var message = {
	    'command':'addEdge',
	    'args':[parentID, childID]
	};
	this.ws.send(JSON.stringify(message));
    }

    function deleteEdge(parentID, childID) {
	var message = {
	    'command':'deleteEdge',
	    'args':[parentID, childID]
	};
	this.ws.send(JSON.stringify(message));
    }

    function editContent(nodeID, newContent) {
	var message = {
	    'command':'editContent',
	    'args':[nodeID, newContent]
	};
	this.ws.send(JSON.stringify(message));    }

    function searchNode(keywords) {
	var message = {
	    'command':'searchNode',
	    'args':[keywords]
	};
	this.ws.send(JSON.stringify(message));
    }
}

knowledgeTree = new graph(PORT, HOST);
