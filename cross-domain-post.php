<html>
<head>
	<script>
		function crossDomainPost() {
		  // Add the iframe with a unique name
		  var iframe = document.createElement("iframe");
		  var uniqueString = "CHANGE_THIS_TO_SOME_UNIQUE_STRING";
		  document.body.appendChild(iframe);
		  //iframe.style.display = "none";
		  iframe.contentWindow.name = uniqueString;
		
		  // construct a form with hidden inputs, targeting the iframe
		  var form = iframe.contentWindow.document.createElement("form");
		  form.target = uniqueString;
		  form.action = "http://www.mitbbs.com/mitbbs_bbsbfind.php";
		  form.method = "POST";
		
		  // repeat for each parameter
		  var input = iframe.contentWindow.document.createElement("input");
		  input.type = "hidden";
		  input.name = "board";
		  input.value = "EB23";
		  form.appendChild(input);
		
		  iframe.contentWindow.document.body.appendChild(form);
		  form.submit();
		}
		
		
		function jqueryPostMessage(){
		 	var url = 'http://www.mitbbs.com/mitbbs_bbsbfind.php';
		 	var body = {board : "EB23"};
			$.postMessage(body, url);
		}
	</script>
	<script type="text/javascript" src="http://code.jquery.com/jquery-2.1.0.min.js">
	</script>
	<script src="http://code.jquery.com/jquery-migrate-1.2.1.js"></script>
	<script type="text/javascript" src="assets/js/vendor/jquery.ba-postmessage.js">
	</script>
	
</head>
<body>

<iframe id="FileFrame" src="about:blank"></iframe>

<button type="button" onclick='crossDomainPost();'>Click Me!</button>

<button type="button" onclick='crossDomainPost();'>jQuery post message</button>

<script type="text/javascript">
var doc = document.getElementById('FileFrame').contentWindow.document;
doc.open();
doc.write('<html><head><title></title></head><body onload="myForm.submit()">Hello world.<form id="myForm" action="http://www.mitbbs.com/mitbbs_bbsbfind.php"><input type="hidden" name="board" value="EB23"/></form></body></html>');
doc.close();
</script>

</body>
</html>