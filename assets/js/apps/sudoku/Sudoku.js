define(['app', 
        //'floating',
        //'carouFredSel',
        "tpl!apps/sudoku/templates/view.tpl",
        'css!apps/sudoku/templates/ui',
        'qTip',
        ], function(App, viewTpl){
	App.module('Sudoku', function(Sudoku, App, Backbone, Marionette, $, _){
		
		(function(root){
			'use strict';

			var solutions,
				terminate,
				max,
				size,
				X,
				Y;
			
			var validInRow = function (arr, i){
				var j,
					len;
					
				for(j = 0, len = arr.length; j < len; j += 1){
					if(arr[j] == i){
						return false;
					}
				}
				
				return true;
			};

			var validInColumn = function (arr, j, i){
				var l,
					len;
					
				for(l = 0, len = arr.length; l < len; l += 1){
					if(arr[l][j] == i){
						return false;
					}
				}
				
				return true;
			};

			var validInSmallBox = function (arr, i, j, k){
				var l,
					m,
					a,
					b,
					size = Math.sqrt(arr.length);
					
				for(l = Math.floor(i / size) * size, a = l + size; l < a; l += 1){
					for(m = Math.floor(j / size) * size, b = m + size; m < b; m += 1){
						if(arr[l][m] == k){
							return false;
						}
					}
				}
				
				return true;
			};
			
			
			/**
			 *
			 * @todo Refactor, there's a lot of repeated stuff here
			 */
			var checkX = function(arr, i, j, k){
				var l,
					m,
					len		= arr.length,
					crossed = false,
					existed = false;
					
				for(l = 0; l < len && X; l += 1){
					if(i == l && j == l){
						crossed = true;
					}
					if(arr[l][l] == k){
						existed = true;
					}
				}
				if(crossed && existed){
					return false;
				}
				
				crossed = false;
				existed = false;
				
				for(l = len - 1, m = 0; l >= 0 && X; l -= 1){
					if(i == m && j == l){
						crossed = true;
					}
					if(arr[m][l] == k){
						existed = true;
					}
					m += 1;
				}
				if(crossed && existed){
					return false;
				}
				
				return true;
			};
			
			var checkY = function(arr, i, j, k){
				var l,
					m,
					len			= arr.length,
					mid			= Math.floor(len / 2),
					crossed 	= false,
					midcrossed	= false,
					existed		= false;
				
				if(!len % 2){
					return true;
				}
				
				for(l = mid; l < len && Y; l+=1){
					if(l == i && mid == j){
						midcrossed = true;
					}
					if(arr[l][mid] == k){
						existed = true;
					}
				}
				if(midcrossed && existed){
					return false;
				}
				
				existed = false;
				
				for(l = 0; l < mid && Y; l+=1){
					if(l == i && l == j){
						crossed = true;
					}
					if(arr[l][l] == k){
						existed = true;
					}
				}
				if((midcrossed || crossed) && existed){
					return false;
				}
				
				crossed = false;
				existed = false;		
				
				for(l = len-1, m = 0; l > mid && Y; l-=1){
					if(m == i && l == j){
						crossed = true;
					}
					if(arr[m][l] == k){
						existed = true;
					}
					m += 1;
				}
				if((midcrossed || crossed) && existed){
					return false;
				}
				
				return true;
			};
			
			var valid = function(arr){
				var i,
					j,
					temp,
					len = arr.length;
					
				for(i = 0; i < len; i += 1){
					for(j = 0; j < len; j += 1){
						temp		= arr[i][j];
						arr[i][j]	= 0;
						if(!validInRow(arr[i], temp) || !validInColumn(arr, j, temp) || !validInSmallBox(arr, i, j, temp) || !checkX(arr, i, j, temp) || !checkY(arr, i, j, temp)){
							arr[i][j] = temp;
							return false;
						}
						arr[i][j] = temp;
					}
				}
				
				return true;
			};

			var output = function (arr){
				var i,
					j,
					len,
					output = "";
					
				for(len = arr.length, i = 0; i < len; i += 1){
					for(j = 0; j < len; j += 1){
						output += arr[i][j] + " ";
					}
					output += "\n";
				}
				console.log(output);
				
				return output;
			};
			
			var backtrack = Function.prototype;
			
			var tryCandidate = function(arr, i, j){
				for(var k=1; k <= arr.length && !terminate; k += 1){
					if(validInRow(arr[i], k) && validInColumn(arr, j, k) && validInSmallBox(arr, i, j, k) && checkX(arr, i, j, k) && checkY(arr, i, j, k)){
						arr[i][j] = k;
						backtrack(arr);
					}
					arr[i][j] = 0;
				}
			};
			
			backtrack = function (arr){
				var stop = false,
					i,
					j;
					
				for(i = 0; i < arr.length && !stop;i += 1){
					for(j = 0; j < arr.length && !stop;j += 1){
						if(arr[i][j] == 0){
							tryCandidate(arr, i, j);
							stop = true;
						}
					}
				}
				
				if(!stop && valid(arr)){
					solutions.push(JSON.stringify(arr));
					if(max > 0 && !--max){
						terminate = true;
					}
				}
			};
			
			var isArray = function (obj) {
				return Object.prototype.toString.call(obj) === "[object Array]";
			};
			
			var fixPuzzle = function(puzzle){
				var i,
					j,
					k,
					len,
					len2;
				
				size	= puzzle.length,
				len		= size;
					
				for(i = 0; i < size; i += 1){
					if(i >= len){
						puzzle[i] = Array.apply(null, new Array(size)).map(Number.prototype.valueOf,0);
						continue;
					}
					if(!isArray(puzzle[i])){
						output(puzzle);
						throw new Error('Puzzle ['+i+'] is not an array');
					}			
					len2 = puzzle[i].length;
					
					for(k = 0; k < len2; k += 1){
						if(isNaN(puzzle[i][k])){
							output(puzzle);
							throw new Error('Puzzle ['+i+']['+k+'] is not a number.');
						}
					}
					
					if(len2 > size){
						size = len2;
					}
					else if(len2 < size){
						for(j = puzzle[i].length; j < size; j += 1){
							puzzle[i][j] = 0;
						}
					}
				}
				
			};
			
			var solve = function(object){
				solutions	= [],
				terminate	= false,
				max			= false,
				size		= 0,
				X			= false,
				Y			= false;
				if(typeof object.puzzle == 'undefined'){
					throw new Error('Puzzle is missing.');
				}
				
				if(!isArray(object.puzzle)){
					throw new Error('Puzzle should be an array.');
				}
				
				fixPuzzle(object.puzzle);
				
				if(object.max_solutions && !isNaN(object.max_solutions)){
					max = object.max_solutions;
				}
				
				X = object.checkX;
				Y = object.checkY;
				
				console.log("Crunching numbers..");
				
				if(object.time){
					console.time("solve");
				}
				
				backtrack(object.puzzle);
				
				if(object.time){
					console.timeEnd("solve");
				}
				
				return solutions;
			};

			root.Solver = solve;
		})(Sudoku);

		function writeContent(content){
		    var sol = [],
		        solX = [],
		        solY = [];
		    contents = content;
		   var data = new Object();
		     contents = contents.split('\n');

		        var instances = contents.splice(0,1)[0];

		        data.instances = instances;
		        data.data = new Array();

		        for(var i=0;i<instances;i++){
		            b = new Object();
		        
		            var dimension = contents.splice(0,1)[0];
		        
		            b.dimension = dimension;
		        
		            var configrow;

		            var puzzle = []; 
		            for(var mary=0;mary<Math.pow(dimension,2);mary++){
		                configrow = (contents.splice(0,1) + '').split(' ');
		                puzzle.push(configrow);
		            }
		            b.matrix = puzzle;
		            data["data"][i] = b;
		        }
		        $('#hiddenDiv').innerText;
		        
		        var d = [];
		       
		        for(var i=0;i<data['data'].length; i++){
		            d.push(data['data'][i].matrix);
		        }

		        var array = d.splice(0);

		      for(var i=0;i< array.length;i++) {
		            var len = array[i].length;
		            sol.push(Sudoku.Solver({
		                'puzzle' : array[i],
		                'time' : true,
		            }));
		            solX.push(Sudoku.Solver({
		                'puzzle' : array[i],
		                'time' : true,
		                'checkX' : true
		            }));
		            solY.push(Sudoku.Solver({
		                'puzzle' : array[i],
		                'time' : true,
		                'checkY' : true
		            }));

		            var mFlip = true;
		            var flip = false;
		            var rcur = 0, rprev = 0;
		            var ccur = 0, cprev = 0;
		            var table = '<div class="qHolder" id="qNumber'+i+'"><table class="q" border=1>';
		            var sqrt = Math.sqrt(len);
		            for(var j=0;j<len;j++){
		                table += '<tr>';
		                rprev = rcur;
		                rcur = (Math.floor(j/sqrt) * sqrt) +''+ (Math.floor(k/sqrt) * sqrt);
		                if(rcur != rprev) mFlip = !mFlip;
		                flip = mFlip;

		                for(var k=0;k<len;k++){
		                    cprev = ccur;
		                    ccur = (Math.floor(j/sqrt) * sqrt) +''+ (Math.floor(k/sqrt) * sqrt);
		                    if(ccur != cprev) flip = !flip;

		                    table+='<td class="td_'+(j+1)+'_'+(k+1)+' ';
		                    if(array[i][j][k] == 0)
		                        table+='empty';
		                    else
		                        table+='filled';          
		                    if(flip) table+=' odd ';
		                    else table += ' even ';

		                    if(array[i][j][k] == 0)
		                        table+='"><input type="text"/></span>';
		                    else table+='">'+array[i][j][k];

		                    table += '</td>';
		                }
							
						table+='<td class="number">'+(j+1)+'</td>';
		            }
					table+='<tr>';
					for(var z = 0;z<len;z++)
						table+='<td class="number">'+(z+1)+'</td>';
					table+='<td class="number">&nbsp</td>';
					table+='</tr>';
		            table += '</table></div>';
		            $('#results').append(table);
		        }



		        $('#loading').fadeOut(1000).end();
		        $('#file').fadeOut(1000).end();

		        //$('#next').show();
		        //$('#prev').show();
		        /*
		        $("#results").carouFredSel({
		            circular: true,
		            infinite: true,
		            auto : false,
		            next : {
		                button : "#next",
		                key : "right"
		            },
		            prev : {
		                button : "#prev",
		                key : "left"
		            },
		            align: "left"
		        });
		        */

		        //console.log(sol,solX,solY);
		        var inst = sol.length;
		        for(var i=0;i<inst;i++){
		            var trgt = "#qNumber"+i;
		            
		            if(sol[i].length > 0){
		                var solArr = [];
		                var toApp = '<div class="sol"><p>Has '+sol[i].length+' solution(s)<br/>';

		                var arr = sol[i][0].replace("[[","").replace("]]","").replace("\\r","").split("],[");

		                for(var v=0;v<arr.length;v++){
		                    solArr.push(arr[v].replace("\\r","").replace('"','').split(','));
		                }
		                l = solArr[0].length;
		                for(var p=0;p<l;p++){
		                    for(var q=0;q<l;q++){
		                        toApp = toApp + parseInt(solArr[p][q].replace('"','')) + '&nbsp;&nbsp;';
		                    }
		                    toApp +='<br>';
		                }
		                toApp +='</p></div>';

		                $(trgt).append(toApp);
		            } else {
		                $(trgt).append('<div class="noSol">No Solution</div>');
		            }

		            // X - SOLUTIONs
		             if(solX[i].length > 0){
		                var solArr = [];
		                var toApp = '<div class="solX"><p>Has '+solX[i].length+' X solution(s)<br/>';

		                console.log(solX[i][0].replace("\r",""));
		                var arr = solX[i][0].replace("[[","").replace("]]","").split("],[");

		                for(var v=0;v<arr.length;v++){
		                    solArr.push(arr[v].split(','));
		                }
		                var l = solArr[0].length;
		                for(var p=0;p<l;p++){
		                    for(var q=0;q<l;q++){
		                        toApp = toApp + solArr[p][q] + '&nbsp;&nbsp;';
		                    }
		                    toApp +='<br>';
		                }
		                toApp +='</p></div>';

		                $(trgt).append(toApp);
		            } else {
		                $(trgt).append('<div class="noSolX">No X Solution</div>');
		            }

		            // Y - SOLUTIONS
		            if(solY[i].length > 0){
		                var solArr = [];
		                var toApp = '<div class="solY"><p>Has '+solY[i].length+' Y solution(s)<br/>';

		                console.log(solY[i][0].replace("\r",""));

		                var arr = solY[i][0].replace("[[","").replace("]]","").split("],[");


		                for(var v=0;v<arr.length;v++){
		                    solArr.push(arr[v].split(','));
		                }
		                var l = solArr[0].length;
		                for(var p=0;p<l;p++){
		                    for(var q=0;q<l;q++){
		                        toApp = toApp + solArr[p][q] + '&nbsp;&nbsp;';
		                    }
		                    toApp +='<br>';
		                }
		                toApp +='</p></div>';
		                $(trgt).append(toApp);
		            } else {
		                $(trgt).append('<div class="noSolY">No Y Solution</div>');
		            }
		        }  
		}

		function sleep(milliseconds) {
		  var start = new Date().getTime();
		  for (var i = 0; i < 1e7; i++) {
		    if ((new Date().getTime() - start) > milliseconds){
		      break;
		    }
		  }
		}

		Sudoku.View = Marionette.ItemView.extend({
		      template: viewTpl,
		      tagName: 'div',
		      ui: {
		    	next: '#next',
		    	pre: '#prev',
		    	file: '#file',
		    	results: '#results',
		    	text: '#text',
		    	loading: '#loading',
		    	hidden: '#hiddenDiv',
		    	solve: '#solve',
		    	select: '#select',
		    	fileInput: '#fileinput'
		    	
		      },
		      events: {
		    	  'dragover #file': 'dragover',
		    	  'drop #file': 'drop',
		    	  'click #solve': 'solve'
		      },
		      solve: function(){
		    	    $('#loading').show();
		    	    $('#results').empty();

		    	    var io = document.getElementById('fileinput');
		    	    file = io.files[0];
		    	    fr = new FileReader();

		    	    fr.onload = function (){
		    	        
		    	        var contents = fr.result;
		    	        $('#hiddenDiv').append(contents);
		    	        writeContent(contents);
		    	    };
		    	    var str = fr.readAsText(file); 
		      },
		      dragover: function(evt){
		    	  evt.stopPropagation();
		          evt.preventDefault(); 
		      },
		      drop: function(evt){
		          evt.preventDefault();
		          evt.stopPropagation();
		          var input = evt.originalEvent.dataTransfer.files[0];
		          $('#select').text('Selected: ' + input.name);
		          
		           fr = new FileReader();

		          fr.onload = function (){
		              
		              var contents = fr.result;
		              $('#hiddenDiv').append(contents);
		              writeContent(contents);
		          };
		          var str = fr.readAsText(input);
		      },
		      onRender: function(){
		    	  this.ui.loading.hide();
		    	  this.ui.next.hide();
		    	  this.ui.pre.hide();
		    	  /*
		    	  this.ui.loading.addFloating({
		    	        centerX :true,
		    	        centerY :true
		    	    });  
		    	    */
		    	  var self = this;
		    	  this.ui.file.addClass('fileUnhover').fadeTo(400, .2);
		    	  this.ui.file.mouseenter(function () {
		    			$(this).fadeTo(100, 1,function () { });
		    		});
		    	  this.ui.file.mouseleave(function () {
		    			$(this).fadeTo(100, .2, function () { });
		    		});
		    	  this.ui.select.click(function () {
		    		    $('#fileinput').click();
		    		  });
		    	  this.ui.fileInput.change(function (click) {
		    		    if(this.value !== '')
		    		        self.ui.select.text('Selected: ' + this.value.split("\\").reverse()[0]);
		    		    });
		    	  
		    	  this.ui.file.qtip({
		    		    content: '<strong>Input file: first line is number of instances of sudoku, followed by each instance.<br>\
		    				The first line of each instance is the dimension, followed by a matrix that is sqrt(dimension) by sqrt(dimension).<br></strong>\
		    		    	<img src="assets/js/apps/sudoku/example.jpg"></img>',
		    		    style: {
		    		        widget: true, // Use the jQuery UI widget classes
		    		        def: false // Remove the default styling (usually a good idea, see below)
		    		    },
		    		    position: {
		    		        my: 'top left',  // Position my top left...
		    		        at: 'top right', // at the bottom right of...
		    		    }
		    		})
		    	  
		    	  
		      }
		    });
		
		Sudoku.on("sudoku:show", function(){
			Sudoku.controller.show();
		  });
		
		Sudoku.Router = Marionette.AppRouter.extend({
	        appRoutes: {
	          "sudoku": "show"
	        }
	      });
	    
		Sudoku.controller = {
	    	show: function(){
		    	var view = new Sudoku.View();
		    	App.mainRegion.show(view);
	    	}
	    };
	    
		Sudoku.addInitializer(function(){
	        new Sudoku.Router({
	          controller: Sudoku.controller
	        });
	      });
	});
	return App.View;
})