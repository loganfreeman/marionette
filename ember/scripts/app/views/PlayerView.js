define([ 'ember','text!templates/playerTemplate.html' ], function(playerTpl) {
	
	Ember.TEMPLATES["player"] = Ember.Handlebars.compile(playerTpl);

	return Ember.View.extend({
		classNameBindings : [ ':player', 'content.id', 'content.isTurn' ],
		templateName : 'player'
	});
})