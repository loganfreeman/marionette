define([ 'app',
         'stache!apps/gmaps/view',
         'css!apps/gmaps/style', 'gmaps'], function(App, viewTpl) {
	App.module('gmapsapp', function(gmapsapp, App, Backbone, Marionette, $, _) {

		gmapsapp.basicView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
				  map = new GMaps({
				        el: '#gmap',
				        lat: -12.043333,
				        lng: -77.028333,
				        zoomControl : true,
				        zoomControlOpt: {
				            style : 'SMALL',
				            position: 'TOP_LEFT'
				        },
				        panControl : false,
				        streetViewControl : false,
				        mapTypeControl: false,
				        overviewMapControl: false
				      });
				  $('div.usage > div.basic').show();
				  $('div.usage > div:not(.basic)').hide();
				  $("#geocoding_form :input").prop("disabled", true);
				  $("#routeCtl > a").addClass('active');

			}
		});
		
		gmapsapp.overlaysView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
			      map = new GMaps({
			          el: '#gmap',
			          lat: -12.043333,
			          lng: -77.028333
			        });
			        map.drawOverlay({
			          lat: map.getCenter().lat(),
			          lng: map.getCenter().lng(),
			          layer: 'overlayLayer',
			          content: '<div class="overlay">Lima<div class="overlay_arrow above"></div></div>',
			          verticalAlign: 'top',
			          horizontalAlign: 'center'
			        });
				  $('div.usage > div.overlays').show();
				  $('div.usage > div:not(.overlays)').hide();
				  $('#gmapTitle').text('overlays');
				  $("#geocoding_form :input").prop("disabled", true);
				  $("#routeCtl > a").addClass('active');

			}
		});
		
		gmapsapp.kmlView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
			     infoWindow = new google.maps.InfoWindow({});
			      map = new GMaps({
			        el: '#gmap',
			        zoom: 12,
			        lat: 40.65,
			        lng: -73.95
			      });
			      map.loadFromKML({
			        url: 'http://api.flickr.com/services/feeds/geo/?g=322338@N20&lang=en-us&format=feed-georss',
			        suppressInfoWindows: true,
			        events: {
			          click: function(point){
			            infoWindow.setContent(point.featureData.infoWindowHtml);
			            infoWindow.setPosition(point.latLng);
			            infoWindow.open(map.map);
			          }
			        }
			      });
				  $('div.usage > div.kml').show();
				  $('div.usage > div:not(.kml)').hide();
				  $('#gmapTitle').text('kml');
				  $("#geocoding_form :input").prop("disabled", true);
				  $("#routeCtl > a").addClass('active');

			}
		});
		
		gmapsapp.geometryView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
			      map = new GMaps({
			          el: '#gmap',
			          lat: -12.043333,
			          lng: -77.028333
			        });
			        var bounds = [[-12.030397656836609,-77.02373871559225],[-12.034804866577001,-77.01154422636042]];
			        rectangle = map.drawRectangle({
			          bounds: bounds,
			          strokeColor: '#BBD8E9',
			          strokeOpacity: 1,
			          strokeWeight: 3,
			          fillColor: '#BBD8E9',
			          fillOpacity: 0.6
			        });

			        var paths = [[-12.040397656836609,-77.03373871559225],[-12.040248585302038,-77.03993927003302],[-12.050047116528843,-77.02448169303511],[-12.044804866577001,-77.02154422636042]];
			        polygon = map.drawPolygon({
			          paths: paths,
			          strokeColor: '#25D359',
			          strokeOpacity: 1,
			          strokeWeight: 3,
			          fillColor: '#25D359',
			          fillOpacity: 0.6
			        });
			        lat = -12.040504866577001;
			        lng = -77.02024422636042;
			        circle = map.drawCircle({
			          lat: lat,
			          lng: lng,
			          radius: 350,
			          strokeColor: '#432070',
			          strokeOpacity: 1,
			          strokeWeight: 3,
			          fillColor: '#432070',
			          fillOpacity: 0.6
			        });
			        for(i in paths){
			          bounds.push(paths[i]);
			        }
			        b = [];
			        for(i in bounds){
			          latlng = new google.maps.LatLng(bounds[i][0], bounds[i][1]);
			          b.push(latlng);
			        }
			        for(i in paths){
			          latlng = new google.maps.LatLng(paths[i][0], paths[i][1]);
			          b.push(latlng);
			        }
			        map.fitLatLngBounds(b);
				  $('div.usage > div.geometry').show();
				  $('div.usage > div:not(.geometry)').hide();
				  $('#gmapTitle').text('geometry');
				  $("#geocoding_form :input").prop("disabled", true);
				  $("#routeCtl > a").addClass('active');

			}
		});
		
		gmapsapp.layersView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
				  map = new GMaps({
			          el: "#gmap",
			          lat: -12.043333,
			          lng: -77.028333,
			          zoom: 3
			        });
			        
			        map.addLayer('weather', {
			          clickable: false
			        });
			        map.addLayer('clouds');
				  $('div.usage > div.layers').show();
				  $('div.usage > div:not(.layers)').hide();
				  $('#gmapTitle').text('layers');
				  $("#geocoding_form :input").prop("disabled", true);
				  $("#routeCtl > a").addClass('active');

			}
		});
		
		gmapsapp.polylinesView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
			      map = new GMaps({
			          el: '#gmap',
			          lat: -12.043333,
			          lng: -77.028333,
			          click: function(e){
			            console.log(e);
			          }
			        });

			        path = [[-12.044012922866312, -77.02470665341184], [-12.05449279282314, -77.03024273281858], [-12.055122327623378, -77.03039293652341], [-12.075917129727586, -77.02764635449216], [-12.07635776902266, -77.02792530422971], [-12.076819390363665, -77.02893381481931], [-12.088527520066453, -77.0241058385925], [-12.090814532191756, -77.02271108990476]];

			        map.drawPolyline({
			          path: path,
			          strokeColor: '#131540',
			          strokeOpacity: 0.6,
			          strokeWeight: 6
			        });
				  $('div.usage > div.polylines').show();
				  $('div.usage > div:not(.polylines)').hide();
				  $('#gmapTitle').text('polylines');
				  $("#geocoding_form :input").prop("disabled", true);
				  $("#routeCtl > a").addClass('active');

			}
		});
		
		gmapsapp.geocodingView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
				 map = new GMaps({
				        el: '#gmap',
				        lat: -12.043333,
				        lng: -77.028333
				      });
				      $('#geocoding_form').submit(function(e){
				        e.preventDefault();
				        GMaps.geocode({
				          address: $('#address').val().trim(),
				          callback: function(results, status){
				            if(status=='OK'){
				              var latlng = results[0].geometry.location;
				              map.setCenter(latlng.lat(), latlng.lng());
				              map.addMarker({
				                lat: latlng.lat(),
				                lng: latlng.lng()
				              });
				            }
				          }
				        });
				      });
				  $('div.usage > div.geocoding').show();
				  $('div.usage > div:not(.geocoding)').hide();
				  $('#gmapTitle').text('geocoding');
				  $("#geocoding_form :input").prop("disabled", false);
				  $("#routeCtl > a").addClass('active');

			}
		});
		
		gmapsapp.markersView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
				 map = new GMaps({
				        el: '#gmap',
				        lat: -12.043333,
				        lng: -77.028333
				      });
				      map.addMarker({
				        lat: -12.043333,
				        lng: -77.03,
				        title: 'Lima',
				        details: {
				          database_id: 42,
				          author: 'HPNeo'
				        },
				        click: function(e){
				          if(console.log)
				            console.log(e);
				          alert('You clicked in this marker');
				        },
				        mouseover: function(e){
				          if(console.log)
				            console.log(e);
				        }
				      });
				      map.addMarker({
				        lat: -12.042,
				        lng: -77.028333,
				        title: 'Marker with InfoWindow',
				        infoWindow: {
				          content: '<p>HTML Content</p>'
				        }
				      });
				  $('div.usage > div.markers').show();
				  $('div.usage > div:not(.markers)').hide();
				  $('#gmapTitle').text('markers');
				  $("#geocoding_form :input").prop("disabled", true);
				  $("#routeCtl > a").addClass('active');

			}
		});
		
		gmapsapp.ploygonsView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
				 map = new GMaps({
				        el: '#gmap',
				        lat: -12.040397656836609,
				        lng: -77.03373871559225,
				        click: function(e){
				          console.log(e);
				        }
				      });

				      paths = [
				                [
				                  [
				                    [-105.00432014465332, 39.74732195489861],
				                    [-105.00715255737305, 39.74620006835170],
				                    [-105.00921249389647, 39.74468219277038],
				                    [-105.01067161560059, 39.74362625960105],
				                    [-105.01195907592773, 39.74290029616054],
				                    [-105.00989913940431, 39.74078835902781],
				                    [-105.00758171081543, 39.74059036160317],
				                    [-105.00346183776855, 39.74059036160317],
				                    [-105.00097274780272, 39.74059036160317],
				                    [-105.00062942504881, 39.74072235994946],
				                    [-105.00020027160645, 39.74191033368865],
				                    [-105.00071525573731, 39.74276830198601],
				                    [-105.00097274780272, 39.74369225589818],
				                    [-105.00097274780272, 39.74461619742136],
				                    [-105.00123023986816, 39.74534214278395],
				                    [-105.00183105468751, 39.74613407445653],
				                    [-105.00432014465332, 39.74732195489861]
				                  ],[
				                    [-105.00361204147337, 39.74354376414072],
				                    [-105.00301122665405, 39.74278480127163],
				                    [-105.00221729278564, 39.74316428375108],
				                    [-105.00283956527711, 39.74390674342741],
				                    [-105.00361204147337, 39.74354376414072]
				                  ]
				                ],[
				                  [
				                    [-105.00942707061768, 39.73989736613708],
				                    [-105.00942707061768, 39.73910536278566],
				                    [-105.00685214996338, 39.73923736397631],
				                    [-105.00384807586671, 39.73910536278566],
				                    [-105.00174522399902, 39.73903936209552],
				                    [-105.00041484832764, 39.73910536278566],
				                    [-105.00041484832764, 39.73979836621592],
				                    [-105.00535011291504, 39.73986436617916],
				                    [-105.00942707061768, 39.73989736613708]
				                  ]
				                ]
				              ];

				      path = [[-12.040397656836609,-77.03373871559225], [-12.040248585302038,-77.03993927003302], [-12.050047116528843,-77.02448169303511], [-12.044804866577001,-77.02154422636042]];

				      map.drawPolygon({
				        paths: paths,
				        useGeoJSON: true,
				        strokeColor: '#131540',
				        strokeOpacity: 0.6,
				        strokeWeight: 6
				      });

				      map.drawPolygon({
				        paths: path,
				        strokeColor: '#131540',
				        strokeOpacity: 0.6,
				        strokeWeight: 6
				      });
				  $('div.usage > div.ploygons').show();
				  $('div.usage > div:not(.ploygons)').hide();
				  $('#gmapTitle').text('ploygons');
				  $("#geocoding_form :input").prop("disabled", true);
				  $("#routeCtl > a").addClass('active');

			}
		});
		
		gmapsapp.routesView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
				 map = new GMaps({
				        el: '#gmap',
				        lat: -12.043333,
				        lng: -77.028333
				      });
				      map.drawRoute({
				        origin: [-12.044012922866312, -77.02470665341184],
				        destination: [-12.090814532191756, -77.02271108990476],
				        travelMode: 'driving',
				        strokeColor: '#131540',
				        strokeOpacity: 0.6,
				        strokeWeight: 6
				      });
				  $('div.usage > div.routes').show();
				  $('div.usage > div:not(.routes)').hide();
				  $('#gmapTitle').text('routes');
				  $("#geocoding_form :input").prop("disabled", true);
				  $("#routeCtl > a").addClass('active');

			}
		});
		
		gmapsapp.geolocationView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
				var map = new GMaps({
			        el: '#gmap',
			        lat: -12.043333,
			        lng: -77.028333
			      });

			      GMaps.geolocate({
			        success: function(position){
			          map.setCenter(position.coords.latitude, position.coords.longitude);
			        },
			        error: function(error){
			          alert('Geolocation failed: '+error.message);
			        },
			        not_supported: function(){
			          alert("Your browser does not support geolocation");
			        },
			        always: function(){
			          alert("Done!");
			        }
			      });
				  $('div.usage > div.geolocation').show();
				  $('div.usage > div:not(.geolocation)').hide();
				  $('#gmapTitle').text('geolocation');
				  $("#geocoding_form :input").prop("disabled", true);
				  $("#routeCtl > a").addClass('active');

			}
		});
		
		gmapsapp.travelRouteView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
				 $('#forward').attr('disabled', 'disabled');
			      $('#back').attr('disabled', 'disabled');
			      $('#get_route').click(function(e){
			        e.preventDefault();
			        map.getRoutes({
			          origin: [map.markers[0].getPosition().lat(), map.markers[0].getPosition().lng()],
			          destination: [map.markers[map.markers.length-1].getPosition().lat(), map.markers[map.markers.length-1].getPosition().lng()],
			          callback: function(e){
			            route = new GMaps.Route({
			              map: map,
			              route: e[0],
			              strokeColor: '#336699',
			              strokeOpacity: 0.5,
			              strokeWeight: 10
			            });
			            $('#forward').removeAttr('disabled');
			            $('#back').removeAttr('disabled');
			          }
			        });
			        $('#forward').click(function(e){
			          e.preventDefault();
			          route.forward();

			          if(route.step_count < route.steps_length)
			            $('#steps').append('<li>'+route.steps[route.step_count].instructions+'</li>');
			        });
			        $('#back').click(function(e){
			          e.preventDefault();
			          route.back();

			          if(route.step_count >= 0)
			            $('#steps').find('li').last().remove();
			        });
			      });
			      map = new GMaps({
			        el: '#gmap',
			        lat: -12.043333,
			        lng: -77.028333,
			        zoom: 16,
			        height: '500px',
			        click: function(e){
			          map.addMarker({
			            lat: e.latLng.lat(),
			            lng: e.latLng.lng()
			          });
			        }
			      });
				  $('div.usage > div.travel_route').show();
				  $('div.usage > div:not(.travel_route)').hide();
				  $('#gmapTitle').text('travel route');
				  $("#geocoding_form :input").prop("disabled", true);
				  $("#routeCtl > a").removeClass('active');


			}
		});

		gmapsapp.controller = {
			show : function() {
				App.navigate("gmapsapp");
				App.mainRegion.show(new gmapsapp.basicView());
			},
			showOverlays: function(){
				App.navigate("gmaps/overlays");
				App.mainRegion.show(new gmapsapp.overlaysView());
			},
			showKml: function(){
				App.navigate("gmaps/kml");
				App.mainRegion.show(new gmapsapp.kmlView());
			},
			showGeometry: function(){
				App.navigate("gmaps/geometry");
				App.mainRegion.show(new gmapsapp.geometryView());
			},
			showLayers: function(){
				App.navigate("gmaps/layers");
				App.mainRegion.show(new gmapsapp.layersView());
			},
			showGeocoding: function(){
				App.navigate("gmaps/geocoding");
				App.mainRegion.show(new gmapsapp.geocodingView());
			},
			showMarkers: function(){
				App.navigate("gmaps/markers");
				App.mainRegion.show(new gmapsapp.markersView());
			},
			showPloygons: function(){
				App.navigate("gmaps/ploygons");
				App.mainRegion.show(new gmapsapp.ploygonsView());
			},
			showPolylines: function(){
				App.navigate("gmaps/polylines");
				App.mainRegion.show(new gmapsapp.polylinesView());
			},
			showRoutes: function(){
				App.navigate("gmaps/routes");
				App.mainRegion.show(new gmapsapp.routesView());
			},
			showGeolocation: function(){
				App.navigate("gmaps/geolocation");
				App.mainRegion.show(new gmapsapp.geolocationView());
			},
			showTravelRoute: function(){
				App.navigate("gmaps/travel_route");
				App.mainRegion.show(new gmapsapp.travelRouteView());
			}
		}

		App.on("gmapsapp:show", function() {
			gmapsapp.controller.show();
		});

		gmapsapp.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"gmapsapp" : "show",
				'gmaps/basic': 'show',
				'gmaps/overlays': 'showOverlays',
				'gmaps/kml': 'showKml',
				'gmaps/geometry': 'showGeometry',
				'gmaps/layers': 'showLayers',
				'gmaps/geocoding': 'showGeocoding',
				'gmaps/markers': 'showMarkers',
				'gmaps/polygons': 'showPloygons',
				'gmaps/polylines': 'showPolylines',
				'gmaps/routes': 'showRoutes',
				'gmaps/geolocation': 'showGeolocation',
				'gmaps/travel_route': 'showTravelRoute'
			}
		});

		App.addInitializer(function() {
			new gmapsapp.Router({
				controller : gmapsapp.controller
			});
		});
	});
	return App.gmapsapp.controller;
})