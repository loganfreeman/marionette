define([ 'app',
         'tpl!apps/sqlparser/view.tpl',
         'apps/sqlparser/sql-parser',
         'css!apps/sqlparser/style',
         'codemirror'
         ], function(App, viewTpl, SQLParser) {
	App.module('SqlParser', function(SqlParser, App, Backbone, Marionette, $, _) {

		SqlParser.MainView = Marionette.ItemView.extend({
			template : viewTpl,
			className : 'parser-wrapper',
			events : {
				'click #parse' : 'parse'
			},
			parse : function(){
				var parsed = SQLParser.parse(this.editor.getValue()).toString();
				$('#parsed').val(parsed);
			},
			onShow: function(){
				var that = this;
	        	this.editor = CodeMirror.fromTextArea($('#code')[0], {
	        		 lineNumbers: true,
	        	        matchBrackets: true,
	        	        indentUnit: 4,
	        	        mode: "text/x-plsql"
	            });
	        	this.editor.on('change', function(){
	        		console.log(that.editor.getValue());
	        	});
			}
		});

		SqlParser.controller = {
			show : function() {
				App.navigate("SqlParser");
				App.mainRegion.show(new SqlParser.MainView());
			}
		}

		App.on("SqlParser:show", function() {
			SqlParser.controller.show();
		});

		SqlParser.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"SqlParser" : "show"
			}
		});

		SqlParser.addInitializer(function() {
			new SqlParser.Router({
				controller : SqlParser.controller
			});
		});
	});
	return App.SqlParser.controller;
})