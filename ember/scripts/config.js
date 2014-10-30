define({
	app_name : "MyExampleApp",
	map : {
		'*' : {
			'css' : 'libs/requirecss/css',
			'less' : 'libs/require-less/less'
		}
	},
	shim : {
		'ember' : {
			deps : [ 'handlebars', 'jquery' ],
			exports : 'Ember'
		},
		'jquery.ui' : [ 'jquery' ],
		'ember-animated-outlet' : ['ember', 'css!libs/ember/ember-animated-outlet'],
		'ember-data': ['ember'],
		'ember-data-adapter': ['ember']
	},
	paths : {
		'App' : 'app/main',
		'models' : 'app/models',
		'views' : 'app/views',
		'controllers' : 'app/controllers',
		'templates' : 'app/templates',
		'routes' : 'app/routes',
		/* libs */
		'jquery' : 'libs/jquery/1.9.1/jquery',
		'handlebars' : 'libs/handlebars/1.0.rc.3/handlebars',
		'ember' : 'libs/ember/1.0.0-rc.3/ember',
		'jquery.ui' : 'libs/jquery.ui/1.9.2/jquery-ui-1.9.2.custom.min',
		'bootstrap' : 'libs/bootstrap/2.2.2/js/boostrap',
		/* requirejs-plugins */
		'text' : 'libs/requirejs-plugins/text',
		'hbs' : 'libs/requirejs-plugins/hbs',
		'domReady' : 'libs/requirejs-plugins/domReady',
		'ember-animated-outlet': 'libs/ember/ember-animated-outlet',
		'ember-data': 'libs/ember/ember-data',
		'ember-data-adapter': 'libs/ember/ember.dataadapter',
		'moment' : 'libs/moment-2.0.0'
	},
	/* hbs plugin options */
	hbs : {
		disableI18n : true,
		templateExtension : "html"
	}
});