from node import node
from Tree import *

addNode("Root", 'Root' , set(["root", "first"]))
print "ROOT ADDED"

for i in Tree.values():
    print i.name, i.keywords, i.parents, i.children

    addNode("child", 'Child', set(["child", "first"]), ([findNode("Root")]))

print "LEAF added"
for i in Tree.values():
    print i.name, i.keywords, i.parents, i.children

print "\nSearch for first root"
print  searchNode( "first root")


addNode("ASD", "Banan", set(["mock"]) , [Tree[(searchNode("child")['content'][0]['ID'])]])

print Tree

print "\nDelete second node"
deleteNode(1)
print Tree
for i in Tree.values():
    print i.name, i.keywords, i.parents, i.children

print "\nAdd connection 1,3"
addEdge(0,2)
print "\nAdd connection 0,20"
addEdge(0,20)

print Tree
for i in Tree.values():
    print i.name, i.keywords, i.parents, i.children

print "\nTry to Add loop"
addNode("Loop",  "Looping", set(["loop"]), [Tree[(searchNode('mock')['content'][0]['ID'])]], [Tree[(searchNode('root')['content'][0]['ID'])]])

print Tree

for i in Tree.values():
    print i.name, i.keywords, i.parents, i.children


testcontent = 'Calculus is the mathematical study of change, in the same way that geometry is the study of shape and algebra is the study of operations and their application to solving equations. It has two major branches, differential calculus (concerning rates of change and slopes of curves), and integral calculus (concerning accumulation of quantities and the areas under curves); these two branches are related to each other by the fundamental theorem of calculus. Both branches make use of the fundamental notions of convergence of infinite sequences and infinite series to a well-defined limit. Generally considered to have been founded in the 17th century by Isaac Newton and Gottfried Leibniz, today calculus has widespread uses in science, engineering and economics and can solve many problems that algebra alone cannot.  Calculus is a major part of modern mathematics education. A course in calculus is a gateway to other, more advanced courses in mathematics devoted to the study of functions and limits, broadly called mathematical analysis.  Calculus has historically been called "the calculus of infinitesimals", or "infinitesimal calculus". The word "calculus" comes from Latin (calculus) and refers to a small stone used for counting. More generally, calculus (plural calculi) refers to any method or system of calculation guided by the symbolic manipulation of expressions. Some examples of other well-known calculi are propositional calculus, calculus of variations, lambda calculus, and process calculus.'

for i in Tree.values():
  i.editContent(testcontent)
  i.setKeywords()
  print i.getKeywords()

print "Finished"
