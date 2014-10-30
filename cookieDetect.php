<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset='UTF-8'>
  <title>Client Info In Cookie</title>
  <script src="//code.jquery.com/jquery-1.10.2.min.js"></script>
</head>

<body>

    <?php if (isset($_COOKIE['_clientInfo'])) { ?>

      <p>Use the data as you see fit!</p>

      <?php
          $json = $_COOKIE['_clientInfo'];
          $obj = json_decode(stripslashes($json));
          echo "<p>Browser Width: " . $obj->{'browserWidth'} . "</p>";
          echo "<p>Browser Height: " . $obj->{'browserHeight'} . "</p>";
          echo "<p>Flexbox Support: " . $obj->{'flexboxSupport'} . "</p>";
          echo "<p>SVG Support: " . $obj->{'SVGSupport'} . "</p>";
      ?>

      <p>You can use it server-side OR client-side.</p>

      <script>
        // You could use the plugin here too, but whatever this is lighter
        var clientInfo = JSON.parse('<?php echo $_COOKIE['_clientInfo']; ?>');

        output = "<p>Browser Width: " + clientInfo.browserWidth + "</p>";

        $("body").append(output);
      </script>

    <?php } else { ?>

      <!-- LOAD TESTING LIBRARY, only load when testing -->
      <script src="assets/js/vendor/modernizr-2.6.2-respond-1.1.0.min.js"></script>

      <!-- COOKIE LIBRARY -->
      <script src="assets/js/vendor/jquery.cookie.js"></script>

      <!-- CREATE COOKIE -->
      <script>

        var clientInfo = {
          browserWidth: $(window).width(),
          browserHeight: $(window).height(),
          flexboxSupport: Modernizr.flexbox,
          SVGSupport: Modernizr.svg
        };

        var cookieVal = JSON.stringify(clientInfo);

        // was using document.cookie, this plugin worked better
        $.cookie("_clientInfo", cookieVal, {
          expires: 7
        });
      </script>

      <!-- RELOAD PAGE if supported and not used -->
      <script>
        var cookiesEnabled = navigator.cookieEnabled ? true : false;
        if (cookiesEnabled) {
          location.reload(true);
        }
      </script>

      <p>Make sure you serve useful content here as well.</p>

    <?php } ?>

</body>

</html>