define([ 'app' , 'apps/marionette.youtube/common/utils'], function(App, utils) {
	App.module('marionetteyoutube', function(marionetteyoutube, App, Backbone, Marionette, $, _) {
		marionetteyoutube.nowPlayingModel = Backbone.Model.extend({

			idAttribute : 'source',

			defaults : {
				source : '',
				title : {
					$t : ''
				}
			},

			videoSource : '',

			url : function() {
				return 'http://gdata.youtube.com/feeds/videos/' + this.videoSource + '?format=5&alt=json-in-script';
			},

			/**
			 * override fetch to always use jsonp
			 * 
			 * @param {Object}
			 *            options
			 * @return {none}
			 */
			fetch : function(options) {
				var self = this, opts = _.extend({}, options || {});

				opts.dataType = 'jsonp';
				Backbone.Model.prototype.fetch.call(this, opts);
			},

			/**
			 * massaged inbound data
			 * 
			 * @param {Object}
			 *            response - raw API data
			 * @return {Object}
			 */
			parse : function(response) {
				var data = response.entry;
				var paths = data.id.$t.split('/');

				data.source = paths[paths.length - 1];
				data.duration = utils.getDuration(data.media$group.yt$duration.seconds);
				data.authorName = data.author[0].name.$t;
				data.thumbNailUrl = data.media$group.media$thumbnail[1].url;
				data.titleAbbr = data.title.$t.substr(0, 20);

				return data;
			}
		});

		marionetteyoutube.commentsModel = Backbone.Collection.extend({

			/**
			 * massage inbound data
			 * 
			 * @param {Object}
			 *            response
			 * @return {Array<Object>}
			 */
			parse : function(response) {
				var entries = response.feed.entry;
				var i = entries.length;
				var entry;

				while (i--) {
					entry = entries[i];
					entry.authorName = entry.author[0].name.$t;
				}
				return entries;
			}
		});

		marionetteyoutube.relatedVideosModel = Backbone.Collection.extend({

			/**
			 * massage inbound data
			 * 
			 * @param {Object}
			 *            response
			 * @return {Array<Object>}
			 */
			parse : function(response) {
				var entries = response.feed.entry;
				var i = entries.length;
				var entry;
				var paths;

				while (i--) {
					entry = entries[i];
					paths = entry.id.$t.split('/');
					entry.source = paths[paths.length - 1];
					entry.duration = utils.getDuration(entry.media$group.yt$duration.seconds);
					entry.authorName = entry.author[0].name.$t;
					entry.thumbNailUrl = entry.media$group.media$thumbnail[1].url;
					entry.titleAbbr = entry.title.$t.substr(0, 20);
				}

				return entries;
			}
		});
		
		marionetteyoutube.searchCollection = Backbone.Collection.extend({
		    // model: Model,
		    searchTerm: '',
		    startIndex: 1,

		    /**
		     * Generate the collection's url dynamically at runtime
		     */
		    url: function () {
		      return 'http://gdata.youtube.com/feeds/videos?vq=' + this.searchTerm + '&format=5&max-results=20&start-index=' +
		        this.startIndex + '&alt=json-in-script';
		    },

		    /**
		     * Parse the raw API data
		     * @param  {Object} response
		     * @return {Array<Object>}
		     */
		    parse: function (response) {
		      var entries = response.feed.entry;
		      var i = entries.length;
		      var entry;
		      var paths;

		      while (i--) {
		        entry = entries[i];
		        paths = entry.id.$t.split('/');
		        entry.source = paths[paths.length-1]; //generate a unique id
		        entry.duration = utils.getDuration(entry.media$group.yt$duration.seconds);
		        entry.thumbnail = entry.media$group.media$thumbnail[0].url;
		        entry.authorName = entry.author[0].name.$t;
		        entry.description = entry.media$group.media$description.$t.substr(0, 50);
		      }
		      
		      return entries;
		    }
		  });
	}); // end defining module
})