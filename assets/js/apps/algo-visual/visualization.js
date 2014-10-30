var SIZE_WEIGHTED = true;
var canvasFg = null;
var canvasBg = null;
var ctxFg = null;
var ctxBg = null;
var menuItem = 'bst';

$(document).ready(function() {
    canvasFg = document.getElementById('layerFg');
    canvasBg = document.getElementById('layerBg');

    canvasFg.width = canvasBg.width = canvasFg.offsetWidth;
    canvasFg.height = canvasBg.height = canvasFg.offsetHeight;

    if (canvasFg.getContext) {
        ctxFg = canvasFg.getContext('2d');
        ctxBg = canvasBg.getContext('2d');

        ctxFg.lineWidth = 1.5;
        ctxBg.lineWidth = 1.5;

        updateHeading(menuItem);
        wireUpControls(menuItem);
        var tree = generateRandomTree(createEmptyTree());
        tree.draw(ctxFg, ctxBg, canvasFg.width, canvasFg.height, SIZE_WEIGHTED);
    } else {
        $('#message').show();
        return;
    }

    $('.menuItem').click(function() {
        menuItem = $(this).attr('id');
        updateHeading(menuItem);
        wireUpControls(menuItem);
        //clearCanvas();
        var tree = null;
        if (menuItem === 'bst' || menuItem === 'rbt' || menuItem === '23t') {
            if ($('#treeKeys').val() === '') {
                tree = generateRandomTree(createEmptyTree());
            } else {
                tree = generateTreeFromInput(createEmptyTree(), $('#treeKeys').val());
            }
            tree.draw(ctxFg, ctxBg, canvasFg.width, canvasFg.height, SIZE_WEIGHTED);
        }
    });

});

function updateHeading (menuItem) {
    if (menuItem === 'bst') {
        $('#heading').text('Binary Search Tree');
    } else if (menuItem === 'rbt') {
        $('#heading').text('Left Leaning Red Black BST');
    } else if (menuItem === '23t') {
        $('#heading').text('2-3 Tree');
    }
}

function wireUpControls() {
    // $('#treeKeysWrapper').slideUp();
    createEmptyTree();

    $('#treeKeys').keyup(function(event) {
        var tree = generateTreeFromInput(createEmptyTree(), $(this).val());
        tree.draw(ctxFg, ctxBg, canvasFg.width, canvasFg.height, SIZE_WEIGHTED);
    });

    $('#manualInput').click(function() {
        $('#treeKeysWrapper').slideDown();
        $('#treeKeys').val('').focus();
        var tree = createEmptyTree();
        tree.draw(ctxFg, ctxBg, canvasFg.width, canvasFg.height, SIZE_WEIGHTED);
    });

    $('#reset').click(function() {
        var tree = generateRandomTree(createEmptyTree());
        tree.draw(ctxFg, ctxBg, canvasFg.width, canvasFg.height, SIZE_WEIGHTED);
    });

    $('#as23Tree').click(function() {
        var tree = generateTreeFromInput(createEmptyTree(), $('#treeKeys').val());
        tree.draw(ctxFg, ctxBg, canvasFg.width, canvasFg.height, SIZE_WEIGHTED);
    });
}

function generateTreeFromInput(tree, input) {
    var keys = input.split(' ');
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] !== null & keys[i].length > 0) {
            tree.insert(parseInt(keys[i], 10), parseInt(keys[i], 10));
        }
    }
    return tree;
}

function generateRandomTree(tree) {
    var input = generateRandomArray(48, 0, 150);
    var text = '';
    for(var i = 0; i < input.length; i++) {
        text += input[i] + ' ';
        tree.insert(input[i], input[i]);
    }
    $('#treeKeys').val(text);

    return tree;
}

function createEmptyTree() {
    if (menuItem === 'bst') {
        return new vktl.bst.BinarySearchTree();
    } else if (menuItem === 'rbt') {
        return new vktl.rbt.RedBlackTree();
    } else if (menuItem === '23t') {
        var tree = new vktl.rbt.RedBlackTree();
        tree.renderAs23Tree = true;
        return tree;
    }
    return null;
}

function generateRandomArray(size, lo, hi) {
    var arr = [];
    for (var i = 0; i < size; i++) {
        arr.push((Math.floor(Math.random() * (hi - lo + 1)) + lo));
    }
    return arr;
}
