/**
 * jQuery.collapsible
 *
 * When you designate a <fieldset> as collapsible, it's <legend> will become
 * a clickable toggle for expanding/collapsing the the fieldset.
 *
 * If a theme roller stylesheet is loaded, and the arrow property has not been set
 * to false, an arrow icon will appear beside the collapsible labels. The arrow
 * will point in for collapsed and down for expanded, as is UI convention.
 *
 * The only other CSS used is injected by the plugin and uses the class names:
 *  - collapsible-collapsed
 *  - collapsible-collapsible
 *
 * @author Ryan Graham, inspired by Michael Irwin's collapse plugin
 *
 */

(function ($, global) {
    "use strict";
    // check/cache json2css from/for another plugin
    global.json2css = global.json2css ||
    function (obj) {
        var str = [];
        for (var c in obj) {
            if (obj.hasOwnProperty(c)) {
                str.push(c + " {");
                for (var f in obj[c]) {
                    if (obj[c].hasOwnProperty(f)) {
                        str.push("    " + f + ": " + obj[c][f] + ";");
                    }
                }
                str.push("}");
            }
        }
        return str.join("\n");
    };
    $.fn.collapsible = $.fn.collapsible || (function () {
        var defaults = {
            collapsed: false,
            arrow: true
        };
        var css = {
            "fieldset.collapsible-collapsed *": {
                "display": "none"
            },
            "fieldset.collapsible-collapsible legend, fieldset.collapsible-collapsed legend": {
                "display": "block",
                "cursor": "pointer"
            }
        };
        $("<style>", {
            text: global.json2css(css)
        }).appendTo("head");
        return function (options) {
            options = $.extend({}, defaults, options);
            return this.each(function () {
                var obj = $(this),
                    oldCSS = {
                    "margin-left": obj.css("margin-left"),
                    "border-left-width": obj.css("border-left-width"),
                    "border-right-width": obj.css("border-right-width"),
                    "border-top-width": obj.css("border-top-width"),
                    "border-bottom-width": obj.css("border-bottom-width")
                },
                    newCSS = {
                    "margin-left": parseInt(oldCSS["margin-left"], 10) + parseInt(oldCSS["border-left-width"], 10),
                    "border-left-width": "0",
                    "border-right-width": "0",
                    "border-top-width": "1px",
                    "border-bottom-width": "0"
                },
                    legend = obj.children("legend:first");
                var arrow = options.arrow && $("<span>", {
                    "style": 'display: inline-block',
                    "class": 'ui-icon ui-icon-triangle-1-s'
                }).prependTo(legend);
                obj.addClass('collapsible');
                legend.click(function () {
                    obj.toggleClass('collapsible-collapsed collapsible-collapsible');
                    if (arrow) {
                        arrow.toggleClass("ui-icon-triangle-1-s ui-icon-triangle-1-e");
                    }
                    if (obj.hasClass('collapsible-collapsed')) {
                        obj.css(newCSS);
                    } else {
                        obj.css(oldCSS);
                    }
                });
                if (options.collapsed) {
                    legend.click();
                }
            });
        };
    }());
}(jQuery, window));