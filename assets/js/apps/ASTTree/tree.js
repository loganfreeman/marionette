define(function(require, exports) {
    var _ = require('lodash');

    var lastId = 0;

    var TreeNode = function(value, left, right) {
        if (!(this instanceof TreeNode)) {
            return new TreeNode(value, left, right);
        }

        // immutable and unique id
        var id = lastId++;
        this.__id = function() { return id; };

        this.value = value;
        this.left = null;
        this.right = null;
        this.parent = null;

        if (left) this.setLeft(left);
        if (right) this.setRight(right);
    };

    TreeNode.prototype.setLeft = function(node) {
        if (node) {
            node.parent = this;
            this.left = node;
        } else {
            this.left = null;
        }
    };

    TreeNode.prototype.setRight = function(node) {
        if (node) {
            node.parent = this;
            this.right = node;
        } else {
            this.right = null;
        }
    };

    /**
     * Given a list representing a binary tree, returns the root TreeNode
     * of the tree.
     *
     * Example: buildTree([5, [3, [1], [2]], [6]]) gives the following tree:
     *              5
     *          /       \
     *      3               6
     *   /     \
     *  1       2
     */
    var buildTree = function(list) {
        if (!list) return null;
        if (!_.isArray(list)) return new TreeNode(list);
        return new TreeNode(list[0],
                            buildTree(list[1]),
                            buildTree(list[2]));
    };

    var CloneNode = function(node) {
        var id = node.__id();
        this.__id = function() { return id; };
        this.value = node.value;
    };

    /**
     * A FrozenTree represents a tree at an instance in time.
     * It is created by passing in a TreeNode which is the root
     * of the tree that needs to be preserved.
     */
    var FrozenTree = function(root) {
        var self = this;

        // keep track of nodes we've cloned in case there's a cycle
        var nodes = {};

        var cloneNode = function(node) {
            if (!node) {
                return null;
            }

            if (nodes[node.__id()]) {
                return nodes[node.__id()]; // we already cloned this node
            }

            var clone = new CloneNode(node);
            nodes[node.__id()] = clone;
            clone.left = cloneNode(node.left);
            clone.right = cloneNode(node.right);

            return clone;
        };

        this.root = cloneNode(root);
    };

    var TreeNodePointer = function(nodeId) {
        this.nodeId = nodeId;
    };

    exports.FrozenTree = FrozenTree;
    exports.TreeNodePointer = TreeNodePointer;

    // global exports
    exports.buildTree = window.buildTree = buildTree;
    exports.TreeNode = window.TreeNode = TreeNode;
});
