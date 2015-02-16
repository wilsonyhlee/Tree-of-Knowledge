/*var DocWidth = document.body.clientWidth;

function setDivWidth(DocWidth){
    var Tree = document.getElementById('viewport');
    Tree.style.width=DocWidth/3 + "px";
    Tree.style.borderColor= "blue";
    Tree.style.borderStyle= "solid"
    Tree.style.height = "500px"
    var Content = document.getElementById('content');
    Content.style.width=DocWidth*0.6 + "px"; 
    Content.style.borderStyle="solid";
    Content.style.borderColor="red";
    Content.style.height = "500px"; 
    var Content = document.getElementById('content');
    Content.style.width=DocWidth*2/3 + "px"; 
    Content.style.borderStyle="solid";
    Content.style.borderColor="red";
    Content.style.height = document.body.clientHeight; 
    
}
setDivWidth(DocWidth);*/

var edgeOp = false
var edgeFn = null;

var Focused = -1;

var Editing = false;

var Nodes = {}
var Edges = {}

var NodesVisible = {}
var EdgesVisible = {}
var EdgeCount = 0

var FocusOrder = [];
var FocusCounter = 0;
    

function InitializeGraph(nodes, edges){
    for (i in nodes){
	if(nodes[i].name == null) {
	    AddNode("", nodes[i].content, nodes[i].ID);
	}
	else {
	    AddNode(nodes[i].name, nodes[i].content, nodes[i].ID);
	}
    }
    for (i in edges){
	AddEdge(edges[i][0], edges[i][1]);}
}

function Clear(){
    for(i in NodesVisible){
	UnShowNode(i);}
}
 
function EditContent(nodeID, newContent){
    Nodes[nodeID].content = newContent;
    if( nodeID in NodesVisible){
	NodesVisible[nodeID].data.content = newContent;
    }
}

function DrawEverything(){   //SHOW everything if not focuses
    for(i in Nodes){
	AddFocus(i);}
}

function AddFocus(nodeID){
    FocusOrder.push(nodeID);
    console.log(FocusOrder);
    if(!(nodeID in NodesVisible))
       ShowNode(nodeID);
    //console.log(Nodes[nodeID].edgesFrom);
    for(i in Nodes[nodeID].edgesFrom){
	if( !(Nodes[nodeID].edgesFrom[i][1] in NodesVisible))
	    ShowNode(Nodes[nodeID].edgesFrom[i][1]);
	ShowEdge(i);
    }
    for(i in Nodes[nodeID].edgesTo){
	if( !(Nodes[nodeID].edgesTo[i][1] in NodesVisible))
	    ShowNode(Nodes[nodeID].edgesTo[i][1]);
	ShowEdge(i);
	
    }
}

function RemoveFocus(nodeID){
    
   // console.log(NodesVisible);
    //console.log(Nodes[nodeID].edgesFrom);
    //console.log(FocusOrder);
    for(i in Nodes[nodeID].edgesFrom){
	var inside = false;
	for(var o = 0; o<FocusOrder.length; o++) if(FocusOrder[o] == Nodes[nodeID].edgesFrom[i][1]) inside = true;
	console.log(inside);
	console.log(Nodes[nodeID].edgesFrom[i][1]);
	if(inside){
	    RemoveFocus(Nodes[nodeID].edgesFrom[i][1]);
	}
    }

//console.log(NodesVisible);
   
   
    for( i in Nodes[nodeID].edgesFrom){
	UnShowNode(Nodes[nodeID].edgesFrom[i][1]);}

//console.log(NodesVisible);


    for(i in Nodes[nodeID].edgesTo){
	var inside = false;
	for(var o = 0; o<FocusOrder.length; o++) if(FocusOrder[o] == Nodes[nodeID].edgesTo[i][1]) inside = true;
	console.log(inside);
	if( !(inside)){
	    UnShowNode((Nodes[nodeID].edgesTo[i])[1]);
	}
    }
   // console.log(NodesVisible);
    var index = -1;
    for (i in FocusOrder){
	if(parseInt(FocusOrder[i]) == nodeID) index = i;}
    delete FocusOrder[index];
}

function AddNode(name, content, ID){
    Nodes[ID] = {'name': name, 'content': content, 'ID': ID , 'edgesTo': {}, 'edgesFrom': {}}
}

function AddEdge(parentID, childID){
    Edges[EdgeCount] = {'parentID': parentID, 'childID': childID, 'ID': EdgeCount}
    Nodes[parentID].edgesFrom[EdgeCount] = [EdgeCount, childID];
    Nodes[childID].edgesTo[EdgeCount] = [EdgeCount, parentID];
    EdgeCount +=1;
}

function RemoveNode(nodeID){
    for( i in Nodes[nodeID].EdgesTo){
	RemoveEdge(Nodes[nodeID].EdgesTo[i][1], nodeID);
    }
    for( i in Nodes[nodeID].EdgesFrom){
	RemoveEdge(nodeID, Nodes[nodeID].EdgesFrom[i][1]);
    }
    delete Nodes[nodeID];
}

function RemoveEdge(parentID, childID){
    for(i in Edges){
	if( Edges[i].parentID == parentID && Edges[i].childID == childID){
	    delete Edges[i]}
    }
}


function ShowNode(nodeID)
{
    return NodesVisible[nodeID] = sys.addNode(Nodes[nodeID].name, {'color':'black', 'shape':'box', 'label': Nodes[nodeID].name, 'content':Nodes[nodeID].cont, 'ID':nodeID});
}

function ShowEdge(edgeID)
{
    return EdgesVisible[edgeID] = sys.addEdge(NodesVisible[Edges[edgeID].parentID],NodesVisible[Edges[edgeID].childID], {'color':'black', 'directed':true});
}

function UnShowEdge(edgeID)
{
    if( edgeID in EdgesVisible){
	sys.pruneEdge(EdgesVisible[edgeID]);
	delete EdgesVisible[edgeID];
    }
}

function UnShowNode(nodeID){
    if(nodeID in NodesVisible){
	sys.pruneNode(NodesVisible[nodeID]);
	delete NodesVisible[nodeID];
    }
}


var sys = arbor.ParticleSystem(100, 100,1,1,60); //arguments are repulsion, stiffness, friction, gravity, fps, dt, precision
sys.parameters({gravity:false});
sys.renderer = Renderer("#viewport");

// AddNode( 'Tree of Knowledge', 'Knowledge is a familiarity with someone or something, which can include facts, information, descriptions, or skills acquired through experience or education. It can refer to the theoretical or practical understanding of a subject. It can be implicit (as with practical skill or expertise) or explicit (as with the theoretical understanding of a subject); it can be more or less formal or systematic.  In philosophy, the study of knowledge is called epistemology; the philosopher Plato famously defined knowledge as "justified true belief." However, no single agreed upon definition of knowledge exists, though there are numerous theories to explain it.', 0);
// AddNode( 'Math', 'Mathematics is the abstract study of topics such as quantity (numbers), structure, space, and change.  There is a range of views among mathematicians and philosophers as to the exact scope and definition of mathematics.  Mathematicians seek out patterns and use them to formulate new conjectures. Mathematicians resolve the truth or falsity of conjectures by mathematical proof. When mathematical structures are good models of real phenomena, then mathematical reasoning can provide insight or predictions about nature. Through the use of abstraction and logic, mathematics developed from counting, calculation, measurement, and the systematic study of the shapes and motions of physical objects. Practical mathematics has been a human activity for as far back as written records exist. The research required to solve mathematical problems can take years or even centuries of sustained inquiry.', 1);
// AddNode('Philosophy', 'Philosophy is the study of general and fundamental problems, such as those connected with reality, existence, knowledge, values, reason, mind, and language. Philosophy is distinguished from other ways of addressing such problems by its critical, generally systematic approach and its reliance on rational argument. In more casual speech, by extension, "philosophy" can refer to "the most basic beliefs, concepts, and attitudes of an individual or group".',2);
// AddNode('Calculus', 'Calculus is the mathematical study of change, in the same way that geometry is the study of shape and algebra is the study of operations and their application to solving equations. It has two major branches, differential calculus (concerning rates of change and slopes of curves), and integral calculus (concerning accumulation of quantities and the areas under curves); these two branches are related to each other by the fundamental theorem of calculus. Both branches make use of the fundamental notions of convergence of infinite sequences and infinite series to a well-defined limit. Generally considered to have been founded in the 17th century by Isaac Newton and Gottfried Leibniz, today calculus has widespread uses in science, engineering and economics and can solve many problems that algebra alone cannot.', 3);
// AddNode('Economics', 'Economics is the social science that analyzes the production, distribution, and consumption of goods and services.  Political economy was the earlier name for the subject, but economists in the late 19th century suggested economics as a shorter term for economic science that also avoided a narrow political-interest connotation and as similar in form to mathematics, ethics, and so forth. A focus of the subject is how economic agents behave or interact and how economies work. Consistent with this, a primary textbook distinction is between microeconomics and macroeconomics. Microeconomics examines the behavior of basic elements in the economy, including individual agents (such as households and firms or as buyers and sellers) and markets, and their interactions. Macroeconomics analyzes the entire economy and issues affecting it, including unemployment, inflation, economic growth, and monetary and fiscal policy.',4);
// AddNode('Literature', 'Literature (from Latin litterae (plural); letter) is the art of written work. The word literature literally means: things made from letters. Literature is commonly classified as having two major forms—fiction & non-fiction—and two major techniques—poetry and prose.  Literature may consist of texts based on factual information (journalistic or non-fiction), a category that may also include polemical works, biography, and reflective essays, or it may consist of texts based on imagination (such as fiction, poetry, or drama). Literature written in poetry emphasizes the aesthetic and rhythmic qualities of language—such as sound, symbolism, and metre—to evoke meanings in addition to, or in place of, ordinary meanings, while literature written in prose applies ordinary grammatical structure and the natural flow of speech. Literature can also be classified according to historical periods, genres, and political influences. While the concept of genre has broadened over the centuries, in general, a genre consists of artistic works that fall within a certain central theme; examples of genre include romance, mystery, crime, fantasy, erotica, and adventure, among others.', 5);
// AddNode('Camões', 'Luís Vaz de Camões (Portuguese pronunciation: [luˈiʒ ˈvaʒ dɨ kaˈmõjʃ]; sometimes rendered in English as Camoens /ˈkæm oʊˌənz/; c. 1524 – 10 June 1580) is considered Portugals and the Portuguese languages greatest poet. His mastery of verse has been compared to that of Shakespeare, Vondel, Homer, Virgil and Dante. He wrote a considerable amount of lyrical poetry and drama but is best remembered for his epic work Os Lusíadas (The Lusiads). His collection of poetry The Parnasum of Luís de Camões was lost in his lifetime. The influence of his masterpiece Os Lusíadas is so profound that Portuguese is called the "language of Camões".',6);
// AddNode('Camus', 'Albert Camus (French: [albɛʁ kamy]; 7 November 1913 – 4 January 1960) was a French Nobel Prize winning author, journalist, and philosopher, described as the James Dean of philosophy. His views contributed to the rise of the philosophy known as absurdism. He wrote in his essay The Rebel that his whole life was devoted to opposing the philosophy of nihilism while still delving deeply into individual freedom. Although often cited as a proponent of existentialism, the philosophy with which Camus was associated during his own lifetime, he rejected this particular label.[3] In an interview in 1945, Camus rejected any ideological associations: No, I am not an existentialist. Sartre and I are always surprised to see our names linked...', 7);
// AddNode('Linear Algebra', 'Linear algebra is the branch of mathematics concerning vector spaces, often finite or countably infinite dimensional, as well as linear mappings between such spaces. Such an investigation is initially motivated by a system of linear equations containing several unknowns. Such equations are naturally represented using the formalism of matrices and vectors.  Linear algebra is central to both pure and applied mathematics. For instance, abstract algebra arises by relaxing the axioms of a vector space, leading to a number of generalizations. Functional analysis studies the infinite-dimensional version of the theory of vector spaces. Combined with calculus, linear algebra facilitates the solution of linear systems of differential equations. Techniques from linear algebra are also used in analytic geometry, engineering, physics, natural sciences, computer science, computer animation, and the social sciences (particularly in economics). Because linear algebra is such a well-developed theory, nonlinear mathematical models are sometimes approximated by linear ones.',8);
// AddNode('Matrix', 'In mathematics, a matrix (plural matrices) is a rectangular array[1] of numbers, symbols, or expressions, arranged in rows and columns. The individual items in a matrix are called its elements or entries.  Matrices of the same size can be added or subtracted element by element. But the rule for matrix multiplication is that two matrices can be multiplied only when the number of columns in the first equals the number of rows in the second. A major application of matrices is to represent linear transformations, that is, generalizations of linear functions such as f(x) = 4x. For example, the rotation of vectors in three dimensional space is a linear transformation. If R is a rotation matrix and v is a column vector (a matrix with only one column) describing the position of a point in space, the product Rv is a column vector describing the position of that point after a rotation. The product of two matrices is a matrix that represents the composition of two linear transformations. Another application of matrices is in the solution of a system of linear equations. If the matrix is square, it is possible to deduce some of its properties by computing its determinant. For example, a square matrix has an inverse if and only if its determinant is not zero. Eigenvalues and eigenvectors provide insight into the geometry of linear transformations.', 9);

// AddEdge(0,1);
// AddEdge(0,2);
// AddEdge(0,4);
// AddEdge(0,5);

// AddEdge(1,8);
// AddEdge(1,3);

// AddEdge(5,6);
// AddEdge(5,7);
// AddEdge(8,9);

// //UnShowEdge(2);
// //ShowEdge(2);
// //console.log(Edges);
// //UnShowEdge(1);
// //console.log(Nodes[0].edgesFrom);
// Clear();
// //Focus(-1);
// AddFocus(0);

parent = null
child = null

var lastTimestamp = 0;
$("#viewport").click(function(e){
    var pos = $(this).offset(); 
    var p = {x:e.pageX-pos.left, y:e.pageY-pos.top}
    selected = nearest = dragged = sys.nearest(p);
    console.log(e);

    if (selected.node !== null && nearest.distance < 20){
	if(e.timeStamp - lastTimestamp > 1 ){
	    lastTimestamp = e.timeStamp;
	    // dragged.node.tempMass = 10000
            dragged.node.fixed = true;

	    if(edgeOp) {
		console.log(dragged);
		switch(edgeOp) {
		    case 1: parent = dragged.node.data.ID; edgeOp = 2; break
		    case 2: child = dragged.node.data.ID; edgeOp = false; edgeFn(parent,child); console.log(parent,child); break;
		}
	    }
	    else {
		console.log(FocusOrder);
		Focused = dragged.node.data.ID;
		Display(0);
		var inside = false;
		for(var i=0; i<FocusOrder.length; i++)
		    if( FocusOrder[i] == dragged.node.data.ID) inside = true;
		//console.log(inside);
		content_block.innerHTML = ("<h1>" + Nodes[Focused].name + "</h1><h3>" + Nodes[Focused].content+"</h3>");
		if( inside ){
		    RemoveFocus(dragged.node.data.ID);
		}
		else {
		    //console.log(dragged.node.data.ID);
		    AddFocus(dragged.node.data.ID);
		}
	    }
	}
    }
    
    else{ Focused = -1;}

    return false;
});
