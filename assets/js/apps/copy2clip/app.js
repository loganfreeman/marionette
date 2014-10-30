define([ 'app', 'stache!apps/copy2clip/main', 'css!apps/copy2clip/style' , 'popage', 'jcollapse.cookie_storage'], function(App, viewTpl) {
	App.module('copy2clip', function(copy2clip, App, Backbone, Marionette, $, _) {

		function copy(str) {
			// for IE ONLY!
			window.clipboardData.setData('Text', str);
		}

		function copyToClipboard(text) {
			if (window.clipboardData) // Internet Explorer
			{
				window.clipboardData.setData("Text", text);
			} else {
				window.prompt("Copy to clipboard: Ctrl+C, Enter", text);

			}
		}

		copy2clip.MainView = Marionette.ItemView.extend({
			template : viewTpl,
			events : {
				'click a#d_clip_button_0' : 'copy',
				'click a#code-plain-btn' : 'plain'
			},
			copy : function() {
				alert($('#code_d_clip_button_0').text());
				copyToClipboard($('#code_d_clip_button_0').text());
			},
			plain: function(){
				window.parent.popage('width',200);
			},
			onShow : function() {
		        $("#css3-animated-example").collapse({
		            accordion: true,
		            open: function() {
		              this.addClass("open");
		              this.css({ height: this.children().outerHeight() });
		            },
		            close: function() {
		              this.css({ height: "0px" });
		              this.removeClass("open");
		            }
		          });
			} // End of OnShow
		});

		copy2clip.controller = {
			show : function() {
				App.navigate("copy2clip");
				App.mainRegion.show(new copy2clip.MainView());
			}
		}

		App.on("copy2clip:show", function() {
			copy2clip.controller.show();
		});

		copy2clip.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"copy2clip" : "show"
			}
		});

		App.addInitializer(function() {
			new copy2clip.Router({
				controller : copy2clip.controller
			});
		});
	});
	return App.copy2clip.controller;
})