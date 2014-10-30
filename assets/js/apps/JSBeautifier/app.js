define([ 'app', 'tpl!apps/JSBeautifier/main.html', 'css!apps/JSBeautifier/style', 'beautify', 'codemirror', 'beautify-html' ], function(App, tpl, _, js_beautify, CodeMirror,  html_beautify) {
	App.module('Beautifer', function(Beautifer, App, Backbone, Marionette, $, _) {

		var the = {
			use_codemirror : (!window.location.href.match(/without-codemirror/)),
			beautify_in_progress : false,
			editor : null
		// codemirror editor
		};

		function beautify() {

			if (the.beautify_in_progress)
				return;

			//store_settings_to_cookie();

			the.beautify_in_progress = true;

			var source = the.editor ? the.editor.getValue() : $('#source').val(), output, opts = {};

			opts.indent_size = $('#tabsize').val();
			opts.indent_char = opts.indent_size == 1 ? '\t' : ' ';
			opts.max_preserve_newlines = $('#max-preserve-newlines').val();
			opts.preserve_newlines = opts.max_preserve_newlines !== -1;
			opts.keep_array_indentation = $('#keep-array-indentation').prop('checked');
			opts.break_chained_methods = $('#break-chained-methods').prop('checked');
			opts.indent_scripts = $('#indent-scripts').val();
			opts.brace_style = $('#brace-style').val();
			opts.space_before_conditional = $('#space-before-conditional').prop('checked');
			opts.unescape_strings = $('#unescape-strings').prop('checked');
			opts.wrap_line_length = $('#wrap-line-length').val();
			opts.space_after_anon_function = true;

			if (looks_like_html(source)) {
				output = html_beautify(source, opts);
			} else {
				if ($('#detect-packers').prop('checked')) {
					source = unpacker_filter(source);
				}
				output = js_beautify(source, opts);
			}
			if (the.editor) {
				the.editor.setValue(output);
			} else {
				$('#source').val(output);
			}

			the.beautify_in_progress = false;
		}

		function looks_like_html(source) {
			// <foo> - looks like html
			// <!--\nalert('foo!');\n--> - doesn't look like html

			var trimmed = source.replace(/^[ \t\n\r]+/, '');
			var comment_mark = '<' + '!-' + '-';
			return (trimmed && (trimmed.substring(0, 1) === '<' && trimmed.substring(0, 4) !== comment_mark));
		}

		function unpacker_filter(source) {
			var trailing_comments = '', comment = '', unpacked = '', found = false;

			// cut trailing comments
			do {
				found = false;
				if (/^\s*\/\*/.test(source)) {
					found = true;
					comment = source.substr(0, source.indexOf('*/') + 2);
					source = source.substr(comment.length).replace(/^\s+/, '');
					trailing_comments += comment + "\n";
				} else if (/^\s*\/\//.test(source)) {
					found = true;
					comment = source.match(/^\s*\/\/.*/)[0];
					source = source.substr(comment.length).replace(/^\s+/, '');
					trailing_comments += comment + "\n";
				}
			} while (found);

			var unpackers = [ P_A_C_K_E_R, Urlencoded, /* JavascriptObfuscator, */MyObfuscate ];
			for ( var i = 0; i < unpackers.length; i++) {
				if (unpackers[i].detect(source)) {
					unpacked = unpackers[i].unpack(source);
					if (unpacked != source) {
						source = unpacker_filter(unpacked);
					}
				}
			}

			return trailing_comments + source;
		}

		Beautifer.MainView = Marionette.ItemView.extend({
			template : tpl,
			
			onShow : function() {
				var default_text = "// This is just a sample script. Paste your real code (javascript or HTML) here.\n\nif ('this_is'==/an_example/){of_beautifer();}else{var a=b?(c%d):e[f];}";
				var textArea = $('#source')[0];

				if (the.use_codemirror && typeof CodeMirror !== 'undefined') {
					the.editor = CodeMirror.fromTextArea(textArea, {
						theme : 'default',
						lineNumbers : true
					});
					the.editor.focus();

					the.editor.setValue(default_text);
					$('.CodeMirror').click(function() {
						if (the.editor.getValue() == default_text) {
							the.editor.setValue('');
						}
					});
				} else {
					$('#source').val(default_text).bind('click focus', function() {
						if ($(this).val() == default_text) {
							$(this).val('');
						}
					}).bind('blur', function() {
						if (!$(this).val()) {
							$(this).val(default_text);
						}
					});
				}

				$(window).bind('keydown', function(e) {
					if (e.ctrlKey && e.keyCode == 13) {
						beautify();
					}
				})
				$('.submit').click(beautify);
				$('select').change(beautify);
			}
		});

		Beautifer.controller = {
			show : function() {
				App.navigate("jsbeautifier");
				App.mainRegion.show(new Beautifer.MainView());
			}
		}

		App.on("jsbeautifier:show", function() {
			Beautifer.controller.show();
		});

		Beautifer.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"jsbeautifier" : "show"
			}
		});

		Beautifer.addInitializer(function() {
			new Beautifer.Router({
				controller : Beautifer.controller
			});
		});
	});
	return App.Beautifer.controller;
})