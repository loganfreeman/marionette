define([ 'xlsx', 'jszip' ], function() {
	(function(root) {
		var rABS = typeof FileReader !== "undefined" && typeof FileReader.prototype !== "undefined" && typeof FileReader.prototype.readAsBinaryString !== "undefined";
		function fixdata(data) {
			var o = "", l = 0, w = 10240;
			for (; l < data.byteLength / w; ++l)
				o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
			o += String.fromCharCode.apply(null, new Uint8Array(data.slice(o.length)));
			return o;
		}

		function xlsxworker(data, cb) {
			var worker = new Worker('assets/js/apps/data/xlsxworker.js');
			worker.onmessage = function(e) {
				switch (e.data.t) {
				case 'ready':
					break;
				case 'e':
					console.error(e.data.d);
					break;
				case 'xlsx':
					cb(JSON.parse(e.data.d));
					break;
				}
			};
			var arr = rABS ? data : btoa(fixdata(data));
			worker.postMessage({
				d : arr,
				b : rABS
			});
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
				var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
				if (roa.length > 0) {
					result[sheetName] = roa;
				}
			});
			return result;
		}

		function to_csv(workbook) {
			var result = [];
			workbook.SheetNames.forEach(function(sheetName) {
				var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
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
				var formulae = XLSX.utils.get_formulae(workbook.Sheets[sheetName]);
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
			var wb = XLSX.read(tarea.value, {
				type : 'base64'
			});
			process_wb(wb);
		}

		root.b64it = b64it;

		function process_wb(wb) {
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
					if (typeof Worker !== 'undefined') {
						xlsxworker(data, process_wb);
					} else {
						var wb;
						if (rABS) {
							wb = XLSX.read(data, {
								type : 'binary'
							});
						} else {
							var arr = fixdata(data);
							wb = XLSX.read(btoa(arr), {
								type : 'base64'
							});
						}
						process_wb(wb);
					}
				};
				if (rABS)
					reader.readAsBinaryString(f);
				else
					reader.readAsArrayBuffer(f);
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
	})(window)
})