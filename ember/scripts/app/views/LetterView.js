define([ 'ember' ], function(Ember) {
	return Ember.View.extend({
		classNameBindings : [ ':letter', 'chosen', 'ownerClass', 'content.fortified' ],
		boardBinding : 'controller.content',

		// Set the CSS class to be the id of the current `Letter`, if present.
		ownerClass : function() {
			var owner = this.get('content.owner');
			if (!owner) {
				return null;
			}
			return owner.get('id');
		}.property('content.owner'),

		// No need for a template for one letter!
		render : function(buffer) {
			buffer.push(this.get('content.letter'));
		}
	});
})