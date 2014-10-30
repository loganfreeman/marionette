define([ 'app' ,
         'tpl!apps/gallery/view.tpl', 
         'bootstrap/bootstrap-image-gallery',
         'css!apps/gallery/style'], function(App, viewTpl, Gallery) {
	App.module('BootStrapGallery', function(BootStrapGallery, App, Backbone, Marionette, $, _) {

		BootStrapGallery.MainView = Marionette.ItemView.extend({
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
			                .appendTo(linksContainer);
			        });
			    });

			    $('#borderless-checkbox').on('change', function () {
			        var borderless = $(this).is(':checked');
			        $('#blueimp-gallery').data('useBootstrapModal', !borderless);
			        $('#blueimp-gallery').toggleClass('blueimp-gallery-controls', borderless);
			    });

			    $('#fullscreen-checkbox').on('change', function () {
			        $('#blueimp-gallery').data('fullScreen', $(this).is(':checked'));
			    });

			    $('#image-gallery-button').on('click', function (event) {
			        event.preventDefault();
			        Gallery($('#links a'), $('#blueimp-gallery').data());
			    });

			    $('#video-gallery-button').on('click', function (event) {
			        event.preventDefault();
			        Gallery([
			            {
			                title: 'Sintel',
			                href: 'http://media.w3.org/2010/05/sintel/trailer.mp4',
			                type: 'video/mp4',
			                poster: 'http://media.w3.org/2010/05/sintel/poster.png'
			            },
			            {
			                title: 'Big Buck Bunny',
			                href: 'http://upload.wikimedia.org/wikipedia/commons/7/75/' +
			                    'Big_Buck_Bunny_Trailer_400p.ogg',
			                type: 'video/ogg',
			                poster: 'http://upload.wikimedia.org/wikipedia/commons/thumb/7/70/' +
			                    'Big.Buck.Bunny.-.Opening.Screen.png/' +
			                    '800px-Big.Buck.Bunny.-.Opening.Screen.png'
			            },
			            {
			                title: 'Elephants Dream',
			                href: 'http://upload.wikimedia.org/wikipedia/commons/transcoded/8/83/' +
			                    'Elephants_Dream_%28high_quality%29.ogv/' +
			                    'Elephants_Dream_%28high_quality%29.ogv.360p.webm',
			                type: 'video/webm',
			                poster: 'http://upload.wikimedia.org/wikipedia/commons/thumb/9/90/' +
			                    'Elephants_Dream_s1_proog.jpg/800px-Elephants_Dream_s1_proog.jpg'
			            },
			            {
			                title: 'LES TWINS - An Industry Ahead',
			                href: 'http://www.youtube.com/watch?v=zi4CIXpx7Bg',
			                type: 'text/html',
			                youtube: 'zi4CIXpx7Bg',
			                poster: 'http://img.youtube.com/vi/zi4CIXpx7Bg/0.jpg'
			            },
			            {
			                title: 'KN1GHT - Last Moon',
			                href: 'http://vimeo.com/73686146',
			                type: 'text/html',
			                vimeo: '73686146',
			                poster: 'http://b.vimeocdn.com/ts/448/835/448835699_960.jpg'
			            }
			        ], $('#blueimp-gallery').data());
			    });

				
			}
		});

		BootStrapGallery.controller = {
			show : function() {
				App.navigate("gallery");
				App.mainRegion.show(new BootStrapGallery.MainView());
			}
		}

		App.on("gallery:show", function() {
			BootStrapGallery.controller.show();
		});

		BootStrapGallery.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"gallery" : "show"
			}
		});

		BootStrapGallery.addInitializer(function() {
			new BootStrapGallery.Router({
				controller : BootStrapGallery.controller
			});
		});
	});
	return App.BootStrapGallery.controller;
})