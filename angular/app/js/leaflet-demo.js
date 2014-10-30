define([ 'angular', 'leaflet', "angular-leaflet" ], function(angular) {

	var app = angular.module("leaflet-demo", [ "leaflet-directive" ]);

	app.controller('DefaultController', function DefaultController($scope) {
		angular.extend($scope, {
			mapDefault : {
				london : {
					lat : 51.505,
					lng : -0.09,
					zoom : 8
				},
				markers : {
					m1 : {
						lat : 51.505,
						lng : -0.09
					}
				}
			}
		});
	});

	app.controller('BaseLayersController', function BaseLayersController($scope) {
		angular.extend($scope, {
			london : {
				lat : 51.505,
				lng : -0.09,
				zoom : 8
			},
			markers : {
				m1 : {
					lat : 51.505,
					lng : -0.09
				}
			},
			layers : {
				baselayers : {
					osm : {
						name : 'OpenStreetMap',
						type : 'xyz',
						url : 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
						layerOptions : {
							subdomains : [ 'a', 'b', 'c' ],
							attribution : '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
							continuousWorld : true
						}
					},
					cycle : {
						name : 'OpenCycleMap',
						type : 'xyz',
						url : 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
						layerOptions : {
							subdomains : [ 'a', 'b', 'c' ],
							attribution : '&copy; <a href="http://www.opencyclemap.org/copyright">OpenCycleMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
							continuousWorld : true
						}
					},
					cloudmade1 : {
						name : 'Cloudmade Night Commander',
						type : 'xyz',
						url : 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
						layerParams : {
							key : '007b9471b4c74da4a6ec7ff43552b16f',
							styleId : 999
						},
						layerOptions : {
							subdomains : [ 'a', 'b', 'c' ],
							continuousWorld : true
						}
					},
					cloudmade2 : {
						name : 'Cloudmade Tourist',
						type : 'xyz',
						url : 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
						layerParams : {
							key : '007b9471b4c74da4a6ec7ff43552b16f',
							styleId : 7
						},
						layerOptions : {
							subdomains : [ 'a', 'b', 'c' ],
							continuousWorld : true
						}
					}
				}
			}
		});
	});

	app.controller('DynamicLayersController', function DynamicLayersController($scope) {
		angular.extend($scope, {
			mapDynamicLayers : {
				london : {
					lat : 51.505,
					lng : -0.09,
					zoom : 8
				},
				markers : {
					m1 : {
						lat : 51.505,
						lng : -0.09
					}
				},
				layers : {
					baselayers : {
						osm : {
							name : 'OpenStreetMap',
							type : 'xyz',
							url : 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
							layerOptions : {
								subdomains : [ 'a', 'b', 'c' ],
								attribution : '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
								continuousWorld : true
							}
						},
						cycle : {
							name : 'OpenCycleMap',
							type : 'xyz',
							url : 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
							layerOptions : {
								subdomains : [ 'a', 'b', 'c' ],
								attribution : '&copy; <a href="http://www.opencyclemap.org/copyright">OpenCycleMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
								continuousWorld : true
							}
						},
						cloudmade1 : {
							name : 'Cloudmade Night Commander',
							type : 'xyz',
							url : 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
							layerParams : {
								key : '007b9471b4c74da4a6ec7ff43552b16f',
								styleId : 999
							},
							layerOptions : {
								subdomains : [ 'a', 'b', 'c' ],
								continuousWorld : true
							}
						},
						cloudmade2 : {
							name : 'Cloudmade Tourist',
							type : 'xyz',
							url : 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
							layerParams : {
								key : '007b9471b4c74da4a6ec7ff43552b16f',
								styleId : 7
							},
							layerOptions : {
								subdomains : [ 'a', 'b', 'c' ],
								continuousWorld : true
							}
						}
					}
				}
			},
			removeOsmLayer : function() {
				delete this.mapDynamicLayers.layers.baselayers.osm;
			},
			addOsmLayer : function() {
				this.mapDynamicLayers.layers.baselayers.osm = {
					name : 'OpenStreetMap',
					type : 'xyz',
					url : 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
					layerOptions : {
						subdomains : [ 'a', 'b', 'c' ],
						attribution : '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
						continuousWorld : true
					}
				};
			},
			existsOsmLayer : function() {
				return ('osm' in this.mapDynamicLayers.layers.baselayers);
			},
			removeCycleLayer : function() {
				delete this.mapDynamicLayers.layers.baselayers.cycle;
			},
			addCycleLayer : function() {
				this.mapDynamicLayers.layers.baselayers.cycle = {
					name : 'OpenCycleMap',
					type : 'xyz',
					url : 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
					layerOptions : {
						subdomains : [ 'a', 'b', 'c' ],
						attribution : '&copy; <a href="http://www.opencyclemap.org/copyright">OpenCycleMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
						continuousWorld : true
					}
				};
			},
			existsCycleLayer : function() {
				return ('cycle' in this.mapDynamicLayers.layers.baselayers);
			},
			removeCloud1Layer : function() {
				delete this.mapDynamicLayers.layers.baselayers.cloudmade1;
			},
			addCloud1Layer : function() {
				this.mapDynamicLayers.layers.baselayers.cloudmade1 = {
					name : 'Cloudmade Night Commander',
					type : 'xyz',
					url : 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
					layerParams : {
						key : '007b9471b4c74da4a6ec7ff43552b16f',
						styleId : 999
					},
					layerOptions : {
						subdomains : [ 'a', 'b', 'c' ],
						continuousWorld : true
					}
				};
			},
			existsCloud1Layer : function() {
				return ('cloudmade1' in this.mapDynamicLayers.layers.baselayers);
			},
			removeCloud2Layer : function() {
				delete this.mapDynamicLayers.layers.baselayers.cloudmade2;
			},
			addCloud2Layer : function() {
				this.mapDynamicLayers.layers.baselayers.cloudmade2 = {
					name : 'Cloudmade Tourist',
					type : 'xyz',
					url : 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
					layerParams : {
						key : '007b9471b4c74da4a6ec7ff43552b16f',
						styleId : 7
					},
					layerOptions : {
						subdomains : [ 'a', 'b', 'c' ],
						continuousWorld : true
					}
				};
			},
			existsCloud2Layer : function() {
				return ('cloudmade2' in this.mapDynamicLayers.layers.baselayers);
			},

		});
	});

	app.controller('CombineTypeLayersController', function CombineTypeLayersController($scope) {
		angular.extend($scope, {
			berlin : {
				lat : 52.51739,
				lng : 13.40209,
				zoom : 14
			},
			markers : {
				m1 : {
					lat : 52.51739,
					lng : 13.40209
				}
			},
			layers : {
				baselayers : {
					osm : {
						name : 'OpenStreetMap WMS Omniscale',
						type : 'wms',
						url : 'http://osm.omniscale.net/proxy/service',
						layerOptions : {
							layers : 'osm',
							format : 'image/png'
						}
					},
					cycle : {
						name : 'OpenCycleMap',
						type : 'xyz',
						url : 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
						layerOptions : {
							subdomains : [ 'a', 'b', 'c' ],
							attribution : '&copy; <a href="http://www.opencyclemap.org/copyright">OpenCycleMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
							continuousWorld : true
						}
					},
					cloudmade : {
						name : 'Cloudmade Tourist',
						type : 'xyz',
						url : 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
						layerParams : {
							key : '007b9471b4c74da4a6ec7ff43552b16f',
							styleId : 7
						},
						layerOptions : {
							subdomains : [ 'a', 'b', 'c' ],
							continuousWorld : true
						}
					}
				}
			}
		});
	});

	return app;
})