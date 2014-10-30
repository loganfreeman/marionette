define(['text!app/templates/rotated-header.html', 'text!templates/boardTemplate.html', 'css!cssfolder/rotatedHeader', ], function(rotatedTpl, boardTpl) {
	var tabs = {
		tabs : [ {
			order : 4,
			name: 'Rotated Column Header',
		    html: rotatedTpl,
		} ]
	}

	return tabs;
});
