var page = new WebPage(),
fs = require("fs"),
log = fs.open('watchlist.csv', 'a');
page.open('http://www.imdb.com', function (status) {
    if (status !== 'success') {
        console.log(status);
        phantom.exit();
    } else {
        var result = page.evaluate(function() {            
            var out;
            $.ajax({
                'async' : false,
                'url' : 'http://www.imdb.com/list/export?list_id=watchlist&author_id=ur32482997',
                'success' : function(data, status, xhr) {
                    //out = base64encode(data);
                    out = data;
                }
            });
            return out;
        });
        log.write(result);
        phantom.exit();
    }
});