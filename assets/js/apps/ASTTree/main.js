require([
    'apps/ASTTree/runner',
    'apps/ASTTree/drawtree',
    'apps/ASTTree/tree',
    'knockout',
    'codemirror',
    'javascript',
    'zepto'
], function(runner, draw, tree, ko) {
    var editor;
    var view = {};
    var steps;

    var currentLine = null;

    view.didRun = ko.observable(false);

    view.curStep = ko.observable(-1);
    view.curStep.subscribe(function(oldStep) {
        if (currentLine) {
            editor.removeLineClass(currentLine, 'background', 'current-step');
            currentLine = null;
        }
    }, null, 'beforeChange');
    view.curStep.subscribe(function(newStep) {
        var step = steps[newStep - 1];
        var line = step.line - 1;

        currentLine = editor.getLineHandle(line);
        if (currentLine) {
            editor.addLineClass(currentLine, 'background', 'current-step');
            editor.scrollIntoView({line: line, ch: 0}, 50 /* margin */);
        }

        // TODO show current variable values

        draw.clear();
        _.each(step.trees, function(root) {
            draw.drawTree(root);
        });

        _.each(step.scope, function(value, key) {
            if (value instanceof tree.TreeNodePointer) {
                draw.addLabelToNode(key, value.nodeId);
            }
        });
    });
    view.numSteps = ko.observable(0);

    view.run = function() {
        var code = editor.getValue();
        try {
            runner.run(code, function(_steps) {
                if (_steps.length === 0) return;
                steps = _steps;
                view.didRun(true);
                view.curStep(1);
                view.numSteps(steps.length);
            });
        } catch (e) {
            if (e instanceof SyntaxError) {
                // TODO show syntax errors in the editor
                alert(e);
            } else {
                throw e;
            }
        }
    };

    view.stepNext = function() {
        var curStep = view.curStep();
        if (curStep < view.numSteps()) {
            view.curStep(++curStep);
        }
    };

    view.stepPrev = function() {
        var curStep = view.curStep();
        if (curStep > 1) {
            view.curStep(--curStep);
        }
    };

    ko.applyBindings(view);

    // Startup
    $(function() {
        draw.attachToElement($('#tree-container')[0]);

        editor = CodeMirror.fromTextArea($('#code-editor')[0], {
            lineNumbers: true,
            mode: 'javascript'
        });
        
        // CodeMirror.commands["selectAll"](editor);
        
        function getSelectedRange() {
            return { from: editor.getCursor(true), to: editor.getCursor(false) };
        }
        
        function autoFormatSelection() {
            var range = getSelectedRange();
            editor.autoFormatRange(range.from, range.to);
        }
        
        // autoFormatSelection();
        
        editor.on('change', function() {
            // hide the Prev/Next buttons for now
            // TODO automatically re-run the new code up to the current step?
            view.didRun(false);
            if (currentLine) {
                editor.removeLineClass(currentLine, 'background', 'current-step');
                currentLine = null;
            }
        });

        editor.focus();

        $('.loading').hide();

    });
});
