import socket
import threading

# Starts a server in a specified port and host.
# Loops forever, waiting for connections.
# When it receives a connection, it calls serverFunc in a separate thread.
# serverFunc has to receive as arguments the connection socket and address object.
def startService(port,serviceFunc,host="127.0.0.1"):
    # Try to bind to the port in any of the available interfaces.
    for res in socket.getaddrinfo(host, port, socket.AF_UNSPEC,
                                  socket.SOCK_STREAM, 0, socket.AI_PASSIVE):
        af, socktype, proto, canonname, sa = res
        try:
            s = socket.socket(af, socktype, proto)
        except socket.error as msg:
            s = None
            continue
        try:
            s.bind(sa)
            s.listen(1)
        except socket.error as msg:
            s.close()
            s = None
            continue
        break

    if s is None:
        print 'could not open socket'
        return None

    while True:
        conn, addr = s.accept()
        threading.Thread(target=serviceFunc,args=(conn,addr)).start()

