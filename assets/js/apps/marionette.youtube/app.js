define([ 'app', 'tpl!apps/marionette.youtube/view.tpl', 'css!apps/marionette.youtube/style', 'apps/marionette.youtube/models', 'apps/marionette.youtube/common/utils', 'apps/marionette.youtube/views' ], function(App, viewTpl) {
	App.module('marionetteyoutube', function(marionetteyoutube, App, Backbone, Marionette, $, _) {

		marionetteyoutube.MainView = Marionette.ItemView.extend({
			template : viewTpl,
		});

		var searchLayout = new marionetteyoutube.searchLayoutView();

		var SearchResultsCollection = marionetteyoutube.searchCollection.extend({
			model : Backbone.Model.extend({
				idAttribute : 'source'
			})
		});

		var searchCollection = new SearchResultsCollection();

		var nowPlayingLayout = new marionetteyoutube.commentLayoutView();

		var CommentsCollection = marionetteyoutube.commentsModel.extend({
			model : Backbone.Model.extend({
				idAttribute : 'source'
			})
		});

		var RelatedVideosCollection = marionetteyoutube.relatedVideosModel.extend({
			model : Backbone.Model.extend({
				idAttribute : 'source'
			})
		});

		var nowPlayingModel = new marionetteyoutube.nowPlayingModel();
		var commentsCollection = new CommentsCollection();
		var relatedVideosCollection = new RelatedVideosCollection();

		marionetteyoutube.controller = {

			show : function() {
				App.navigate("marionetteyoutube");
				// show app
				App.layout = new marionetteyoutube.layoutView();
				App.mainRegion.show(App.layout);
				App.layout.recentVideos.show(new marionetteyoutube.recentVideosView());
			},

			index : function() {
				App.layout.mainContent.show(new marionetteyoutube.homeView());
			},
			contact : function() {
				App.layout.mainContent.show(new marionetteyoutube.contactView());
			},

			search : function(searchTerm) {

				var mainContentRegion = App.layout.mainContent; // app.mainRegion.currentView.regionManager.get('mainContent');
				if (mainContentRegion.currentView != searchLayout) {
					mainContentRegion.show(searchLayout);
					searchLayout.searchBar.show(new marionetteyoutube.searchBarView());
					searchLayout.results.show(new marionetteyoutube.searchsView({
						collection : searchCollection
					}));
				}

				if (searchTerm) {
					searchCollection.searchTerm = searchTerm;
					searchCollection.fetch({
						dataType : 'jsonp'
					});

					App.trigger('search:searchTermChanged', searchTerm);
				}
			},
			nowPlaying : function(id) {
				var mainContentRegion = App.layout.mainContent;
				if (mainContentRegion.currentView != nowPlayingLayout) {
					mainContentRegion.show(nowPlayingLayout);
					nowPlayingLayout.searchBar.show(new marionetteyoutube.searchBarView());
					nowPlayingLayout.nowPlaying.show(new marionetteyoutube.nowPlayingView({
						model : nowPlayingModel
					}));
					nowPlayingLayout.comments.show(new marionetteyoutube.commentsView({
						collection : commentsCollection
					}));
					nowPlayingLayout.relatedVideos.show(new marionetteyoutube.relatedVideosView({
						collection : relatedVideosCollection
					}));
				}

				if (id) {
					nowPlayingModel.videoSource = id;
					nowPlayingModel.fetch({
						dataType : 'jsonp'
					});
				}
			}
		};

		App.on("marionetteyoutube:show", function() {
			marionetteyoutube.controller.show();
		});

		marionetteyoutube.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"marionetteyoutube" : "show",
				'youtube/home' : 'index',
				'search(/:searchTerm)' : 'search',
				'nowplaying(/:id)' : 'nowPlaying'
			}
		});

		App.addInitializer(function() {
			new marionetteyoutube.Router({
				controller : marionetteyoutube.controller
			});
			App.on('global:route', marionetteyoutube.controller.search, marionetteyoutube.controller);


		});
	});
	return App.marionetteyoutube.controller;
})