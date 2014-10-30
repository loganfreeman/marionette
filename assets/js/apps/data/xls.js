define([ 'xls' ], function(XLS) {
	var use_worker = true;
	function xlsworker(data, cb) {
		var worker = new Worker('assets/js/apps/data/xlsworker.js');
		worker.onmessage = function(e) {
			switch (e.data.t) {
			case 'ready':
				break;
			case 'e':
				console.error(e.data);
				break;
			case 'xls':
				cb(e.data.d);
				break;
			}
		};
		worker.postMessage({d: data});
	}

	function get_radio_value(radioName) {
		var radios = document.getElementsByName(radioName);
		for (var i = 0; i < radios.length; i++) {
			if (radios[i].checked) {
				return radios[i].value;
			}
		}
	}

	function to_json(workbook) {
		var result = {};
		workbook.SheetNames.forEach(function(sheetName) {
			var roa = XLS.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
			if (roa.length > 0) {
				result[sheetName] = roa;
			}
		});
		return result;
	}

	function to_csv(workbook) {
		var result = [];
		workbook.SheetNames.forEach(function(sheetName) {
			var csv = XLS.utils.make_csv(workbook.Sheets[sheetName]);
			if (csv.length > 0) {
				result.push("SHEET: " + sheetName);
				result.push("");
				result.push(csv);
			}
		});
		return result.join("\n");
	}

	function to_formulae(workbook) {
		var result = [];
		workbook.SheetNames.forEach(function(sheetName) {
			var formulae = XLS.utils.get_formulae(workbook.Sheets[sheetName]);
			if (formulae.length > 0) {
				result.push("SHEET: " + sheetName);
				result.push("");
				result.push(formulae.join("\n"));
			}
		});
		return result.join("\n");
	}

	var tarea = document.getElementById('b64data');
	function b64it() {
		/*
		 * var cfb = XLS.CFB.read(tarea.value, {type: 'base64'}); var wb =
		 * XLS.parse_xlscfb(cfb);
		 */
		var wb = XLS.read(tarea.value, {
			type : 'base64'
		});
		process_wb(wb);
	}

	function process_wb(wb) {
		if (typeof Worker !== 'undefined')
			XLS.SSF.load_table(wb.SSF);
		var output = "";
		switch (get_radio_value("format")) {
		case "json":
			output = JSON.stringify(to_json(wb), 2, 2);
			break;
		case "form":
			output = to_formulae(wb);
			break;
		default:
			output = to_csv(wb);
		}
		if (out.innerText === undefined)
			out.textContent = output;
		else
			out.innerText = output;
	}

	var drop = document.getElementById('drop');
	function handleDrop(e) {
		e.stopPropagation();
		e.preventDefault();
		var files = e.dataTransfer.files;
		var i, f;
		for (i = 0, f = files[i]; i != files.length; ++i) {
			var reader = new FileReader();
			var name = f.name;
			reader.onload = function(e) {
				var data = e.target.result;
				if (use_worker && typeof Worker !== 'undefined') {
					xlsworker(data, process_wb);
				} else {
					/*
					 * var cfb = XLS.CFB.read(data, {type: 'binary'}); //var arr =
					 * String.fromCharCode.apply(null, new Uint8Array(data));
					 * //var cfb = XLS.CFB.read(btoa(arr), {type: 'base64'});
					 * var wb = XLS.parse_xlscfb(cfb);
					 */
					var wb = XLS.read(data, {
						type : 'binary'
					});
					process_wb(wb);
				}
			};
			reader.readAsBinaryString(f);
			// reader.readAsArrayBuffer(f);
		}
	}

	function handleDragover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';
	}

	if (drop.addEventListener) {
		drop.addEventListener('dragenter', handleDragover, false);
		drop.addEventListener('dragover', handleDragover, false);
		drop.addEventListener('drop', handleDrop, false);
	}
})