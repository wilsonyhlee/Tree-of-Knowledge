#!/usr/bin/python

import serviceSkeleton
import json
import threading
import sys
from Tree import *

PORT = 5000
HOST = "127.0.0.1"

USERSONLINE = set([])
USERSONLINELOCK = threading.Lock()
treeLock = threading.Lock()

# if integer argument passed, use that as port
if len(sys.argv) > 1:
    try:
        PORT=int(sys.argv[1])
    except:
        pass

def serviceFunc(conn, addr):
    global USERSONLINELOCK,USERSONLINE,treeLock
    print "Connection :D"
    with USERSONLINELOCK:
        USERSONLINE.add(conn)

    with treeLock:
        nodes = [nodeToDict(i) for i in Tree.values()]
        edges = [[p.ID, c] for p in Tree.values() for c in p.getChildren()]
        conn.sendall(json.dumps({'command': 'tree', 'nodes': nodes, 'edges': edges}))

    while True:
        try:
            message = json.loads(conn.recv(1048576))
        except:
            USERSONLINE.remove(conn)
            conn.close()
            return

        print message

        # Do stuff with the message
        with treeLock:
            changes = {
                'addNode': addNode,
                'deleteNode': deleteNode,
                'addEdge': addEdge,
                'deleteEdge': deleteEdge,
                'editContent': editContent,
                'searchNode': searchNode,
            }[message['command']](*message['args'])

        print changes

        if changes is not None:
            if 'command' in changes and changes['command'] == 'found':
                with USERSONLINELOCK:
                    conn.sendall(json.dumps(changes))
                continue
            with USERSONLINELOCK:
                print USERSONLINE
                for c in USERSONLINE:
                    c.sendall(json.dumps(changes))

serviceSkeleton.startService(PORT,serviceFunc,host=HOST)
