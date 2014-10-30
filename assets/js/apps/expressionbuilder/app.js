define([ 'app',
         'stache!apps/expressionbuilder/view',
         'css!apps/expressionbuilder/style', 'expressionBuilder'], function(App, viewTpl) {
	App.module('expressionbuilder', function(expressionbuilder, App, Backbone, Marionette, $, _) {
		
	    var subExpressions = [
	                          {'groupName': 'Composite Comparisons',
	                            'values': [
	                              {'displayName': '!', 'displayNameParens':'Not', 'description': 'Returns true if the value on the right is evaluates to false', 'returnType': 'BOOLEAN', 'rightType': 'BOOLEAN'},
	                              {'displayName': 'and', 'expressionValue':'&&', 'description': 'Returns true if BOTH the value on the right and left evaluate to true', 'returnType': 'BOOLEAN', 'leftType': 'BOOLEAN', 'rightType': 'BOOLEAN'},
	                              {'displayName': 'or', 'expressionValue':'||', 'description': 'Returns true if EITHER the value on the right and left evaluate to true', 'returnType': 'BOOLEAN', 'leftType': 'BOOLEAN', 'rightType': 'BOOLEAN'}
	                            ]
	                          },
	                          {'groupName': 'Equals/Not Equals',
	                            'values': [
	                              {'displayName': 'not equals', 'expressionValue':'!=', 'description': 'Returns true if the two values are not equal', 'returnType': 'BOOLEAN', 'leftType': ['NUMBER', 'TEMPORAL', 'TEXT', 'OPTION'], 'rightType': ['NUMBER', 'TEMPORAL', 'TEXT', 'OPTION']},
	                              {'displayName': 'equals', 'expressionValue':'==', 'description': 'Returns true if the two values are equal', 'returnType': 'BOOLEAN', 'leftType': ['NUMBER', 'TEMPORAL', 'TEXT', 'OPTION'], 'rightType': ['NUMBER', 'TEMPORAL', 'TEXT', 'OPTION']}
	                            ]
	                          },
	                          {'groupName': 'Number Comparisons',
	                            'values': [
	                              {'displayName': '<', 'displayNameParens': 'Less Than', 'expressionValue':'<', 'description': 'Returns true if the number on the left is less than that on the right', 'returnType': 'BOOLEAN', 'leftType': 'NUMBER', 'rightType': 'NUMBER'},
	                              {'displayName': '<=', 'displayNameParens': 'Less Than Or Equals', 'expressionValue':'<=', 'description': 'Returns true if the number on the left is less than or equal to that on the right', 'returnType': 'BOOLEAN', 'leftType': 'NUMBER', 'rightType': 'NUMBER'},
	                              {'displayName': '>', 'displayNameParens': 'Greater Than', 'expressionValue':'>', 'description': 'Returns true if the number on the left is greater than that on the right', 'returnType': 'BOOLEAN', 'leftType': 'NUMBER', 'rightType': 'NUMBER'},
	                              {'displayName': '>=', 'displayNameParens': 'Greater Than Or Equals', 'expressionValue':'>=', 'description': 'Returns true if the number on the left is greater than or equal to that on the right', 'returnType': 'BOOLEAN', 'leftType': 'NUMBER', 'rightType': 'NUMBER'}
	                            ]
	                          },
	                          {'groupName': 'Date Comparisons',
	                            'values': [
	                              {'displayName': 'is before', 'expressionValue':'<', 'description': 'Returns true if the date on the left is before that on the right', 'returnType': 'BOOLEAN', 'leftType': 'TEMPORAL', 'rightType': 'TEMPORAL'},
	                              {'displayName': 'is before or on', 'expressionValue':'<=', 'description': 'Returns true if the date on the left is before or the same date as that on the right', 'returnType': 'BOOLEAN', 'leftType': 'TEMPORAL', 'rightType': 'TEMPORAL'},
	                              {'displayName': 'is after', 'expressionValue':'>', 'description': 'Returns true if the date on the left is after that on the right', 'returnType': 'BOOLEAN', 'leftType': 'TEMPORAL', 'rightType': 'TEMPORAL'},
	                              {'displayName': 'is after or on', 'expressionValue':'>=', 'description': 'Returns true if the date on the left is after or the same date as that on the right', 'returnType': 'BOOLEAN', 'leftType': 'TEMPORAL', 'rightType': 'TEMPORAL'}
	                            ]
	                          },
	                          {'groupName': 'Number Operators',
	                           'values': [
	                             {'displayName': '+', 'displayNameParens':'Addition', 'description': 'Add two numbers together', 'returnType': 'NUMBER', 'leftType': 'NUMBER', 'rightType': 'NUMBER'},
	                             {'displayName': '-', 'displayNameParens':'Subtraction', 'description': 'Subtract two numbers', 'returnType': 'NUMBER', 'leftType': 'NUMBER', 'rightType': 'NUMBER'},
	                             {'displayName': '*', 'displayNameParens':'Multiplication', 'description': 'Multiple two numbers together', 'returnType': 'NUMBER', 'leftType': 'NUMBER', 'rightType': 'NUMBER'},
	                             {'displayName': '/', 'displayNameParens':'Division', 'description': 'Divide two numbers', 'returnType': 'NUMBER', 'leftType': 'NUMBER', 'rightType': 'NUMBER'}
	                           ]
	                         },
	                         {'groupName': 'Numerical Aggregate Functions',
	                           'values': [
	                             {'displayName': 'Min', 'expressionValue':'Math.min', 'description': 'Get the minimum number from a list of numbers', 'rightType': '(NUMBER...)', 'returnType': 'NUMBER'},
	                             {'displayName': 'Max', 'expressionValue':'Math.max', 'description': 'Get the maximum number from a list of numbers', 'rightType': '(NUMBER...)', 'returnType': 'NUMBER'}
	                           ]
	                         },
	                         {'groupName': 'Date Functions',
	                           'values': [
	                             {'displayName': 'parseDate', 'expressionValue':'Date.parse', 'description': 'Parse a date in the form: January 1, 1970', 'rightType': '(TEXT)', 'returnType': 'TEMPORAL'}
	                           ]
	                         },
	                          {'groupName': 'Number Functions',
	                           'values': [
	                             {'displayName': 'Round', 'expressionValue':'Math.round', 'description': 'Round a number half up', 'rightType': '(NUMBER)', 'returnType': 'NUMBER'},
	                             {'displayName': 'Ceiling', 'expressionValue':'Math.ceil', 'description': 'Get the ceiling of a number', 'rightType': '(NUMBER)', 'returnType': 'NUMBER'},
	                             {'displayName': 'Floor', 'expressionValue':'Math.floor', 'description': 'Return the floor of a number', 'rightType': '(NUMBER)', 'returnType': 'NUMBER'},
	                             {'displayName': 'Exponent', 'expressionValue':'Math.pow', 'description': 'Return a number raised to an exponent', 'rightType': '(NUMBER, NUMBER)', 'returnType': 'NUMBER'}
	                            ]
	                          }
	                        ];

		expressionbuilder.MainView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
		        $("div#exprBldr").expressionBuilder(subExpressions);
		         $("#exprReturnTypeSelect > .btn").click(function () {
		            $("#exprReturnTypeSelect > .btn").removeClass("active");
		            $(this).toggleClass("active");
		            $("div#exprBldr").expressionBuilder('setReturnType', $(this).text());
		        });
		       $("div#exprBldr").on('eb-expression-complete', function () {
		          console.log('ex com');
		          $("#evalBtn").show();
		        });
		        $("div#exprBldr").on('eb-clear', function () {
		          $(".evalElem").hide();
		        });
		        $("#evalBtn").click(function() {
		          $('#exprEvalValue').text(eval($("div#exprBldr").expressionBuilder('getExpressionValue')));
		          $('.evalElem').show();
		        });
			}
		});

		expressionbuilder.controller = {
			show : function() {
				App.navigate("expressionbuilder");
				App.mainRegion.show(new expressionbuilder.MainView());
			}
		}

		App.on("expressionbuilder:show", function() {
			expressionbuilder.controller.show();
		});

		expressionbuilder.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"expressionbuilder" : "show"
			}
		});

		App.addInitializer(function() {
			new expressionbuilder.Router({
				controller : expressionbuilder.controller
			});
		});
	});
	return App.expressionbuilder.controller;
})