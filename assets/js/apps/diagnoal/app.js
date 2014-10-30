define([ 'app', 'tpl!apps/diagnoal/view.tpl', 'css!apps/diagnoal/style', 'jquery.swipebox', 'jquery.loadImage' ], function(App, viewTpl) {
	App.module('DiagGallery', function(DiagGallery, App, Backbone, Marionette, $, _) {

	

		DiagGallery.MainView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
			    // Load demo images from flickr:
			    $.ajax({
			        url: (window.location.protocol === 'https:' ?
			                'https://secure' : 'http://api') +
			                '.flickr.com/services/rest/',
			        data: {
			            format: 'json',
			            method: 'flickr.interestingness.getList',
			            api_key: '7617adae70159d09ba78cfec73c13be3'
			        },
			        dataType: 'jsonp',
			        jsonp: 'jsoncallback'
			    }).done(function (result) {
			        var linksContainer = $('#links'),
			            baseUrl;
			        // Add the demo images as links with thumbnails to the page:
			        $.each(result.photos.photo, function (index, photo) {
			            baseUrl = 'http://farm' + photo.farm + '.static.flickr.com/' +
			                photo.server + '/' + photo.id + '_' + photo.secret;
			            $('<a/>')
			                .append($('<img>').prop('src', baseUrl + '_s.jpg'))
			                .prop('href', baseUrl + '_b.jpg')
			                .prop('title', photo.title)
			                .attr('data-gallery', '')
			                .addClass('swipebox')
			                .appendTo(linksContainer);
			        });
			        $('#links .swipebox').swipebox();
			    });
			}
		});

		DiagGallery.controller = {
			show : function() {
				App.navigate("diag-gallery");
				App.mainRegion.show(new DiagGallery.MainView());
			}
		}

		App.on("diag-gallery:show", function() {
			DiagGallery.controller.show();
		});

		DiagGallery.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"diag-gallery" : "show"
			}
		});

		DiagGallery.addInitializer(function() {
			new DiagGallery.Router({
				controller : DiagGallery.controller
			});
		});
	});
	return App.DiagGallery.controller;
})