"use strict";
// *************
// PART 1: Lists
// *************
exports.__esModule = true;
exports.removeNots = exports.countLeaves = exports.evaluate = exports.flipAnds = exports.countNodesRecursive = exports.countNodesIterative = exports.sampleTree = exports.removeZeroes = exports.reverse = exports.doubleEachRecursive = exports.doubleEachIterative = exports.snoc = exports.listToString = exports.cons = exports.sampleList = void 0;
// (If you're wondering, the term "cons cell" is traditional functional
// programming terminology for this simple little data structure that represents
// a single "node" in a linked list. The name "cons" historically comes from the
// word "construct", but predates the modern OOP term "constructor".)
// Importantly, both of the fields of a ConsCell are marked readonly, which
// means they cannot be modified after a ConsCell object has been constructed.
// This means our List type is *immutable*: the contents of a List cannot be
// changed after its creation. This may seem odd, depending on your background
// in programming, but we have good reasons for doing this.
// Much of the work we do in this course (and in the field of PL) will carefully
// avoid modifying the data structures that our functions take as input, because
// we may reuse those same data structures in different ways later. Making the
// fields of our "node" types readonly helps ensure that we're doing this
// correctly, and opens up additional ways for the compiler and interpreter to
// automatically make our code run faster.
// TypeScript is a very modern *garbage-collected* language, which means we're
// free to allocate a lot of small objects and trust the garbage collector to
// deal with the cleanup, as long as we're not allocating huge amounts of small
// objects per second. Working with immutable data structures does lead us to do
// a lot of allocations, but it works out fine on the scale that we're concerned
// with in this course, and the optimizations can outweigh the performance costs.
// Let's see how to construct a sample List value by hand. The sampleList
// function below is written as a function so that you can add any test code you
// want to it and drop a breakpoint in it to watch your test code run: whenever
// you click the sampleList button on the assignment page, this sampleList
// function will execute.
// To define a function in TypeScript, we can use the "function" keyword along
// with notation similar to traditional C-like languages, except that the return
// type of the function is written **after** the argument list, separated by a
// colon.
function sampleList() {
    // Mutable variable declarations in TypeScript are written with the "let"
    // keyword, and the type is written **after** the variable name, separated by
    // a colon.
    var list1 = null;
    // To construct a ConsCell, we can use an *object literal*: the fields are
    // initialized between a pair of curly braces. We use the old null value of
    // list1 as the value in "rest" field, which gives us a single-element list.
    list1 = { first: 6, rest: list1 };
    // Immutable variable declarations in TypeScript are written with the "const"
    // keyword, and otherwise have the same notation as mutable declarations. If
    // you're used to Java, these are like "final" variables.
    var list2 = { first: 5, rest: list1 };
    // We can nest object literal notation to define multiple nodes of a list.
    var list3 = {
        first: 4,
        rest: {
            first: 3,
            rest: {
                first: 2,
                rest: list2
            }
        }
    };
    // Finally, we can return an object literal without giving it a name. Object
    // literal syntax is *first-class*: we can use it anywhere that we could use a
    // variable containing an object of the same type.
    return { first: 1, rest: list3 };
}
exports.sampleList = sampleList;
;
// For convenience, here is the traditional "cons" function that adds one "cons
// cell" to the front of a list. Arguments in a TypeScript function are written
// similarly to variable declarations, but without the "let" or "const" keyword.
function cons(newFirst, list) {
    return {
        first: newFirst,
        rest: list
    };
}
exports.cons = cons;
// Note that in the cons function, we **do not modify the input list**: instead,
// we return a **new** list that references the original list. This leaves the
// original list usable for other things outside of the cons function call.
// Here's our first function that does some actual computation with a List: The
// listToString function below is used in generating the string representations
// of lists that you see in the outputs on the assignment page.
function listToString(list) {
    // We start with a mutable string initialized to the empty string.
    var output = "";
    // A for loop can also be written very similar to in a C-like language.
    for (var cur = list; cur != null; cur = cur.rest) {
        // We can access the fields of an object with traditional "dot notation".
        // Number values have a .toString method for converting to string.
        // The += operator appends one string to another.
        output += cur.first.toString();
        // If there's a next element, we want a comma between this element and the
        // next element.
        if (cur.rest != null)
            output += ", ";
    }
    // Finally, we return the output string.
    return output;
}
exports.listToString = listToString;
// The technique of recursion will be very important to us in this course: while
// it will never be **strictly** necessary, it will be the **easiest** way to
// solve many of the problems we encounter.
// The traditional "snoc" function ("cons" backwards) recursively traverses a
// list in order to append a new element to the **end** of the list. Study this
// function carefully, and step through it in the debugger while watching the
// call stack.  This is an example of how we usually compute with immutable data
// structures.
function snoc(newLast, list) {
    if (list == null) {
        // If the input list is empty, then putting newLast at the "end" of it just
        // means returning a single-element list containing newLast. A
        // single-element list is a non-null list with a null "rest" field.
        return {
            first: newLast,
            rest: null
        };
    }
    else {
        // If the input list is nonempty, the output list should have the same first
        // element as the input list, and the rest of the output list should be the
        // rest of the input list with newLast appended at the end.
        var newRest = snoc(newLast, list.rest);
        return {
            first: list.first,
            rest: newRest
        };
    }
}
exports.snoc = snoc;
// For a point of comparison, let's see one function written both iteratively
// (with loops) and recursively. Below, the doubleEeachIterative and
// doubleEachRecursive functions each compute the same result: the output list
// is the same as the input list, but with each list element multiplied by 2.
function doubleEachIterative(list) {
    var output = null;
    // With a loop, we traverse the list left-to-right.
    for (var cur = list; cur != null; cur = cur.rest) {
        // To construct an output list in the same order, we need to append each
        // element to the **end** of the output list with snoc: we construct the
        // list right-to-left, in the **opposite** order that we traverse the input
        // list.
        output = snoc(cur.first * 2, output);
    }
    return output;
}
exports.doubleEachIterative = doubleEachIterative;
function doubleEachRecursive(list) {
    if (list == null) {
        return list;
    }
    else {
        // With recursion, we traverse left-to-right **and** construct the list
        // left-to-right with cons. This turns out to be very convenient when our
        // recursive data structures get more complicated than singly-linked lists.
        var doubledRest = doubleEachRecursive(list.rest);
        return cons(list.first * 2, doubledRest);
    }
}
exports.doubleEachRecursive = doubleEachRecursive;
// ****************
// EXERCISE 1 START
// ****************
// Implement the reverse function so that it returns the reverse of the input
// list.
// For example:
//   input: null (empty list)
//   output: null
//   input: { first: 1, rest: null }
//   output: { first: 1, rest: null }
//   input: { first: 1, rest: { first: 2, rest: { first: 3, rest: null } } }
//   output: { first: 3, rest: { first: 2, rest: { first: 1, rest: null } } }
// Remember, you're **not modifying the input list**, you're returning a **new**
// list. You may use either iteration (loops) or recursion.
// Delete the entire "throw" line below and replace it with your code.
function reverse(list) {
    throw new Error("unimplemented - this one is your job");
}
exports.reverse = reverse;
// **************
// EXERCISE 1 END
// **************
// ****************
// EXERCISE 2 START
// ****************
// Implement the removeZeroes function so that it returns the input list with
// every copy of the number 0 removed.
// For example:
//   input: null (empty list)
//   output: null
//   input: { first: 1, rest: null }
//   output: { first: 1, rest: null }
//   input: { first: 0, rest: null }
//   output: null
//   input: { first: 0, rest: { first: 2, rest: { first: 0, rest: null } } }
//   output: { first: 2, rest: null }
//   input: { first: 1, rest: { first: 2, rest: { first: 0, rest: null } } }
//   output: { first: 1, { rest: { first: 2, rest: null } }
// Again, you're **not modifying the input list**, you're returning a **new**
// list. You may use either iteration (loops) or recursion, but this is a good
// one to practice recursion on.
// Delete the entire "throw" line below and replace it with your code.
function removeZeroes(list) {
    throw new Error("unimplemented - this one is your job");
}
exports.removeZeroes = removeZeroes;
// Let's see how to construct a sample Tree value by hand. The sampleTree
// function below, like the sampleList function, is written as a function so
// that you can add any test code you // want to it and drop a breakpoint in it
// to watch your test code run: whenever you click the sampleTree button on the
// assignment page, this sampleList function will execute.
function sampleTree() {
    // To construct a BoolLeaf, we just write an object literal with the tag
    // "bool" and a Boolean value.
    var tree1 = { tag: "bool", value: true };
    // To construct a NotNode, we write an object literal with the tag "not" and a
    // LogicTree subtree. Note how TypeScript is clever enough to throw a type
    // error at compile time if we use the wrong fields for the tag we choose: for
    // example, with the "not" tag, you'll get an error if you try to define a
    // "value" field instead of a "subtree" field.
    var tree2 = {
        tag: "not",
        subtree: tree1
    };
    // To construct an AndNode, we have to give both a left and right subtree.
    var tree3 = {
        tag: "and",
        leftSubtree: tree1,
        rightSubtree: tree2
    };
    return tree3;
}
exports.sampleTree = sampleTree;
// Here's a function to count the total number of nodes in a LogicTree,
// including AndNodes, NotNodes, and BoolLeafs. This is the iterative version,
// and there's also a recursive version below; note how the recursive version
// doesn't require an extra stack data structure, and is much more
// straightforward as a result.
function countNodesIterative(tree) {
    // We'll do a depth-first traversal of this tree, so we'll use an array as a
    // stack to represent the nodes that we have left to visit. At the start of
    // the algorithm, there is only one node to visit: the root of the input tree.
    // The type LogicTree[] is an array of LogicTrees, and [tree] is a
    // single-element array containing tree.
    var stack = [tree];
    // This will be our running counter of how many nodes we've seen. We haven't
    // quite "seen" the root node yet: that will be handled below.
    var nodeCount = 0;
    // To kick off the main loop, we pop from the stack to get the root node in
    // our top variable. Our stack is *mutable*, even though the trees on it are
    // *immutable*: the pop method **removes** the last element from the stack and
    // returns it.
    var top = stack.pop();
    // If the stack is empty, the value of stack.pop() is equal to null, so this
    // loop continues until there are no more nodes on the stack left to process.
    while (top != null) {
        // If we're here that means top is non-null and we've just "seen" a node by
        // popping it off the stack, so we record that in the counter variable.
        nodeCount++;
        // To work with LogicTree inputs, we can use switch/case statements over the tag
        // field, and TypeScript is again clever enough to know which fields are
        // accessible and inaccessible in each case.
        switch (top.tag) {
            // If we're looking at an "and" node, that gives us two new nodes that we
            // need to visit: the roots of the left and right subtrees. The push
            // method adds a new last element onto the end of our stack.
            case "and":
                stack.push(top.rightSubtree);
                stack.push(top.leftSubtree);
                break;
            // If we're looking at a "not" node, that only gives us one new node that
            // we need to visit: the root of the only subtree.
            case "not":
                stack.push(top.subtree);
                break;
            // If we're looking at a "bool" node, there are no new nodes that we need
            // to visit: there are no subtrees. This case doesn't need to be written
            // down, it's here for illustration.
            case "bool":
                break;
        }
        // Prepare for the next iteration of the loop. If we just processed the last
        // node in the tree, this returns a value equal to null and the loop exits.
        top = stack.pop();
    }
    // Finally, we return the total node count.
    return nodeCount;
}
exports.countNodesIterative = countNodesIterative;
// Here's a recursive version of the countNodesIterative function, to
// demonstrate how recursion makes this kind of function much more
// straightforward. If you don't understand how this works, walk through it in
// the debugger!
function countNodesRecursive(tree) {
    // We'll start with a count of 1 for the root node.
    var nodeCount = 1;
    // Again, we find out which type of LogicTree node we have by checking its
    // tag.
    switch (tree.tag) {
        // If the root of the tree is an "and" node, we count the number of nodes in
        // its left and right subtree and add both sums to our node count.
        case "and":
            nodeCount +=
                countNodesRecursive(tree.leftSubtree) +
                    countNodesRecursive(tree.rightSubtree);
            break;
        // If the root of the tree is a "not" node, we count the number of nodes in
        // its only subtree and add that sum to our node count.
        case "not":
            nodeCount += countNodesRecursive(tree.subtree);
            break;
        // If the root of the tree is a "bool" leaf, the whole tree is just a single
        // leaf, and we already counted 1 for the root node, so there are no more
        // nodes to count. Again, this case doesn't actually need to be written,
        // it's just here for illustration.
        case "bool":
            break;
    }
    // Finally, we return the total count of nodes in the input tree.
    return nodeCount;
}
exports.countNodesRecursive = countNodesRecursive;
// Another example to illustrate an even more common pattern: traversing an
// input tree to transform its structure. The output of this function is almost
// the same as the input tree, but with the operands to every "and" operator
// flipped, so that for example "true && !false" becomes "false && !true". This
// example doesn't come with an iterative version, because it would be a big
// pain to write!
function flipAnds(tree) {
    switch (tree.tag) {
        // If the root is an "and" node, we return a **new** "and" node with the
        // subtree order swapped. Note that we recurse into both of the subtrees, in
        // case we have nested "and" operators in the tree.
        case "and":
            return {
                tag: "and",
                leftSubtree: flipAnds(tree.rightSubtree),
                rightSubtree: flipAnds(tree.leftSubtree)
            };
        // If the root is a "not" node, we have to traverse into the subtree, so we
        // return a **new** "not" node and recurse to produce the new subtree.
        case "not":
            return {
                tag: "not",
                subtree: flipAnds(tree.subtree)
            };
        // If the root is a "bool" leaf, we have no "and"s to flip and no subtrees
        // to traverse into, so we just return the input tree unmodified. Note that
        // this case **is** necessary to write: we have to return something!
        case "bool":
            return tree;
    }
}
exports.flipAnds = flipAnds;
// For one more example and a bit of foreshadowing, the evaluate function
// computes the result of a given LogicTree, since a LogicTree represents an
// expression in Boolean logic. This is our first tiny "interpreter", which is
// only very technically deserving of the name, but it will grow from here!
function evaluate(tree) {
    switch (tree.tag) {
        // If the root is an "and" node, we evaluate both subtrees and take the
        // "AND" of their results.
        case "and":
            return (evaluate(tree.leftSubtree) &&
                evaluate(tree.rightSubtree));
        // If the root is a "not" node, we evaluate its only subtree and take the
        // "NOT" of its result.
        case "not":
            return !evaluate(tree.subtree);
        // If the root is a "bool" node, there are no subtrees to evaluate: we just
        // return its value.
        case "bool":
            return tree.value;
    }
}
exports.evaluate = evaluate;
// ****************
// EXERCISE 3 START
// ****************
// Implement the countLeaves function so that it returns the number of
// **leaves** in the input tree. Only BoolLeaf values are leaves, AndNode and
// NotNode values are not leaves.
// For example:
//   input: true
//   output: 1
//   input: true && false
//   output: 2
//   input: true && !false
//   output: 2
//   input: !(!true && !false) && true
//   output: 3
// Again, you're **not modifying the input tree**, you're returning a **new**
// tree. You may use iteration if you really want to, but it's going to be a
// headache; you should take this as an exercise to practice recursive thinking.
// Delete the entire "throw" line below and replace it with your code.
function countLeaves(tree) {
    throw new Error("unimplemented - this one is your job");
}
exports.countLeaves = countLeaves;
// **************
// EXERCISE 3 END
// **************
// ****************
// EXERCISE 4 START
// ****************
// Implement the removeNots function so that it returns the input tree with each
// "not" node removed.
// For example:
//   input: true
//   output: true
//   input: !true
//   output: true
//   input: !!true
//   output: true
//   input: !(!true && !false) && !!true
//   output: (true && false) && true
// Again, you're **not modifying the input tree**, you're returning a **new**
// tree. You may use iteration if you really want to, but it's going to be a
// headache; you should take this as an exercise to practice recursive thinking.
// Delete the entire "throw" line below and replace it with your code.
function removeNots(tree) {
    throw new Error("unimplemented - this one is your job");
}
exports.removeNots = removeNots;
// **************
// EXERCISE 4 END
// **************
