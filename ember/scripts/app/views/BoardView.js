define([ 'ember', 'text!templates/boardTemplate.html' ], function(Ember, boardTpl) {

	Ember.TEMPLATES["board"] = Ember.Handlebars.compile(boardTpl);

	return Ember.View.extend({
	    templateName: "board",
	});
})