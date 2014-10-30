var vktl = vktl || {};
vktl.bst = {
    /**
     * Creates a tree node
     *
     * @param key - the key
     * @param value - the value associated with the key
     */
    Node : function(key, value) {
        this.key_ = key;
        this.value_ = value;
        this.left_ = null;
        this.right_ = null;
        this.size_ = 1;
    },

    /**
     * Creates a binary search tree object with a null root
     */
    BinarySearchTree : function() {
        this.root_ = null;
    }
};


/**
 * Inserts a key with its corresponding value into the bst. Updates the value
 * associated with key if the key is already present in the bst.
 *
 * @param key - the key
 * @param value - the value associated with the key
 */
vktl.bst.BinarySearchTree.prototype.insert = function(key, value) {
    this.root_ = this.insertImpl_(this.root_, key, value);
};

vktl.bst.BinarySearchTree.prototype.remove = function(key, value) {
    // TODO Hibbard deletion
};

/**
 * Checks whether or not a key is present in the tree
 *
 * @param key - the key to search in the bst
 * @returns - true if the key is present in the bst, false otherwise
 */
vktl.bst.BinarySearchTree.prototype.containsKey = function(key) {
    var curr = this.root_;

    while (curr !== null) {
        if ( key < curr.key_) {
            curr = curr.left_;
        } else if (key > curr.key_) {
            curr = curr.right_;
        } else {
            return true;
        }
    }
    return false;
};

/**
 * Gets the height of the tree
 *
 * @returns - the height of the bst
 */
vktl.bst.BinarySearchTree.prototype.height_ = function () {
    return this.heightImpl_(this.root_);
};

/**
 * Draws the bst on a canvas
 *
 * @param ctxFg - canvas 2d context for the foreground where the nodes are drawn
 * @param ctxBg - canvas 2d context for the backaground where the tree edges are drawn
 * @param width - width of the canvas
 * @param height - height of the canvas
 */
vktl.bst.BinarySearchTree.prototype.draw = function (ctxFg, ctxBg, width, height, spreadNodes) {
    var minX = width * 0.05;
    var maxX = width - minX;
    var minY = height * 0.05;
    var maxY = height - minY;

    ctxFg.clearRect(0, 0, width, height);
    ctxBg.clearRect(0, 0, width, height);

    ctxFg.strokeStyle = '#000000';
    ctxBg.strokeStyle = '#000000';
    ctxBg.lineWidth = 1.5;


    ctxBg.beginPath();
    this.drawImpl_(ctxFg, ctxBg, this.root_, minX, maxX, minY, (maxY - minY)/this.height_(), spreadNodes);
    ctxBg.closePath();
};

vktl.bst.BinarySearchTree.prototype.drawImpl_ = function (ctxFg, ctxBg, node, xMin, xMax, y, yIncr, spreadNodes) {
    if (node === null) return;

    var xSplit = xMin + (xMax - xMin) * (spreadNodes ? this.sizeWeightedRatio_(node) : 0.5);
    var x = (xMax + xMin) / 2;
    ctxFg.beginPath();
    ctxFg.fillStyle = '#FFFFFF';
    ctxFg.arc(x, y, 11, 0, Math.PI * 2, true);
    ctxFg.fill();
    ctxFg.stroke();
    ctxFg.fillStyle = '#000000';
    ctxFg.font = 'bold 11px sans-serif';

    // the numbers used for positioning the text are a result of guided hit and trial.
    // I need a better way to auto calculate the position based on the font-family and
    // font-size
    ctxFg.fillText(node.key_, x - node.key_.toString().length * 6/2, y + 9/2);
    ctxFg.closePath();

    ctxBg.lineTo(x, y);
    ctxBg.stroke();
    ctxBg.closePath();

    if (node.left_ !== null) {
        ctxBg.beginPath();
        ctxBg.moveTo(x, y);
        this.drawImpl_(ctxFg, ctxBg, node.left_, xMin, xSplit, y + yIncr, yIncr, spreadNodes);
    }

    if (node.right_ !== null) {
        ctxBg.beginPath();
        ctxBg.moveTo(x, y);
        this.drawImpl_(ctxFg, ctxBg, node.right_, xSplit, xMax, y + yIncr, yIncr, spreadNodes);
    }
};

vktl.bst.BinarySearchTree.prototype.sizeWeightedRatio_ = function(node) {
    if (this.nodeSize_(node.left_) == this.nodeSize_(node.right_)) {
        return 0.5;
    }

    // return a non-zero ratio if the left child is null, otherwise subsequent nodes
    // with a null left child will get rendered right on the left bound all one directly
    // under the other vertically
    var alpha = 0.2; return node.left_ === null ? alpha : (this.nodeSize_(node.left_) / this.nodeSize_(node));
};

vktl.bst.BinarySearchTree.prototype.insertImpl_ = function(node, key, value) {
    if (node === null) {
        node = new vktl.bst.Node(key, value);
        return node;
    }

    if (key < node.key_) {
        node.left_ = this.insertImpl_(node.left_, key, value);
    } else if (key > node.key_) {
        node.right_ = this.insertImpl_(node.right_, key, value);
    } else {
        node.value_ = value;
    }

    // fix the node size as the recursion unwinds
    node.size_ = this.nodeSize_(node.left_) + this.nodeSize_(node.right_) + 1;

    return node;
};


vktl.bst.BinarySearchTree.prototype.heightImpl_ = function(node) {
    if (node === null || (node.left_ === null && node.right_ === null)) return 0;
    return Math.max(this.heightImpl_(node.left_), this.heightImpl_(node.right_)) + 1;
};

vktl.bst.BinarySearchTree.prototype.nodeSize_ = function(node) {
    return node === null ? 0 : node.size_;
};
