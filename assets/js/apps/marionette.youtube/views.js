define([ 'app', 
         'stache!apps/marionette.youtube/templates/app/layout', 
         'stache!apps/marionette.youtube/templates/contact/contact',
         'stache!apps/marionette.youtube/templates/home/home',
         'stache!apps/marionette.youtube/templates/nowPlaying/comment',
         'stache!apps/marionette.youtube/templates/nowPlaying/layout',
         'stache!apps/marionette.youtube/templates/nowPlaying/nowPlaying',
         'stache!apps/marionette.youtube/templates/nowPlaying/relatedVideo',
         'stache!apps/marionette.youtube/templates/recentVideos/item',
         'stache!apps/marionette.youtube/templates/search/layout',
         'stache!apps/marionette.youtube/templates/search/searchBar',
         'stache!apps/marionette.youtube/templates/search/searchItem',
         'apps/marionette.youtube/models', 'apps/marionette.youtube/common/utils', 'stickit'], function(App, layoutTpl, contactTpl, homeTpl,
        		 commentItemTpl, commentLayoutTpl, nowPlayingTpl, relatedVideoTpl, recentVideoItemTpl, searchLayoutTpl, searchBarTpl, searchItemTpl) {
	App.module('marionetteyoutube', function(marionetteyoutube, App, Backbone, Marionette, $, _) {
		
		marionetteyoutube.layoutView = Marionette.Layout.extend({
		    template: layoutTpl,

		    regions: {
		      recentVideos: '#recentVideos',
		      mainContent: '#mainContent'
		    }
		  });
		
		marionetteyoutube.contactView = Marionette.ItemView.extend({
		    template: contactTpl,
		    
		    /**
		     * call when instance created
		     * @return {none}
		     */
		    initialize: function () {
		      this.model = new Backbone.Model({
		        avatar: 'https://fbexternal-a.akamaihd.net/safe_image.php?d=AQDAacwkOhqzeWDH&w=155&h=114&url=https%3A%2F%2Fsecure.gravatar.com%2Favatar%2F481d556f479c71e5cc06f1493d4f6613%3Fs%3D420%26d%3Dhttps%253A%252F%252Fa248.e.akamai.net%252Fassets.github.com%252Fimages%252Fgravatars%252Fgravatar-user-420.png',
		        links: [
		          { text: 'Linkedin', target: '_blank', url: 'http://www.linkedin.com/in/timdoherty'},
		          { text: 'Blog', target: '_blank', url: 'http://blog.dohertycomputing.com'},
		          { text: 'Underwater Photos', target: '_blank', url: 'http://www.flickr.com/photos/hawaiidiveadventures/sets/72157622322603331/'},
		          { text: 'Website', target: '_blank', url: 'http://dohertycomputing.com'},
		        ]
		      });
		    }
		  });
		
		
		marionetteyoutube.homeView = Marionette.ItemView.extend({
		    template: homeTpl
		  });
		
		marionetteyoutube.commentItemView = Marionette.ItemView.extend({
		    template: commentItemTpl,
		    tagName: 'li',
		    className: 'comment'
		  });
		
		marionetteyoutube.commentsView = Marionette.CollectionView.extend({
		    itemView: marionetteyoutube.commentItemView,

		    /**
		     * Marionette event hook, called just before view is closed and removed
		     * @return {none}
		     */
		    onClose: function () {
		      this.collection.reset();
		    }
		  });
		
		marionetteyoutube.commentLayoutView = Marionette.Layout.extend({
		    template: commentLayoutTpl,

		    /**
		     * define manageable regions in the layout
		     * @type {Object}
		     */
		    regions: {
		        searchBar: '#searchBar',
		        nowPlaying: '#nowPlaying',
		        comments: '#comments',
		        relatedVideos: '#relatedVideos'
		    }
		  });
		
		marionetteyoutube.nowPlayingView = Marionette.ItemView.extend({
		    template: nowPlayingTpl,

		    /**
		     * called when new instance created
		     * @return {none}
		     */     
		    initialize: function () {
		      this.listenTo(this.model, 'sync', this.render);
		      this.listenTo(this.model, 'sync', this.onSync);
		    },

		    /**
		     * event handler for associated event aggregator,
		     * notify other entities that the current video has been loaded
		     * @return {none}
		     */
		    onSync: function () {
		      // vent.trigger('nowplaying.relatedcontent', this.model.toJSON());
		      App.trigger('nowPlaying:sync', this.model.toJSON());
		    }
		  });
		
		marionetteyoutube.relatedVideoItemView = Marionette.ItemView.extend({
		    template: relatedVideoTpl,
		    tagName: 'li',
		    className: 'video-list-item'
		  });
		
		marionetteyoutube.relatedVideosView = Marionette.CollectionView.extend({
		    itemView: marionetteyoutube.relatedVideoItemView,

		    /**
		     * Marionette event hook, called just before view is closed and removed
		     * @return {none}
		     */
		    onClose: function () {
		      this.collection.reset();
		    }
		  });
		
		marionetteyoutube.recentVideoItemView = Marionette.ItemView.extend({
		    template: recentVideoItemTpl,
		    tagName: 'li',
		    className: 'video-list-item'
		  });
		marionetteyoutube.EmptyModel =  Backbone.Model.extend({ idAttribute: 'source' });

		marionetteyoutube.recentVideosView = Marionette.CollectionView.extend({
		    itemView: marionetteyoutube.recentVideoItemView,

		    maxEntries: 10,

		    collection: new Backbone.Collection(),

		    /**
		     * called when new instance created, listen for current video loaded and 
		     * unshift the video object to the recent videos collection
		     * @return {none}
		     */
		    initialize: function () {
		      //this.listenTo(App, 'nowPlaying:sync', this.add);
		    	App.on('nowPlaying:sync', this.add, this);
		    },

		    /**
		     * manage the recent videos collection at a specified max length
		     * @param {[type]} data
		     */
		    add: function (data) {
		      
		      this.collection.unshift(new marionetteyoutube.EmptyModel(data));
		      if (this.collection.length > this.maxEntries) {
		        this.collection.pop();
		      }
		    }
		  });
		    	
		 marionetteyoutube.searchItemView =  Marionette.ItemView.extend({
			    template: searchItemTpl,
			    tagName: 'li',
			    className: 'yt-lockup2 yt-lockup2-video yt-uix-tile context-data-item clearfix'
			  });    
		 
		 marionetteyoutube.searchsView = Marionette.CollectionView.extend({
			    itemView: marionetteyoutube.searchItemView,

			    /**
			    * Marionette event hook, called just before view is closed and removed
			    * @return {none}
			    */
			    onClose: function () {
			      this.collection.reset();
			    }
			  });
		 marionetteyoutube.searchLayoutView = Marionette.Layout.extend({
			    template: searchLayoutTpl,

			    /**
			     * define manageable regions in the layout
			     * @type {Object}
			     */
			    regions: {
			      searchBar: '#searchBar',
			      results: '#searchResults'
			    }
			  });
		 
			marionetteyoutube.SearchBarModel =  Backbone.Model.extend({
			    defaults: {
			        searchTerm: ''
			      }
			    });

		 
		 marionetteyoutube.searchBarView = Marionette.ItemView.extend({
			    template: searchBarTpl,

			    events: {
			      'keyup #searchTerm': 'onSearchKeyUp',
			      'click .icon-search': 'search'
			    },

			    /**
			     * backbone.stickit declarative model bindings
			     * @type {Object}
			     */
			    bindings: {
			      '#searchTerm': 'searchTerm'
			    },

			    /**
			     * called when new instance created
			     * @return {[type]}
			     */
			    initialize: function () {
			      this.model = new marionetteyoutube.SearchBarModel();
			      //this.listenTo(vent, 'search:searchTermChanged', this.onSearchTermChanged);
			      App.on('search:searchTermChanged', _.bind(this.onSearchTermChanged, this));
			    },

			    /**
			     * Marionette hook for post-render functionality
			     * @return {none}
			     */
			    onRender: function () {
			      this.stickit();
			    },

			    /**
			     * DOM event handler
			     * @param  {Object} e
			     * @return {none}
			     */
			    onSearchKeyUp: function (e) {
			      if (e.which === 13)  {
			        // this.$(e.currentTarget).change();
			        this.search();
			      }
			    },

			    /**
			     * event handler foor associated event aggregator
			     * @param  {string} searchTerm
			     * @return {none}
			     */
			    onSearchTermChanged: function (searchTerm) {
			      if (this.model.get('searchTerm') !== searchTerm) {
			        this.model.set({searchTerm: searchTerm});
			      }
			    },

			    /**
			     * trigger an event through the aggregator with the current search term
			     * @return {none}
			     */
			    search: function () {
			      var searchTerm = this.model.get('searchTerm');

			      //use the event aggregatorto emit a global route event
			      App.trigger('global:route', searchTerm);
			      //App.navigate('search/' + searchTerm, { trigger: true });


			      //this.sandbox.emit('search.search', searchTerm);
			    },

			  });
	});
})