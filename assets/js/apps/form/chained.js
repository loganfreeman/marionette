define(function(){
	var options = {
			  // CSS Class to add to the drop element when a drag is active
			  dragClass: "drag",

			  // A string to match MIME types, for instance
			  accept: false,

			  // An object specifying how to read certain MIME types
			  // For example: {
			  // 'image/*': 'DataURL',
			  // 'data/*': 'ArrayBuffer',
			  // 'text/*' : 'Text'
			  // }
			  readAsMap: { },

			  // How to read any files not specified by readAsMap
			  readAsDefault: 'DataURL',
			  on: {
			    beforestart: function(e, file) {
			        // return false if you want to skip this file
			    },
			    loadstart: function(e, file) { /* Native ProgressEvent */ },
			    progress: function(e, file) { /* Native ProgressEvent */ },
			    load: function(e, file) { /* Native ProgressEvent */ },
			    error: function(e, file) { /* Native ProgressEvent */ },
			    loadend: function(e, file) { /* Native ProgressEvent */ },
			    abort: function(e, file) { /* Native ProgressEvent */ },
			    skip: function(e, file) {
			      // Called when a file is skipped. This happens when:
			      // 1) A file doesn't match the accept option
			      // 2) false is returned in the beforestart callback
			    },
			    groupstart: function(group) {
			      // Called when a 'group' (a single drop / copy / select that
					// may
			      // contain multiple files) is receieved.
			      // You can ignore this event if you don't care about groups
			    },
			    groupend: function(group) {
			      // Called when a 'group' is finished.
			      // You can ignore this event if you don't care about groups
			    }
			  }
			};
	var run = function() {

    /* For jquery.chained.js */
    $("#series").chained("#mark");
    $("#model").chained("#series");
    $("#engine").chained("#series, #model");

    /* Show button after each pulldown has a value. */
    $("#engine").bind("change", function(event) {
        if ("" != $("option:selected", this).val() && "" != $("option:selected", $("#model")).val()) {
            $("#button").fadeIn();
        } else {
            $("#button").hide();
        }
    });

    $("#c").chained("#a,#b");

    /* For jquery.chained.remote.js */
    $("#series-remote").remoteChained({
        parents : "#mark-remote",
        url : "json.php?sleep=1",
        loading : "--",
        clear : true
    });
    $("#model-remote").remoteChained({
        parents : "#series-remote",
        url : "json.php?sleep=1",
        loading : "--",
        clear : true
    });
    $("#engine-remote").remoteChained({
        parents : "#series-remote, #model-remote",
        url : "json.php?sleep=1",
        loading : "--",
        clear : true
    });

    /* Show button after each pulldown has a value. */
    $("#engine-remote").bind("change", function(event) {
        if ("" != $("option:selected", this).val() && "" != $("option:selected", $("#model-remote")).val()) {
            $("#button-remote").fadeIn();
        } else {
            $("#button-remote").hide();
        }
    });

    $("#c-remote").remoteChained("#a-remote,#b-remote", "json.php");

    /* For multiple jquery.chained.remote.js */
    $(".series-remote").each(function() {
        $(this).remoteChained($(".mark-remote", $(this).parent()), "json.php");
    });
    $(".model-remote").each(function() {
        $(this).remoteChained($(".series-remote", $(this).parent()), "json.php");
    });
    $(".engine-remote").each(function() {
        $(this).remoteChained([
            $(".series-remote", $(this).parent()),
            $(".model-remote", $(this).parent())
        ], "json.php");
    });

    /* For multiple jquery.chained.js */
    $(".series").each(function() {
        $(this).chained($(".mark", $(this).parent()));
    });
    $(".model").each(function() {
        $(this).chained($(".series", $(this).parent()));
    });
    $(".engine").each(function() {
        $(this).chained([
            $(".series", $(this).parent()),
            $(".model", $(this).parent())
        ]);
    });
 // Accept files from the specified input[type=file]
    FileReaderJS.setupInput(document.getElementById('file-input'), options);

    // Accept dropped files on the specified file
    FileReaderJS.setupDrop(document.getElementById('dropzone'), options);

    // Accept paste events if available
    FileReaderJS.setupClipboard(document.body, options);

    // Attempt to use FileReaderSync in a worker if available.
    FileReaderJS.setSync(true);
    
    // progression.js
    $("#myform").progression({
		  tooltipWidth: '200',
		  tooltipPosition: 'right',
		  tooltipOffset: '50',
		  showProgressBar: true,
		  showHelper: true,
		  tooltipFontSize: '14',
		  tooltipFontColor: 'fff',
		  progressBarBackground: 'fff',
		  progressBarColor: '6EA5E1',
		  tooltipBackgroundColor:'a2cbfa',
		  tooltipPadding: '10',
		  tooltipAnimate: true
		});

  };
  return run;
})