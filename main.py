#!/usr/bin/python

import tornado.ioloop as ioloop
import tornado.web as web
import tornado.websocket as websocket
import threading
import socket

class closedIndicator:
    def __init__(self):
        self.closed = False

    def isClosed(self):
        return self.closed
    
    def close(self):
        self.closed = True

def serverThread(connHandle):
    # loop forever waiting for input
    while True:
        # get input
        fromServer = connHandle.serverConn.recv(1048576)
        # acquire lock because concurrency is evil
        connHandle.connLock.acquire()

        # do nothing if connection closed
        if connHandle.closedIndicator.isClosed():
            return

        # non-False message sent to connHandle
        if fromServer:
            connHandle.write_message(fromServer)

        # False message means connection closed
        else:
            connHandle.connLock.release()
            connHandle.close()
            return

        # lol what if we didn't do this
        connHandle.connLock.release()

class connectionHandler(websocket.WebSocketHandler):
    def open(self,host):
        print host
        try:
            # Extract hostname and port from arguments
            hostname,port = host.split(';')
        except:
            # If there's a problem, it means that the arguments were invalid
            self.close()
            return
        # Create a lock for this connection
        self.connLock = threading.Lock()
        # Create socket for server
        self.serverConn = socket.socket()
        # Create a closedIndicator object for this connection
        self.closedIndicator = closedIndicator()

        try:
            # Connect to specified server and port
            self.serverConn.connect((hostname,int(port)))
        except:
            # If we can't connect to specified server/port, then terminate the connection.
            self.close()
            return
        # Create the server waiting thread and pass in the closed indicator, lock
        #  and connections.
        # Since it's all in this object, we just pass self.
        threading.Thread(target=serverThread,args=(self,)).start()

    # Message received from client
    def on_message(self,message):
        # Acquire the lock
        self.connLock.acquire()

        # If we've closed the connection, quit
        if self.closedIndicator.isClosed():
            return
        
        # Send message to the server
        try:
            self.serverConn.sendall(message)
        except:
            # In case of error just quit the connection
            self.close()
        
        # Release the lock
        self.connLock.release()

    def on_close(self):
        print "Closing!"
        self.closedIndicator.close()
        self.serverConn.shutdown(socket.SHUT_RDWR)
        self.serverConn.close()
        
application = web.Application([
        (r"/(.*)", connectionHandler),
        ])

# Listen for websocket connections
if __name__ == "__main__":
    application.listen(8889)
    ioloop.IOLoop.instance().start()
