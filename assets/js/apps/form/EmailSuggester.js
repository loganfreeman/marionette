define(function() {
	var EmailDomainSuggester = {

		domains : [ "yahoo.com", "gmail.com", "google.com", "hotmail.com", "me.com", "aol.com", "mac.com", "live.com", "comcast.com", "googlemail.com", "msn.com", "hotmail.co.uk", "yahoo.co.uk", "facebook.com", "verizon.net", "att.net", "gmz.com", "mail.com" ],

		bindTo : $('#email'),

		init : function() {
			this.addElements();
			this.bindEvents();
		},

		addElements : function() {
			// Create empty datalist
			this.datalist = $("<datalist />", {
				id : 'email-options'
			}).insertAfter(this.bindTo);
			// Corelate to input
			this.bindTo.attr("list", "email-options");
		},

		bindEvents : function() {
			this.bindTo.on("keyup", this.testValue);
		},

		testValue : function(event) {
			var el = $(this), value = el.val();

			// email has @
			// remove != -1 to open earlier
			if (value.indexOf("@") != -1) {
				value = value.split("@")[0];
				EmailDomainSuggester.addDatalist(value);
			} else {
				// empty list
				EmailDomainSuggester.datalist.empty();
			}

		},

		addDatalist : function(value) {
			var i, newOptionsString = "";
			for (i = 0; i < this.domains.length; i++) {
				newOptionsString += "<option value='" + value + "@" + this.domains[i] + "'>";
			}

			// add new ones
			this.datalist.html(newOptionsString);
		}

	}
	return EmailDomainSuggester;
})