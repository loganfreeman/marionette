define([ 'joy' ], function(Joy) {
	console.log(Joy)
	var run = function() {
		var engine = new Joy.Engine({
			debug : true,
			width : 800,
			height : 600,
			canvas: document.getElementById('canvas')
		});

		engine.createScene(function(scene) {
			scene.background("#BFE5E5");

			var emitter = new Joy.ParticleEmitter({
				emission : {
					min : 10,
					max : 50
				},
				lifetime : 5,
				particleLifetime : {
					min : 5,
					max : 10
				},
				position : new Joy.Vector2d(500, 500),
				sources : [ new Joy.Sprite("assets/js/apps/gamesDemo/img/particles/red-sphere.png"), new Joy.Sprite("assets/js/apps/gamesDemo/img/particles/yellow-sphere.png"), ],
				start : {
					alpha : 1,
					scale : {
						min : 0.1,
						max : 0.3
					}
				},
				end : {
					position : {
						y : {
							min : "-100",
							max : "-150"
						},
						x : {
							min : "-10",
							max : "+10"
						}
					},
					alpha : 0,
					scale : {
						x : {
							min : 2,
							max : 2
						},
						y : {
							min : 2,
							max : 2
						}
					}
				}
			});
			scene.addChild(emitter);

			var emitter2 = new Joy.ParticleEmitter({
				emission : {
					min : 10,
					max : 50
				},
				particleLifetime : {
					min : 5,
					max : 10
				},
				position : new Joy.Vector2d(200, 200),
				sources : [ new Joy.Sprite("assets/js/apps/gamesDemo/img/particles/green-star.png"), new Joy.Sprite("assets/js/apps/gamesDemo/img/particles/yellow-star.png"), ],
				ease : Joy.TweenManager.Easing.Sinusoidal.Out,
				start : {
					alpha : 1,
					scale : {
						min : 0.1,
						max : 0.2
					}
				},
				end : {
					position : {
						y : {
							min : "-100",
							max : "+100"
						},
						x : {
							min : "-100",
							max : "+100"
						}
					},
					alpha : 0,
					rotation : {
						min : "-100",
						max : "+100"
					},
					scale : {
						x : {
							min : 2,
							max : 3
						},
						y : {
							min : 2,
							max : 3
						},
					}
				}
			});
			scene.addChild(emitter2);

			var emitter3 = new Joy.ParticleEmitter({
				emission : {
					min : 10,
					max : 50
				},
				lifetime : 10,
				particleLifetime : {
					min : 5,
					max : 10
				},
				position : new Joy.Vector2d(600, 200),
				sources : [ new Joy.Sprite("assets/js/apps/gamesDemo/img/particles/green-star.png"), new Joy.Sprite("assets/js/apps/gamesDemo/img/particles/yellow-star.png"), ],
				ease : Joy.TweenManager.Easing.Bezier,
				start : {
					alpha : 1,
					scale : {
						min : 0.1,
						max : 0.2
					}
				},
				end : {
					position : {
						y : {
							min : "-50",
							max : "+50"
						},
						x : {
							min : "-50",
							max : "+50"
						}
					},
					alpha : 0,
					rotation : {
						min : "-100",
						max : "+100"
					}
				}
			});
			scene.addChild(emitter3);
		});
	};
	return run;

})