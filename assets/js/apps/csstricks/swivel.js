define(function() {
	var swivel = function() {
		$("#image-4").show();
		$(".the_faces").each(function() {
			$(this).on("mouseover", function() {
				$("#image-" + $(this).attr("data-number")).show();
			}).on("mouseout", function() {
				$("#image-" + $(this).attr("data-number")).hide();
			});
		});
		$("#face-area").on("mouseleave", function() {
			$("#image-4").show();
		});
		$("#face-area").on("mouseenter", function() {
			$("#image-4").hide();
		});
	};
	return swivel;
})