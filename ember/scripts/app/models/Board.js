define([ 'ember', 'models/Player' , 'models/Letter'], function(Ember, Player, Letter) {
	var board = Ember.Object.extend({

		// The dimensions of the board. It's always square so we just need
		// one size.
		SIZE : 5,

		// Start a new game on the board.
		restart : function() {

			// When a game begins, there is no winner.
			this.set('winner', null);

			// There are two players. We'll identify them as *p1* and *p2*
			this.set('player1', Player.create({
				id : 'p1',
				board : this
			}));
			this.set('player2', Player.create({
				id : 'p2',
				board : this
			}));

			// The first turn always goes to *p1*
			this.set('currentPlayer', this.get('player1'));

			// Clear the current word being built by the players.
			this.clearWord();

			// `played` is a list of all previously played words.
			this.set('played', Ember.A());

			// `rows` is the collection of rows that make up the board.
			this.set('rows', Ember.A());

			// Assemble a board of random `letter`s. Each `letter` is given a
			// random
			// uppercase ascii character and an id to identify it.
			var letterId = 0;
			for (var j = 0; j < this.SIZE; j += 1) {
				var row = Ember.A();
				for (var i = 0; i < this.SIZE; i += 1) {
					var letter = Letter.create({
						id : letterId,
						letter : String.fromCharCode(65 + Math.round(Math.random() * 25))
					});
					row.pushObject(letter);
					letterId += 1;
				}
				this.rows.pushObject(row);
			}
		},

		// The game has history once at least one word has been played. We use
		// this
		// to determine whether to show the list of previous words at the bottom
		// of
		// the interface.
		hasHistory : function() {
			return this.get('played').length > 0;
		}.property('played.@each'),

		// Add a letter to the word being built.
		addLetter : function(letter) {
			this.get('word').pushObject(letter);
		},

		// Remove a letter from the word being built.
		removeLetter : function(letter) {
			this.get('word').removeObject(letter);
		},

		// Remove all letters from the word.
		clearWord : function() {
			this.set('word', Ember.A());
		},

		// Switch to the next player's turn and clear the current word in
		// progress.
		nextTurn : function() {
			this.clearWord();
			this.set('currentPlayer', this.get('otherPlayer'));
		},

		// Our current word is a collection of `Letter` instances. This property
		// returns the word as a string.
		wordAsString : function() {
			var result = "";
			this.get('word').forEach(function(letter) {
				result += letter.get('letter');
			});
			return result;
		}.property('word.@each'),

		// `otherPlayer` is a reference to the `Player` who currently isn't
		// taking
		// their turn.
		otherPlayer : function() {
			if (this.get('currentPlayer') === this.get('player1'))
				return this.get('player2');
			return this.get('player1');
		}.property('currentPlayer'),

		// If the current word is being made up of letters belonging to the
		// other player,
		// we consider them stolen. To correctly display the other player's
		// possible score
		// we need to calculate how many points have been stolen.
		// fortified letters cannot be stolen.
		stolenScore : function() {
			var result = 0, otherPlayer = this.get('otherPlayer');
			this.get('word').forEach(function(letter) {
				if (letter.get('owner') === otherPlayer && !letter.get('fortified')) {
					result += 1;
				}
			});
			return result;
		}.property('word.@each'),

		// The score of the current word. Each `Letter` is worth one point if it
		// doesn't belong
		// to the player making the movie and it hasn't been foritifed.
		score : function() {
			var result = 0, currentPlayer = this.get('currentPlayer');
			this.get('word').forEach(function(letter) {
				if ((letter.get('owner') !== currentPlayer) && (!letter.get('fortified'))) {
					result += 1;
				}
			});
			return result;
		}.property('word.@each'),

		// Finish the current game.
		finishGame : function(resigned) {

			// If a player resigned, the other player automatically wins.
			if (resigned) {
				this.set('winner', this.get('otherPlayer'));
			} else {

				// Otherwise, the winner is simply the player with the larger
				// score.
				var diff = this.get('player1.score') - this.get('player2.score');
				if (diff > 0) {
					this.set('winner', this.get('player1'));
				} else if (diff < 0) {
					this.set('winner', this.get('player2'));
				}
			}
		},

		// Submit the current word in play.
		submitWord : function() {

			// We call `updateScore` on both players to make their
			// `possibleScore`s
			// permanent.
			var currentPlayer = this.get('currentPlayer');
			currentPlayer.updateScore();
			this.get('otherPlayer').updateScore();

			// Give ownership of each `Letter` in the word to the current player
			// unless the
			// `Letter` is fortitied.
			this.get('word').forEach(function(letter) {
				// Change the color unless it's fortified
				if (!letter.get('fortified')) {
					letter.set('owner', currentPlayer);
				}
			});

			// We need to iterate through every `Letter` on the board to
			// determine if they
			// are fortified. During this iteration, we also determine whether
			// every `Letter`
			// has a colour. If so, the game is over.
			var boardFull = true;
			for (var y = 0; y < this.SIZE; y++) {
				for (var x = 0; x < this.SIZE; x++) {
					var letter = this.rows[y][x];
					var owner = letter.get('owner.id');

					// By default we remove fortification (it will be applied
					// again if still valid.)
					letter.set('fortified', false);

					if (owner) {
						// Check the NESW neighbors of the tile
						if ((y > 0) && (this.rows[y - 1][x].get('owner.id') != owner))
							continue;
						if ((y < this.SIZE - 1) && (this.rows[y + 1][x].get('owner.id') != owner))
							continue;
						if ((x > 0) && (this.rows[y][x - 1].get('owner.id') != owner))
							continue;
						if ((x < this.SIZE - 1) && (this.rows[y][x + 1].get('owner.id') != owner))
							continue;

						// If all neighbours are the same colour, fortify it.
						letter.set('fortified', true);
					} else {
						// If a single tile has no owner, we don't consider the
						// board full.
						boardFull = false;
					}
				}
			}

			// Add the word to the played list
			this.get('played').addObject(EmberPress.Word.create({
				value : this.get('wordAsString'),
				playedBy : this.get('currentPlayer')
			}));

			// If the board is full, finish the game.
			if (boardFull) {
				this.finishGame(false);
			} else {
				// Otherwise, skip to the next player's turn.
				this.nextTurn();
			}
		}

	});
	return board;
})