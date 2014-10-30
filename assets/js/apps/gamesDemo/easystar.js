define(['apps/gamesDemo/easy-star-demo'], function(EasyStarDemo){
	var run = function(){
		 var easyStarDemo = new EasyStarDemo($('.demo').width(), $('.demo').height());
	        window.onresize = function() {
	            easyStarDemo.resize( $('.demo').width(), $('.demo').height());
	        }

	        //Component controls

	        $('#check-tile-cost').click(function() {
	            if ($('#check-tile-cost').bootstrapSwitch('status')) {
	                easyStarDemo.unsetGrassPreference();
	            } else {
	                easyStarDemo.setGrassPreference();
	            }
	        });

	        $('#check-diagonals').click(function() {
	            if ($('#check-diagonals').bootstrapSwitch('status')) {
	                easyStarDemo.disableDiagonals();
	            } else {
	                easyStarDemo.enableDiagonals();
	            }
	        });


	        var $slider = $("#slider");
	        if ($slider.length) {
	            $slider.slider({
	                min: 1,
	                max: 3,
	                value: 2,
	                orientation: "horizontal",
	                range: "min",
	                change: function( event, ui ) {
	                   if (ui.value === 1) {
	                        easyStarDemo.setIterationsPerCalculation(5);
	                    } else if (ui.value === 2) {
	                        easyStarDemo.setIterationsPerCalculation(100);
	                    } else if (ui.value === 3) {
	                        easyStarDemo.setIterationsPerCalculation(Number.MAX_VALUE);
	                    }
	                }
	            });
	        }
	};
	return run;
})