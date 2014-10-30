App.BookmarksController = Ember.ArrayController.extend({
	actions : {
		pop : function() {
			App.view = App.AlertView.create({
				message : "Adding the modal overlay screen makes the dialog look more prominent because it dims out the page content!"
			});
			App.view.append();

		},
	}
});
