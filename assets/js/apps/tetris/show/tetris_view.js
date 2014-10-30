define(["marionette", "tpl!apps/tetris/show/templates/tetris.tpl", 'qTip',
        'less!apps/tetris/show/templates/tetris'], function(Marionette, tetrisTpl){
	
  
  return {

    Tetris: Marionette.ItemView.extend({
      template: tetrisTpl,
      render: function(){
    	 Marionette.ItemView.prototype.render.apply(this, Array.prototype.slice.call(arguments));
      },
      events: {
    	  "click #tetris_start": "startGame",
    	  "click #tetris_stop": "stopGame"
      },
      onRender: function(){
    	  this.$el.find('#tetris-wrapper').qtip({
  		    content: '<strong>Use the arrow key to rotate the piece</strong>',
  		    style: {
  		        widget: true, // Use the jQuery UI widget classes
  		    },
  		    position: {
  		        my: 'right top',  // Position my top left...
  		        at: 'left top', // at the bottom right of...
  		    }
  		})
      },
      startGame: function(){
    	  
    	  this.stopGame();
    	  
			var COLS = 10, ROWS = 20;
			var board = [];
			var lose;
			var interval;
			var current, currentX, currentY;
			var shapes = [
			    [ 1, 1, 1, 1 ],
			    [ 1, 1, 1, 0,
			      1 ],
			    [ 1, 1, 1, 0,
			      0, 0, 1 ],
			    [ 1, 1, 0, 0,
			      1, 1 ],
			    [ 1, 1, 0, 0,
			      0, 1, 1 ],
			    [ 0, 1, 1, 0,
			      1, 1 ],
			    [ 0, 1, 0, 0,
			      1, 1, 1 ]
			];
			var colors = [
			    'cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple'
			];
			
			
    	  // attach event handlers
          document.body.onkeydown = function( e ) {
			    var keys = {
			        37: 'left',
			        39: 'right',
			        40: 'down',
			        38: 'rotate'
			    };
			    if ( typeof keys[ e.keyCode ] != 'undefined' ) {
			        keyPress( keys[ e.keyCode ] );
			        render();
			    }
			};
			// get canvs
			var canvas = $("#tetris_canvas")[0];
			var ctx = canvas.getContext( '2d' );
			
			var W = canvas.width, H = canvas.height;
			var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;
			
			
			//define render function
			function drawBlock( x, y ) {
			    ctx.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
			    ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
			}

			function render() {
				console.log("render called");
			    ctx.clearRect( 0, 0, W, H );

			    ctx.strokeStyle = 'black';
			    for ( var x = 0; x < COLS; ++x ) {
			        for ( var y = 0; y < ROWS; ++y ) {
			            if ( board[ y ][ x ] ) {
			                ctx.fillStyle = colors[ board[ y ][ x ] - 1 ];
			                drawBlock( x, y );
			            }
			        }
			    }

			    ctx.fillStyle = 'red';
			    ctx.strokeStyle = 'black';
			    for ( var y = 0; y < 4; ++y ) {
			        for ( var x = 0; x < 4; ++x ) {
			            if ( current[ y ][ x ] ) {
			                ctx.fillStyle = colors[ current[ y ][ x ] - 1 ];
			                drawBlock( currentX + x, currentY + y );
			            }
			        }
			    }
			}
			


			function newShape() {
			    var id = Math.floor( Math.random() * shapes.length );
			    var shape = shapes[ id ];

			    current = [];
			    for ( var y = 0; y < 4; ++y ) {
			        current[ y ] = [];
			        for ( var x = 0; x < 4; ++x ) {
			            var i = 4 * y + x;
			            if ( typeof shape[ i ] != 'undefined' && shape[ i ] ) {
			                current[ y ][ x ] = id + 1;
			            }
			            else {
			                current[ y ][ x ] = 0;
			            }
			        }
			    }
			    currentX = 5;
			    currentY = 0;
			}

			function init() {
			    for ( var y = 0; y < ROWS; ++y ) {
			        board[ y ] = [];
			        for ( var x = 0; x < COLS; ++x ) {
			            board[ y ][ x ] = 0;
			        }
			    }
			}

			function tick() {
				console.log("tick called");
			    if ( valid( 0, 1 ) ) {
			        ++currentY;
			    }
			    else {
			        freeze();
			        clearLines();
			        if (lose) {
			            newGame();
			            return false;
			        }    
			        newShape();
			    }
			}

			function freeze() {
			    for ( var y = 0; y < 4; ++y ) {
			        for ( var x = 0; x < 4; ++x ) {
			            if ( current[ y ][ x ] ) {
			                board[ y + currentY ][ x + currentX ] = current[ y ][ x ];
			            }
			        }
			    }
			}

			function rotate( current ) {
			    var newCurrent = [];
			    for ( var y = 0; y < 4; ++y ) {
			        newCurrent[ y ] = [];
			        for ( var x = 0; x < 4; ++x ) {
			            newCurrent[ y ][ x ] = current[ 3 - x ][ y ];
			        }
			    }

			    return newCurrent;
			}

			function clearLines() {
			    for ( var y = ROWS - 1; y >= 0; --y ) {
			        var row = true;
			        for ( var x = 0; x < COLS; ++x ) {
			            if ( board[ y ][ x ] == 0 ) {
			                row = false;
			                break;
			            }
			        }
			        if ( row ) {
			            for ( var yy = y; yy > 0; --yy ) {
			                for ( var x = 0; x < COLS; ++x ) {
			                    board[ yy ][ x ] = board[ yy - 1 ][ x ];
			                }
			            }
			            ++y;
			        }
			    }
			}

			function keyPress( key ) {
			    switch ( key ) {
			        case 'left':
			            if ( valid( -1 ) ) {
			                --currentX;
			            }
			            break;
			        case 'right':
			            if ( valid( 1 ) ) {
			                ++currentX;
			            }
			            break;
			        case 'down':
			            if ( valid( 0, 1 ) ) {
			                ++currentY;
			            }
			            break;
			        case 'rotate':
			            var rotated = rotate( current );
			            if ( valid( 0, 0, rotated ) ) {
			                current = rotated;
			            }
			            break;
			    }
			}

			function valid( offsetX, offsetY, newCurrent ) {
			    offsetX = offsetX || 0;
			    offsetY = offsetY || 0;
			    offsetX = currentX + offsetX;
			    offsetY = currentY + offsetY;
			    newCurrent = newCurrent || current;



			    for ( var y = 0; y < 4; ++y ) {
			        for ( var x = 0; x < 4; ++x ) {
			            if ( newCurrent[ y ][ x ] ) {
			                if ( typeof board[ y + offsetY ] == 'undefined'
			                  || typeof board[ y + offsetY ][ x + offsetX ] == 'undefined'
			                  || board[ y + offsetY ][ x + offsetX ]
			                  || x + offsetX < 0
			                  || y + offsetY >= ROWS
			                  || x + offsetX >= COLS ) {
			                    if (offsetY == 1) lose = true;
			                    return false;
			                }
			            }
			        }
			    }
			    return true;
			}

			function newGame() {
			    clearInterval(interval);
			    init();
			    newShape();
			    lose = false;
			    interval = setInterval( tick, 250 );
			}
			
			this.renderCycle = setInterval( render, 30 );
			
			newGame();
			
			this.gameCycle = interval;
	    	  console.log("new game started");
			
			
      },
      stopGame: function(){
    	  console.log("game stopped");
    	  document.body.onkeydown = null;
    	  clearInterval(this.renderCycle);
    	  clearInterval(this.gameCycle);
      }
    })
  };
});
