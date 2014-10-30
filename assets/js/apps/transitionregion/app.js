define([ 'app', 'stache!apps/transitionregion/templates/layout', 'stache!apps/transitionregion/templates/mainview', 'stache!apps/transitionregion/templates/subview', 'stache!apps/transitionregion/templates/autocomplete', 'less!apps/transitionregion/less-style/style', 'jquery.autocomplete', 'transitionregion', 'codemirror', 'javascript', 'formatting', 'css!apps/transitionregion/templates/codeeditor' ], function(App, layoutTpl, mainViewTpl, subViewTpl, autocompleteTpl) {
	App.module('Transition', function(Transition, App, Backbone, Marionette, $, _) {

		Transition.collection = new Backbone.Collection([ {
			id : "AB",
			name : "Alberta"
		}, {
			id : "BC",
			name : "British Columbia"
		}, {
			id : "MB",
			name : "Manitoba"
		}, {
			id : "NB",
			name : "New Brunswick"
		}, {
			id : "NL",
			name : "Newfoundland and Labrador"
		}, {
			id : "NT",
			name : "Northwest Territories"
		}, {
			id : "NS",
			name : "Nova Scotia"
		}, {
			id : "NU",
			name : "Nunavut"
		}, {
			id : "ON",
			name : "Ontario"
		}, {
			id : "PE",
			name : "Prince Edward Island"
		}, {
			id : "QC",
			name : "Quebec"
		}, {
			id : "SK",
			name : "Saskatchewan"
		}, {
			id : "YT",
			name : "Yukon"
		}, {
			id : "AL",
			name : "Alabama"
		}, {
			id : "AK",
			name : "Alaska"
		}, {
			id : "AS",
			name : "American Samoa"
		}, {
			id : "AZ",
			name : "Arizona"
		}, {
			id : "AR",
			name : "Arkansas"
		}, {
			id : "CA",
			name : "California"
		}, {
			id : "CO",
			name : "Colorado"
		}, {
			id : "CT",
			name : "Connecticut"
		}, {
			id : "DE",
			name : "Delaware"
		}, {
			id : "DC",
			name : "District of Columbia"
		}, {
			id : "FM",
			name : "Federated States of Micronesia"
		}, {
			id : "FL",
			name : "Florida"
		}, {
			id : "GA",
			name : "Georgia"
		}, {
			id : "GU",
			name : "Guam"
		}, {
			id : "HI",
			name : "Hawaii"
		}, {
			id : "ID",
			name : "Idaho"
		}, {
			id : "IL",
			name : "Illinois"
		}, {
			id : "IN",
			name : "Indiana"
		}, {
			id : "IA",
			name : "Iowa"
		}, {
			id : "KS",
			name : "Kansas"
		}, {
			id : "KY",
			name : "Kentucky"
		}, {
			id : "LA",
			name : "Louisiana"
		}, {
			id : "ME",
			name : "Maine"
		}, {
			id : "MH",
			name : "Marshall Islands"
		}, {
			id : "MD",
			name : "Maryland"
		}, {
			id : "MA",
			name : "Massachusetts"
		}, {
			id : "MI",
			name : "Michigan"
		}, {
			id : "MN",
			name : "Minnesota"
		}, {
			id : "MS",
			name : "Mississippi"
		}, {
			id : "MO",
			name : "Missouri"
		}, {
			id : "MT",
			name : "Montana"
		}, {
			id : "NE",
			name : "Nebraska"
		}, {
			id : "NV",
			name : "Nevada"
		}, {
			id : "NH",
			name : "New Hampshire"
		}, {
			id : "NJ",
			name : "New Jersey"
		}, {
			id : "NM",
			name : "New Mexico"
		}, {
			id : "NY",
			name : "New York"
		}, {
			id : "NC",
			name : "North Carolina"
		}, {
			id : "ND",
			name : "North Dakota"
		}, {
			id : "MP",
			name : "Northern Mariana Islands"
		}, {
			id : "OH",
			name : "Ohio"
		}, {
			id : "OK",
			name : "Oklahoma"
		}, {
			id : "OR",
			name : "Oregon"
		}, {
			id : "PW",
			name : "Palau"
		}, {
			id : "PA",
			name : "Pennsylvania"
		}, {
			id : "PR",
			name : "Puerto Rico"
		}, {
			id : "RI",
			name : "Rhode Island"
		}, {
			id : "SC",
			name : "South Carolina"
		}, {
			id : "SD",
			name : "South Dakota"
		}, {
			id : "TN",
			name : "Tennessee"
		}, {
			id : "TX",
			name : "Texas"
		}, {
			id : "UT",
			name : "Utah"
		}, {
			id : "VT",
			name : "Vermont"
		}, {
			id : "VI",
			name : "Virgin Islands"
		}, {
			id : "VA",
			name : "Virginia"
		}, {
			id : "WA",
			name : "Washington"
		}, {
			id : "WV",
			name : "West Virginia"
		}, {
			id : "WI",
			name : "Wisconsin"
		}, {
			id : "WY",
			name : "Wyoming"
		}, {
			id : "AA",
			name : "Armed Forces Americas"
		}, {
			id : "AE",
			name : "Armed Forces"
		}, {
			id : "AP",
			name : "Armed Forces Pacific"
		} ]);
		
		Transition.autoCompleteView  = Marionette.ItemView.extend({
		      template: autocompleteTpl, 
		      render: function(){
			     $(this.el).append(this.template);
			     $(this.el).find('#states_provinces').autocomplete({
			 		collection: Transition.collection,
					attr: 'name',
					noCase: true,
					ul_class: 'autocomplete shadow',
					ul_css: {'z-index':1234},
			    max_results: 5
				});
		      },
		      onShow: function(){
					$('[data-source]').each(function() {
						var $this = $(this), $source = $($this.data('source'));

						var text = [];
						$source.each(function() {
							var $s = $(this);
							if ($s.attr('type') == 'text/javascript') {
								text.push($s.html().replace(/(\n)*/, ''));
							} else {
								text.push($s.clone().wrap('<div>').parent().html());
							}
						});

						$this.text(text.join('\n\n').replace(/\t/g, '    '));
					});

					prettyPrint();
		      }
		    });

		Transition.Layout = Marionette.Layout.extend({
			template : layoutTpl,

			regions : {
				"mainRegion" : "#transition_main",
				subRegion : {
					selector : "#transition_sub",
					regionType : Marionette.TransitionRegion
				}
			}
		});

		Transition.MainView = Marionette.ItemView.extend({
			template : mainViewTpl,
			events : {
				"click .resetView" : "changeView"
			},
			changeView : function() {
				console.log('reset view');
				Transition.view.mainRegion.show(new Transition.autoCompleteView());
			}
		});

		Transition.SubView = Marionette.ItemView.extend({

			template : subViewTpl,
			getSelectedRange : function() {
				return {
					from : this.editor.getCursor('head'),
					to : this.editor.getCursor('end')
				};
			},
			events : {
			// 'click #codeEditor': 'transform',
			// 'click #autoformat': 'autoFormat',
			// 'click #commentSelection': 'commentSelection',
			// 'click #unCommentSelection': 'unCommentSelection'
			},
			autoFormat : function() {
				var range = this.getSelectedRange();
				this.editor.autoFormatRange(range.from, range.to);
			},
			commentSelection : function() {
				var range = this.getSelectedRange();
				this.editor.commentRange(true, range.from, range.to);
			},
			unCommentSelection : function() {
				var range = this.getSelectedRange();
				this.editor.commentRange(false, range.from, range.to);
			},

			onShow : function() {
				this.editor = CodeMirror.fromTextArea($('#code')[0], {
					lineNumbers : true,
					mode : 'javascript'
				});

				CodeMirror.commands['selectAll'](this.editor);
				this.autoFormat();
			}

		});

		Transition.view = new Transition.Layout();

		Transition.controller = {
			show : function() {
				App.navigate("transition-link");
				App.mainRegion.show(Transition.view);
				Transition.view.mainRegion.show(new Transition.MainView());
				Transition.view.subRegion.show(new Transition.SubView());
			}
		}

		App.on("transitionregion:show", function() {
			Transition.controller.show();
		});

		Transition.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"transition-link" : "show"
			}
		});

		Transition.addInitializer(function() {
			new Transition.Router({
				controller : {
					show : function() {
						Transition.controller.show();
					}
				}
			});
		});
	});
	return App.Transition.controller;
})