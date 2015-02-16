from __future__ import print_function
from alchemyapi import AlchemyAPI
import json

class node:
    count = 0
    def __init__(self, name, keywords = set([]), content = ' ', parents = [], children = []):
        self.content = content
        self.ID = self.count
        node.count = node.count+1
        self.name = name
        
        self.parents = {}
        self.children = {}
        for parent in parents:
            self.addParent(parent)
        for child in children:
            self.addChild(child)

        self.keywords = keywords
	self.setKeywords()
        #self.writeFile()

       
    def __str__ (self):
        return self.name

    def __repr__ (self):
        return self.__str__()

    def getName(self):
        return self.name
    
    def getParents(self):
        return self.parents

    def getChildren(self):
        return self.children

    def addParent(self, parent):
        if parent.ID not in self.parents:
            self.parents[parent.ID] = parent
            parent.addChild(self)
            if checkPath(parent):
                self.removeParent(parent)
	#self.writeFile()

    def addChild(self, child):
        if child.ID not in self.children:
            self.children[child.ID] = child
            child.addParent(self)
            if checkPath(self):
                self.removeChild(child)
        #self.writeFile()

    def getContent(self):
        return self.content

    def getKeywords(self):
        return self.keywords

    def setKeywords(self):
        alchemyapi = AlchemyAPI()
        response = alchemyapi.keywords('text',self.content, { 'sentiment':1 })
	if response['status'] == 'OK':
		for keyword in response['keywords']:
		    self.keywords.add(keyword['text'].encode('ascii','ignore'))
	else:
		print('Error in concept tagging call: ', response['statusInfo'])
		self.keywords = set(["Automatic keyword generation failed"])
	response = alchemyapi.concepts('text',self.content, { 'sentiment':1 })
	if response['status'] == 'OK':
		for keyword in response['concepts']:
		    self.keywords.add(keyword['text'].encode('ascii','ignore'))
	else:
		print('Error in concept tagging call: ', response['statusInfo'])
		self.keywords = set(["Automatic keyword generation failed"])
	#self.writeFile()
      
    #def writeFile(self):
        #f = open('web/topics/' + self.name + '.html', 'w')
        #f.write("<html><head><title>Tree of Knowledge: " + self.name.title() + "</title></head><body><h1>" + self.name.title() + "</h1><br><br>" + self.content + "</body></html>")
        #f.close()

    def editContent(self, newContent):
        self.content = newContent
        self.setKeywords()
	#self.writeFile()

    def removeParent(self, oldParent):
        if oldParent.ID in self.parents:
            del self.parents[oldParent.ID]
            oldParent.removeChild(self)
        #self.writeFile()

    def removeChild(self, oldChild):
        if oldChild.ID in self.children:
            del self.children[oldChild.ID]
            oldChild.removeParent(self)
       # self.writeFile()

    def __hash__(self):
        return self.ID
        
    def deleteConnections(self):
        for i in self.parents.values():
            self.removeParent(i)
        for i in self.children.values():
            self.removeChild(i)
        
seen = {}

def checkPath( source):
    seen = {}
    #print seen
    #print "CHECK", source.name
    if len(source.children) != 0:
        for i in source.children.values():
            if DFS(i, source) == True:
                return True
    return False

def DFS(current, goal):
    #print current.name, goal.name
    if current.ID == goal.ID:
        #print "Cycle Found"
        return True
    if len(current.children) != 0:
        for o in current.children.values():
            if not( o.ID in seen):
                seen[o.ID] = o
                if DFS(o, goal):
                    return True
    return False
    
