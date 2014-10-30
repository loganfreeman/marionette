importScripts('../../vendor/xls.js');
postMessage({
	t : "ready"
});

onmessage = function(e) {
	var v, cfb;
	try {
		/*
		 * cfb = XLS.CFB.read(oEvent.data, {type:"binary"}); v =
		 * XLS.parse_xlscfb(cfb);
		 */
		v = XLS.read(e.data.d, {
			type : "binary"
		});
	} catch (e) {
		postMessage({
			t : "e",
			d : e.stack || e
		});
	}
    console.dir(v);

	postMessage({
		t : "xls",
		d : v
	});
};
