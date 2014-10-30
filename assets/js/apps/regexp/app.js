define([ 'app', "tpl!apps/regexp/templates/index.tpl", "tpl!apps/regexp/templates/groups.tpl", 'less!apps/regexp/templates/style', 'slade' ], function(App, indexTpl, groupsTpl) {
	App.module('RegExpApp', function(RegExpApp, App, Backbone, Marionette, $, _) {

		RegExpApp.RegExpModel = Backbone.Model.extend({
			defaults : {
				pattern : '',
				flags : '',
				string : ''
			},

			// watch for changes to the properties applied to the RegExp object
			initialize : function() {
				this.on('change:pattern change:flags', this.updateRegex);
				this.updateRegex();
			},

			// update the underlying RegExp object, track any error messages
			updateRegex : function() {
				this.unset('re');
				this.unset('error');

				try {
					this.set('re', new RegExp(this.get('pattern'), this.get('flags')));
				} catch (e) {
					this.set('error', e);
				}
			},

			getMatches : function() {
				var regex = this.attributes;
				var re = regex.re;

				var matches = [];
				var groups = [];

				if (re instanceof RegExp) {

					// work on the input line-by-line
					var strings = (regex.string).split('\n');
					var result;

					for ( var i = 0; i < strings.length; i++) {
						var string = strings[i];

						// matches for just this line
						var match = [];
						var group = [];

						while (result = re.exec(string)) {
							var from = result.index;
							var to = from + result[0].length;

							match.push({
								from : from,
								to : to
							});
							if ((re.global || group.length === 0) && result.length > 0) {
								group.push(_.filter(_.rest(result, 1), function(s) {
									return s !== undefined && s.length > 0;
								}));
							}

							if (to === 0) {
								break;
							}
							string = string.substr(to);
							re.lastIndex = 0;
						}

						// save matches and groups
						matches.push(match);
						_.each(group, function(g) {
							if (!_.isEmpty(g)) {
								groups.push(g);
							}
						});

						// reset lastIndex for next line
						re.lastIndex = 0;
					}
				}

				return {
					matches : matches,
					groups : groups
				};
			}
		});
		
		RegExpApp.regExpObj = new RegExpApp.RegExpModel();

		RegExpApp.MainView = Marionette.ItemView.extend({
			template : indexTpl,
			model: RegExpApp.RegExpModel,
			
			onRender: function(){
				var that = this;
		        // update the Regex Model when the input changes
		        this.$('#pattern, #flags, #string').each(function() {
		          var input = $(this);

		          // use only the event that gets here first
		          input.on('input keyup', function() {
		            var value = input.val();
		            if (input.data('cached') !== value) {
		              input.data('cached', value);
		              that.updateModel();
		            }
		          });
		        });
			},
			
			ui : {
				pattern : "#pattern",
				flags : '#flags',
				string : '#string',
				notice : '#notice',
				error : '#error',
				matches : '#matches',
				groups : '#groups'
			},

			updateModel : function() {
				var that = this;
				this.model.set({
					pattern : that.ui.pattern.val(),
					flags : that.ui.flags.val(),
					string : that.ui.string.val()
				});
			},
			modelEvents : {
				'update' : 'updateFields',
				'change' : 'updateView'
			},
			updateFields : function() {
				var regex = this.model.attributes;

				this.ui.pattern.val(regex.pattern);
				this.ui.flags.val(regex.flags);
				this.ui.string.val(regex.string);
			},

			// update the View when the Regex Model changes
			updateView : function() {
				var regex = this.model.attributes;

				// only show the error box if there is an error
				if (regex.error === undefined) {
					this.ui.notice.sladeUp(function() {
						this.ui.error.val(regex.error);
					});
				} else {
					this.ui.error.val(regex.error);
					this.ui.notice.sladeDown();
				}

				var strings = (regex.string).split('\n');

				var results = this.model.getMatches();
				var matches = results.matches;
				var groups = results.groups;

				var mOutput = '';
				for ( var i = 0; i < matches.length; i++) {
					var lineMatches = matches[i];
					var string = strings[i];

					// look for matches line-by-line
					for ( var j = 0; j < lineMatches.length; j++) {
						var match = lineMatches[j];
						mOutput += _.escape(string.slice(0, match.from));
						var matchStr = _.escape(string.slice(match.from, match.to));
						if (matchStr.length > 0) {
							mOutput += '<span>' + matchStr + '</span>';
						}
						string = string.slice(match.to);
					}

					mOutput += _.escape(string) + '\n';
				}

				(mOutput.length === 0 || mOutput === '\n') ? this.ui.matches.hide().html('') : this.ui.matches.html(mOutput).show();
				
				var gOutput = groupsTpl({groups : groups});

				(gOutput.length === 0 || gOutput === '\n') ? this.ui.groups.hide().html('') : this.ui.groups.html(gOutput).show();

			},
		});

		RegExpApp.controller = {
			show : function() {
				App.navigate("regexp");
				App.mainRegion.show(new RegExpApp.MainView({model: RegExpApp.regExpObj}));
			}
		}

		App.on("regexp:show", function() {
			RegExpApp.controller.show();
		});

		RegExpApp.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"regexp" : "show"
			}
		});

		RegExpApp.addInitializer(function() {
			new RegExpApp.Router({
				controller : RegExpApp.controller
			});
		});
	});
	return App.RegExpApp.controller;
})