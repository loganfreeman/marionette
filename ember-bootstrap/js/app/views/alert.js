App.AlertView = Ember.View.extend({
	timeout : 2,
	templateName : "_alert",
	classNameBindings : [ "defaultClass", "content.kind" ],
	defaultClass : "alert-box",
	kind : null,
	controllerBinding : "content"

	,
	click : function() {
		var that = this;
		this.$().fadeOut(300, function() {
			that.removeFromParent();
		});
	},

	uiType : 'dialog',

	didInsertElement : function() {
		// this.$().hide().fadeIn(300);
		var ui = jQuery.ui[this.get('uiType')]({
			resizable : true,
			height : 200,
			modal : true,
			buttons : {
				"Delete all items" : function() {
					$(this).dialog("close");
				},
				Cancel : function() {
					$(this).dialog("close");
				}
			}
		}, this.get('element'));
		this.set('ui', ui);
	}
});
