/**
 *   **ApplicationController**: Handles controls at the application level.
 */
define([ "ember" ], function(Ember) {
	var ApplicationController = Ember.Controller.extend({

		// Whether the instructions are being displayed.
		instructionsVisible : false,

		// Toggle displaying the instructions.
		toggleInstructions : function() {
			this.toggleProperty('instructionsVisible');
		}
	});

	return ApplicationController;
});
