define([ 'app', 'stache!apps/textcomplete/view', 'css!apps/textcomplete/style', 'jquery.textcomplete', 'jquery.overlay', 'shCore' ], function(App, viewTpl) {
	App.module('textcomplete', function(textcomplete, App, Backbone, Marionette, $, _) {

		var setText = function($textarea, text) {
			var range, textarea = $textarea.get(0);
			textarea.focus();
			if (typeof textarea.selectionStart === 'number') {
				textarea.value = text;
				textarea.selectionStart = textarea.selectionEnd = text.length;
				return;
			}
			range = textarea.createTextRange();
			range.text = text
			range.select();
		}

		textcomplete.MainView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow : function() {
				$('.script').each(function() {
					eval($(this).text());
				});
				var $textarea = $('#textarea1');
				var textarea = $textarea.get(0);
				$textarea.focus();
				if (typeof textarea.selectionStart === 'number') {
					textarea.selectionStart = textarea.selectionEnd = $textarea.val().length;
				} else {
					var range = textarea.createTextRange();
					range.select();
				}
				$textarea.keyup();

				SyntaxHighlighter.all();
				prettyPrint();
			}
		});

		textcomplete.controller = {
			show : function() {
				App.navigate("textcomplete");
				App.mainRegion.show(new textcomplete.MainView());
			}
		}

		App.on("textcomplete:show", function() {
			textcomplete.controller.show();
		});

		textcomplete.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"textcomplete" : "show"
			}
		});

		App.addInitializer(function() {
			new textcomplete.Router({
				controller : textcomplete.controller
			});
		});
	});
	return App.textcomplete.controller;
})