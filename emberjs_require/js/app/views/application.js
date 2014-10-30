define('app/views/application', [
		'app/views/stats',
		'app/views/filters',
		'app/views/clear_button',
		'text!app/templates/home_button.html',
		'ember'
	],
	/**
	 * Main application view
	 *
	 * @param Class StatsView, stats view class
	 * @param Class FiltersView, filters view class
	 * @param Class ClearBtnView, clear button view class
	 * @returns Class
	 */
	function( StatsView, FiltersView, ClearBtnView, button_html ) {
		return Ember.ContainerView.extend({
				childViews: [ 'headerView', 'mainView', 'footerView' ],
				headerView: Ember.ContainerView.create({
					childViews: [ 'homeBtnView', 'titleView', 'createTodoView' ],
					elementId: 'header',
					tagName: 'header',
					homeBtnView: Ember.View.create({
						template: Ember.Handlebars.compile( button_html ),
						click: function(evt) {
							window.location.href = '../index.html';
						  }
					}),
					titleView: Ember.View.create({
						tagName: 'h1',
						template: function() {
							return 'todos';
						}
					}),
					createTodoView: Ember.TextField.create({
						entriesBinding: 'controller.namespace.entriesController',
						placeholder: 'What needs to be done?',
						elementId: 'new-todo',
						insertNewline: function() {
							var value = this.get( 'value' );
							if ( value ) {
								this.get( 'entries' ).createNew( value );
								this.set( 'value', '' );
							}
						}
					}),
				}),
				mainView: Em.ContainerView.create({
					elementId: 'main',
					tagName: 'section',
					visibilityBinding: 'controller.namespace.entriesController.noneLeft',
					classNameBindings: [ 'visibility:hidden' ],
					childViews: [ 'outletView', 'markAllChkbox' ],
					outletView: Ember.View.create({
						template: Ember.Handlebars.compile( '{{outlet}}' ),
					}),
					markAllChkbox: Ember.Checkbox.create({
						entriesBinding: 'controller.namespace.entriesController',
						elementId: 'toggle-all',
						checkedBinding: 'entries.allAreDone'
					})
				}),
				footerView: Ember.ContainerView.create({
					elementId: 'footer',
					tagName: 'footer',
					visibilityBinding: 'controller.namespace.entriesController.noneLeft',
					classNameBindings: [ 'visibility:hidden' ],
					childViews: [
						StatsView.create(),
						FiltersView.create(),
						ClearBtnView.create()
					]
				})
			})
	}
);
