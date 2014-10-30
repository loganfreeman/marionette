define(['ember', 'views/LetterView'], function(Ember, LetterView){
	return LetterView.extend({

    // If the player clicks a letter in the word, we remove it.
    click: function() {
      this.get('board').removeLetter(this.get('content'));
    }

  });
})