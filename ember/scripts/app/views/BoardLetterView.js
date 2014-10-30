define([ 'ember', 'views/LetterView' ], function(Ember, LetterView) {
	return LetterView.extend({

		// Has this letter been chosen?
		chosen : function() {
			return this.get('board.word').findProperty('id', this.get('content.id')) ? true : false;
		}.property('board.word.@each.id'),

		// The player clicked on a letter, so we want to add it to our word.
		click : function() {
			if (this.get('chosen'))
				return;
			this.get('board').addLetter(this.get('content'));
		}
	});
})