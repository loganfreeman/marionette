define(function() {
	var runIndexDb = function() {
		var key = null;
		// Simply open the database once so that it is created with the required
		// tables
		$.indexedDB("MyECommerceSite", {
			"schema" : {
				"1" : function(versionTransaction) {
					var catalog = versionTransaction.createObjectStore("catalog", {
						"keyPath" : "itemId"
					});
					catalog.createIndex("price");
				},
				// This was added in the next version of the site
				"2" : function(versionTransaction) {
					var cart = versionTransaction.createObjectStore("cart", {
						"autoIncrement" : true
					});
					cart.createIndex("itemId");
					var wishlist = versionTransaction.createObjectStore("wishlist", {
						"autoIncrement" : false,
						"keyPath" : "itemId"
					});
					wishlist.createIndex("name");
				}
			}
		}).done(function() {
			// Once the DB is opened with the object stores set up, show data
			// from
			// all
			// tables
			window.setTimeout(function() {
				loadFromDB("cart");
				loadFromDB("wishlist");
				downloadCatalog();
			}, 200);
		});

		$('#loadAll').click(function() {
			loadFromDB('wishlist');
			loadFromDB('cart');
			loadFromDB('catalog');
		})

		$('#deleteDb').click(function() {
			deleteDB();
		})
		$('#loadFromLocal').click(function() {
			loadFromDB('catalog');
		})
		$('#syncDb').click(function() {
			downloadCatalog();
		})

		$('#showAll').click(function() {
			loadFromDB('catalog');
		})

		$('#sortByPrice').click(function() {
			sort('catalog', 'price');
		})

		$('#loadCart').click(function() {
			loadFromDB('cart');
		})

		$('clearTable').click(function() {
			emptyDB('cart');
			loadFromDB('cart');
		})

		$('#loadWhiteList').click(function() {
			loadFromDB('wishlist');
		})

		$('#clearWhiteList').click(function() {
			emptyDB('wishlist');
			loadFromDB('wishlist');
		})
		
		$('#showAllCart').click(function(){
			loadFromDB('cart');
		})
		
		$('#sortByItemId').click(function(){
			sort('cart', 'itemId')
		})
		function deleteDB() {
			// Delete the database
			$.indexedDB("MyECommerceSite").deleteDatabase();
		}

		// Download a catalog from the server and save it to the DB
		function downloadCatalog() {
			$.getJSON("assets/js/apps/data/catalog.json", function(data) {
				$.indexedDB("MyECommerceSite").transaction("catalog").then(function() {
					console.log("Transaction completed, all data inserted");
					loadFromDB("catalog");
				}, function(err, e) {
					console.log("Transaction NOT completed", err, e);
				}, function(transaction) {
					var catalog = transaction.objectStore("catalog");
					catalog.clear();
					$.each(data, function(i) {
						_(catalog.add(this));
					})
				});
			});
		}

		// Iterate over each record in a table and display it
		function loadFromDB(table) {
			emptyTable(table);
			_($.indexedDB("MyECommerceSite").objectStore(table).each(function(elem) {
				addRowInHTMLTable(table, elem.key, elem.value);
			}));
		}

		// Sort a table based on an index that is setup
		function sort(table, key) {
			emptyTable(table);
			_($.indexedDB("MyECommerceSite").objectStore(table).index(key).each(function(elem) {
				addRowInHTMLTable(table, elem.key, elem.value);
			}));
		}

		function emptyDB(table) {
			_($.indexedDB("MyECommerceSite").objectStore(table).clear());
		}

		// Read an item from catalog and save it in cart
		function addToCart(itemId) {
			$.indexedDB("MyECommerceSite").objectStore("catalog").get(itemId).then(function(item) {
				$.indexedDB("MyECommerceSite").objectStore("cart").add(item).done(function() {
					loadFromDB("cart");
				});
			}, function(err, e) {
				alert("Could not add to cart");
			});
		}

		// Delete an item from cart
		function removeFromCart(itemId) {
			$.indexedDB("MyECommerceSite").objectStore("cart")["delete"](itemId).done(function() {
				loadFromDB("cart");
			});
		}

		// Using transactions, read object from cart, add it to wishlist if it
		// does
		// not
		// exist
		// and then delete it from the cart. If any operation failes, all these
		// will
		// fail
		function moveToWishlist(cartId) {
			var transaction = $.indexedDB("MyECommerceSite").transaction([ "cart", "wishlist" ]);
			transaction.done(function() {
				loadFromDB("cart");
				loadFromDB("wishlist");
			});
			transaction.progress(function(transaction) {
				transaction.objectStore("cart").get(cartId).done(function(item) {
					transaction.objectStore("wishlist").add(item).fail(function() {
						alert("Already in the wishlist");
					}).done(function() {
						_(transaction.objectStore("cart")["delete"](cartId));
					});

				})
			});
		}

		// Read an item from catalog and add it to wishlist
		function addToWishlist(itemId) {
			$.indexedDB("MyECommerceSite").objectStore("catalog").get(itemId).then(function(item) {
				$.indexedDB("MyECommerceSite").objectStore("wishlist").add(item).done(function() {
					loadFromDB("wishlist");
				})
			}, function(err, e) {
				alert("Could not add to cart");
			});
		}

		function removeFromWishList(itemId) {
			$.indexedDB("MyECommerceSite").objectStore("wishlist")["delete"](itemId).done(function() {
				loadFromDB("wishlist");
			});
		}

		function emptyTable(tableName) {
			var table = document.getElementById(tableName);
			var header = table.getElementsByTagName("tr")[0];
			table.innerHTML = "";
			header && table.appendChild(header);
		}

		function addRowInHTMLTable(tableName, key, value) {
			var actions = {
				"catalog" : {
					"Add to cart" : "addToCart",
					"Add to wishlist" : "addToWishlist"
				},
				"cart" : {
					"Move to Wishlist" : "moveToWishlist",
					"Remove from Cart" : "removeFromCart"
				},
				"wishlist" : {
					"Remove from Wishlist" : "removeFromWishList"
				}
			}
			table = document.getElementById(tableName);
			var row = document.createElement("tr");
			var html = [ "<tr>" ];
			html = html.concat([ "<td class = 'key'>", key, "</td>" ]);
			html.push("<td class = 'action'>");
			for ( var action in actions[tableName]) {
				html = html.concat("<a href = 'javascript:", actions[tableName][action], "(", key, ")'>", action, "</a>");
			}
			html.push("</td>");
			html = html.concat([ "<td class = 'value'>", renderJSON(value), "</td>" ]);
			html.push("</tr>");
			row.innerHTML = html.join("");
			table.appendChild(row);
		}

		function renderJSON(val) {
			var result = [];
			for ( var key in val) {
				result.push("<div class = 'keyval'>");
				result.push("<span class = 'key'>", key, "</span>");
				result.push("<span class = 'value'>", JSON.stringify(val[key]), "</span>");
				result.push("</div>")
			}
			return result.join("");
		}

		function _(promise) {
			promise.then(function(a, e) {
				console.log("Action completed", e.type, a, e);
			}, function(a, e) {
				console.log("Action completed", a, e);
			}, function(a, e) {
				console.log("Action completed", a, e);
			})
		}
	}
	return runIndexDb;
})