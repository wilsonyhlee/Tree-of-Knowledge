tree_of_knowledge
=================

Tree of Knowledge for HackMIT

The idea behind this project is to build a crowdsourced source of information that is accessible for learning. We believe that wikipedia is a great resource for reference, but it is not great for learning (for example, if I want to learn a new programming language, wikipedia is not the first thing I think of).

This started being developed at HackMIT 2013 and we managed to get a barely functional version up.

There is a huge TODO list, and the first item is: do the TODO list.

Instructions to get the backend running:

This is a web app that uses websockets. It uses tornado to power websockets communication and a communication layer that makes websockets invisible to the backend services. This magic happens in "main.py" and it basically allows you to, from a websocket connection, connect to any server/port you want. The first step of getting this to run is to run "main.py" in the same server as you are hosting this app (this is not converted to python 3 yet).

The second step is to modify "web/treeBack.js" to connect to the right server (in this case just change the HOST port).

After that you host all the files in the web directory on your web server and run wsService.py (this is the actual back end).

Note: there is the assumption in treeBack.js that main.py and wsService.py are on the same server. This is not necessary, because of the magic in main.py, and if you want to change this, just change ":8889/localhost;" (it appears in two lines) to have the right host (note that port 8889 is the default for main.py -- if you change that, you should change it in treeBack.js as well).

Good luck!