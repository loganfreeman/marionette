define([ 'app' , 'stache!apps/youtube/main', 'css!apps/youtube/style', 
         'jquery.youtube'
         ], function(App, mainTpl) {
	App.module('YouTube', function(YouTube, App, Backbone, Marionette, $, _) {

		YouTube.MainView = Marionette.ItemView.extend({
			template : mainTpl,
			ui:{
				player : '#player',
				form: '#form',
				url: '#url'
			},
			events:{
				'submit #form': 'setUrl'
			},
			setUrl: function(){
				this.ui.player.youTubeEmbed(this.ui.url.val());
				this.ui.url.val('');
			},
			onShow: function(){
				this.ui.player.youTubeEmbed("http://www.youtube.com/watch?v=0NcJ_63z-mA")
				.youTubeEmbed('http://www.youtube.com/watch?v=quwebVjAEJA');


			}
		});

		YouTube.controller = {
			show : function() {
				App.navigate("youtube");
				App.mainRegion.show(new YouTube.MainView());
			}
		}

		App.on("youtube:show", function() {
			YouTube.controller.show();
		});

		YouTube.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"youtube" : "show"
			}
		});

		YouTube.addInitializer(function() {
			new YouTube.Router({
				controller : YouTube.controller
			});
		});
	});
	return App.YouTube.controller;
})