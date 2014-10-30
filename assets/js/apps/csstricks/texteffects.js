define([ 'fraphael' ], function() {
	var draw = function(){
		var paper = Raphael("test");

		paper.text(0, 30, "Filters are ice cold").attr({
			"fill" : "MintCream",
			"font-family" : "Butcherman",
			"font-size" : "54px",
			"text-anchor" : "start"
		}).emboss(2).shadow();

		paper.text(0, 100, "...expensive").attr({
			"fill" : "GoldenRod",
			"font-family" : "Sonsie One",
			"font-size" : "54px",
			"text-anchor" : "start"
		}).light(400, 40, 5, null);

		paper.text(0, 170, "...gruesome").attr({
			"fill" : "Red",
			"font-family" : "Nosifer",
			"font-size" : "54px",
			"text-anchor" : "start"
		}).emboss(1);

		paper.text(0, 240, "...and funky").attr({
			"fill" : "Orange",
			"stroke" : "black",
			"font-family" : "Lemon",
			"font-size" : "60px",
			"font-weight" : "bold",
			"text-anchor" : "start"
		}).emboss().shadow();
	}
	return draw;
})