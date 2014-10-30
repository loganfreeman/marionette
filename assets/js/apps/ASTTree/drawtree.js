define(function(require, exports) {
    var _ = require('lodash');
    var tree = require('apps/ASTTree/tree');
    var svg = require('svg');

    var nodeRadius = 15;
    var fontSize = 18;

    var ctx;
    var drawnNodes = {}; // maps node ID to svg group for that node

    var FakeGroup = function(x, y, width, height) {
        this.bbox = function() {
            return {x: x, y: y, width: width, height: height};
        };
    };

    exports.attachToElement = function(element) {
        ctx = svg(element);
    };

    exports.clear = function() {
        drawnNodes = {};
        ctx.clear();
    };

    exports.drawTree = function(frozenTree) {
        if (!ctx) throw new Error('Attach to element before drawing');

        var viewWidth = ctx.viewbox().width;

        var drawNode = function(node, depth, x, y, parentx, parenty) {
            if (!node) return;

            var existing = drawnNodes[node.__id()];
            if (existing) {
                // we already drew this node, so draw another line to its edge
                var box = existing.bbox();
                x = box.x + box.width / 2;
                y = box.y + box.height / 2;
                var xdiff = parentx - x;
                var ydiff = parenty - y;
                var totaldiff = Math.abs(xdiff) + Math.abs(ydiff) + 0.0001;
                var xoffset = xdiff / totaldiff * nodeRadius;
                var yoffset = ydiff / totaldiff * nodeRadius;
                ctx.line(x + xoffset, y + yoffset, parentx, parenty)
                   .attr('class', 'duplicate-pointer');
                return;
            }

            if (parentx !== null && parenty !== null) {
                ctx.line(x, y, parentx, parenty);
            }

            // xxx hacky fix to deal with the case that this node appears
            // in its own subtree.
            var placeholder = new FakeGroup(x, y, nodeRadius*2, nodeRadius*2);
            drawnNodes[node.__id()] = placeholder;

            var dx = (viewWidth - 100) / Math.pow(2, depth + 2);
            var dy = 75;
            drawNode(node.left,  depth + 1, x - dx, y + dy, x, y);
            drawNode(node.right, depth + 1, x + dx, y + dy, x, y);

            var group = ctx.group();
            drawnNodes[node.__id()] = group;
            group.circle(nodeRadius*2).center(x, y).attr('class', 'tree-node');
            var label = group.text(String(node.value)).attr('class', 'tree-node');
            label.font({ size: (fontSize * Math.min(25 / label.bbox().width, 1))});
            label.center(x, y - label.bbox().height / 4);

        };

        drawNode(frozenTree.root, 0, viewWidth / 2, 40, null, null);
    };

    exports.addLabelToNode = function(text, nodeId) {
        if (!ctx) throw new Error('Attach to element before drawing');

        var node = drawnNodes[nodeId];
        if (!node) throw new Error("Can't add label to node: it doesn't exit");

        var nodeBox = node.bbox();

        var group = ctx.group().attr('class', 'variable-label');

        var label = group.text(text).attr('class', 'variable-label');
        var labelBox = label.bbox();
        label.center(nodeBox.x - labelBox.width / 2 - 10,
                     nodeBox.y + labelBox.height / 3);
    };
});
