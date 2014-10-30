define([ 'vendor/storyjs-embed' ], function() {
	var run = function() {
		createStoryJS({
			type : 'timeline',
			width : '800',
			height : '600',
			source : 'assets/js/apps/utilities/example_json.json',
			embed_id : 'my-timeline',
			//debug : true
		});
	};
	return run;
})