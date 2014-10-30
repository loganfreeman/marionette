var vktl = vktl || {};
vktl.rbt = {
    RED : 0,
    BLACK : 1,
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
        this.color_ = vktl.rbt.RED;

        this.size_ = 1;
    },

    /**
     * Creates a left leaning red black tree object with a null root
     */
    RedBlackTree : function() {
        this.root_ = null;
        this.renderAs23Tree = false;
    }
};

/**
 * Inserts a key, value pair into the tree. If the key already exist in the
 * tree then the value corresponding to the key is updated.
 *
 * @param key - the key
 * @param value - the value associated with the key
 */
vktl.rbt.RedBlackTree.prototype.insert = function (key, value) {
    this.root_ = this.insertImpl_(this.root_, key, value);
    this.root_.color_ = vktl.rbt.BLACK;
};

/**
 * Retrieves the value associated with the passed key
 *
 * @param key - the key to fetch the value for
 * @returns - the value associated with the passed key if the key exists in
 * the tree, null otherwise
 */
vktl.rbt.RedBlackTree.prototype.getValue = function(key) {
    var node = this.root_;
    while(node !== null) {
        if (key === node.key_) {
            return node.value_;
        } else if (key < node.key_) {
            node = node.left_;
        } else {
            node = node.right_;
        }
    }
    return null;
};

vktl.rbt.RedBlackTree.prototype.remove = function(key) {
    // TODO top down 2-3-4 deletion
};

/**
 * Tells whether or not a key is present in the the tree
 * @param key - the key to look for
 * @returns true if the key is found in the tree, false otherwise
 */
vktl.rbt.RedBlackTree.prototype.containsKey = function(key) {
    var node = this.root_;
    while (node !== null) {
        if (node.key_ === key) {
            return true;
        } else if (key < node.key_) {
            node = node.left_;
        } else {
            node = node.right_;
        }
    }
    return false;
};

vktl.rbt.RedBlackTree.prototype.insertImpl_ = function(node, key, value) {
    if (node === null) {
        return new vktl.rbt.Node(key, value);
    }

    if (key === node.key_) {
        node.value_ = value;
    } else if (key < node.key_) {
        node.left_ = this.insertImpl_(node.left_, key, value);
    } else if (key > node.key_) {
        node.right_ = this.insertImpl_(node.right_, key, value);
    }

    if (this.isRed_(node.right_) && !this.isRed_(node.left_)) {
        node = this.rotateLeft_(node);
    }
    if (this.isRed_(node.left_) && this.isRed_(node.left_.left_)) {
        node = this.rotateRight_(node);
    }
    if (this.isRed_(node.left_) && this.isRed_(node.right_)) {
        this.flipColors_(node);
    }
    node.size_ = this.sizeImpl_(node.left_) + this.sizeImpl_(node.right_) + 1;
    return node;
};

vktl.rbt.RedBlackTree.prototype.rotateLeft_ = function(node) {
    var x = node.right_;
    node.right_ = x.left_;
    x.left_ = node;
    x.color_ = node.color_;
    node.color_ = vktl.rbt.RED;
    x.size_ = node.size_;

    node.size_ = this.sizeImpl_(node.left_) + this.sizeImpl_(node.right_) + 1;
    return x;
};

vktl.rbt.RedBlackTree.prototype.rotateRight_ = function(node) {
    var x = node.left_;
    node.left_ = x.right_;
    x.right_ = node;
    x.color_ = node.color_;
    node.color_= vktl.rbt.RED;
    x.size_ = node.size_;

    node.size_ = this.sizeImpl_(node.left_) + this.sizeImpl_(node.right_) + 1;
    return x;
};

vktl.rbt.RedBlackTree.prototype.flipColors_ = function(node) {
    node.left_.color_ = vktl.rbt.BLACK;
    node.right_.color_ = vktl.rbt.BLACK;
    node.color_ = vktl.rbt.RED;
};

vktl.rbt.RedBlackTree.prototype.sizeImpl_ = function(node) {
    return node === null ? 0 : node.size_;
};

vktl.rbt.RedBlackTree.prototype.height_ = function() {
    return this.heightImpl_(this.root_);
};

vktl.rbt.RedBlackTree.prototype.heightImpl_ = function (node) {
    // leaf node has '0' height
    if (node === null || (node.left_ === null && node.right_ === null)) return 0;
    return Math.max(this.heightImpl_(node.left_), this.heightImpl_(node.right_)) + 1;
};

vktl.rbt.RedBlackTree.prototype.blackHeight_ = function() {
    return this.blackHeightImpl_(this.root_);
};

vktl.rbt.RedBlackTree.prototype.blackHeightImpl_ = function(node) {
    // a leaf node has '0' height and the red node should not contribute to the black height of the tree
    if (node === null || ((this.isRed_(node.left_) || node.left_ === null) && node.right_ === null)) return 0;
    return Math.max(this.blackHeightImpl_(node.left_),this.blackHeightImpl_(node.right_)) + (this.isRed_(node) ? 0 : 1);
};

vktl.rbt.RedBlackTree.prototype.isRed_ = function (node) {
    return node === null ? false : vktl.rbt.RED === node.color_;
};

/**
 * Draws the bst on a canvas
 *
 * @param ctxFg - canvas 2d context for the foreground where the nodes are drawn
 * @param ctxBg - canvas 2d context for the backaground where the tree edges are drawn
 * @param width - width of the canvas
 * @param height - height of the canvas
 */
vktl.rbt.RedBlackTree.prototype.draw = function (ctxFg, ctxBg, width, height, spreadNodes) {
    var padding = 20;

    var minX = padding;
    var maxX = width - padding;
    var minY = padding;
    var maxY = height - padding;

    ctxFg.clearRect(0, 0, width, height);
    ctxBg.clearRect(0, 0, width, height);
    ctxBg.beginPath();
    var yIncr = (maxY - minY) / (this.renderAs23Tree ? this.blackHeight_() : this.height_());
    this.drawImpl_(ctxFg, ctxBg, this.root_, minX, maxX, minY, yIncr, spreadNodes);
    ctxBg.closePath();
};

vktl.rbt.RedBlackTree.prototype.drawImpl_ = function(ctxFg, ctxBg, node, xMin, xMax, y, yIncr, spreadNodes) {
    if (node === null) return;

    var x = (xMax + xMin) / 2;
    ctxFg.beginPath();
    ctxFg.fillStyle = '#FFFFFF';
    ctxFg.strokeStyle = this.isRed_(node) ? '#E02D00' : '#000000';
    var radius = 11;
    if (this.renderAs23Tree && this.isThreeNode_(node)) {
        // left arc from bottom to top clockwise
        ctxFg.arc(x - radius, y, radius, Math.PI * 3/2, Math.PI/2,  true);
        // right arc from top to bottom clockwise
        ctxFg.arc(x + radius, y, radius, Math.PI/2, Math.PI * 3/2,  true);
        // close the top of the round rectangle
        ctxFg.lineTo(x - radius, y - radius);
    } else {
        ctxFg.arc(x, y, radius, 0, Math.PI * 2, true);
    }
    ctxFg.fill();
    ctxFg.stroke();
    ctxFg.fillStyle = '#000000';
    ctxFg.font = 'bold 11px sans-serif';

    // the numbers used for positioning the text are a result of guided hit and trial.
    // I need a better way to auto calculate the position based on the font-family and
    // font-size
    if (this.renderAs23Tree && this.isThreeNode_(node)) {
        ctxFg.fillText(node.left_.key_, x - radius - node.left_.key_.toString().length * 6/2, y + 9/2);
        ctxFg.fillText(node.key_, x + radius - node.key_.toString().length * 6/2, y + 9/2);
    } else {
        ctxFg.fillText(node.key_, x - node.key_.toString().length * 6/2, y + 9/2);
    }
    ctxFg.closePath();

    ctxBg.strokeStyle = this.isRed_(node) ? '#E02D00' : '#000000';
    ctxBg.lineWidth = this.isRed_(node) ? 3 : 1.5;
    ctxBg.lineTo(x, y);
    ctxBg.stroke();
    ctxBg.closePath();

    if (this.renderAs23Tree && this.isThreeNode_(node))  {
        // allocate space to the three subtrees based on their relative sizes
        // ratio = subtree_size / (sub_tree_1_size + sub_tree_2_size + sub_tree_3_size)
        // Since the parent is a 2-3 node with 2 nodes in it, if we deduct 2 from the parent node's size
        // we'll get the sum of all the three sub trees.
        // Therefore: ratio = subtree_size / (parent_23_node_size - 2)
        var xSplit1 = xMin + (xMax - xMin) * (node.left_.left_ === null ? 0 : this.sizeImpl_(node.left_.left_)/(this.sizeImpl_(node) - 2));
        var xSplit2 = xSplit1 + (xMax - xMin) * (node.left_.right_ === null ? 0 : this.sizeImpl_(node.left_.right_)/(this.sizeImpl_(node) - 2));

        if (node.left_.left_ !== null) {
            ctxBg.beginPath();
            ctxBg.moveTo(x, y);
            this.drawImpl_(ctxFg, ctxBg, node.left_.left_, xMin, xSplit1, y + yIncr, yIncr, spreadNodes);
        }

        if (node.left_.right_ !== null) {
            ctxBg.beginPath();
            ctxBg.moveTo(x, y);
            this.drawImpl_(ctxFg, ctxBg, node.left_.right_, xSplit1, xSplit2, y + yIncr, yIncr, spreadNodes);
        }

        if (node.right_ !== null) {
            ctxBg.beginPath();
            ctxBg.moveTo(x, y);
            this.drawImpl_(ctxFg, ctxBg, node.right_, xSplit2, xMax, y + yIncr, yIncr, spreadNodes);
        }
    } else {
        var xSplit = xMin + (xMax - xMin) * (spreadNodes ? this.sizeWeightedRatio_(node) : 0.5);
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
    }
};

vktl.rbt.RedBlackTree.prototype.isThreeNode_ = function (node) {
    return this.isRed_(node.left_);
};

vktl.rbt.RedBlackTree.prototype.sizeWeightedRatio_ = function(node) {
    if (this.sizeImpl_(node.left_) == this.sizeImpl_(node.right_)) {
        return 0.5;
    }

    // return a non-zero ratio if the left child is null, otherwise subsequent nodes
    // with a null left child will get rendered right on the left bound all one directly
    // under the other vertically
    var alpha = 0.2; return node.left_ === null ? alpha : (this.sizeImpl_(node.left_) / this.sizeImpl_(node));
};
