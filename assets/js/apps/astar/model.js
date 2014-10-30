createDelegate = function(instance, method) {
	return function() {
		method.apply(instance, arguments);
	}
}

Array.indexOfElement = function(list, element) {
	if (list.length == 0) {
		return -1;
	}

	for ( var i = 0; i < list.length; i++) {
		if (list[i] == element) {
			return i;
		}
	}
	return -1;
};

Array.contains = function(list, element) {
	if (Array.indexOfElement(list, element) == -1) {
		return false;
	}
	return true;
};
Array.remove = function(list, element) {
	var l = list.length;
	var newList = [];
	for ( var i = 0; i < l; i++) {
		if (list[i] == element) {
			continue;
		}
		newList.push(list[i]);
	}
	return newList;
};

function Tile() {
	this._element = document.createElement("div");
	this.prevStep = null;
	this._obstacle = false;
	this.g = null;
	this.h = null;
	this._coords = null;
}

Tile.prototype = {
	// properties
	get_element : function() {
		return this._element;
	},
	set_map : function(m) {
		this.Map = m;
		var elem = this.get_element();
		var cb = createDelegate(this, this.dropHandler);
		$("#" + elem.id).droppable({
	        hoverclass: 'movePossible',
	        tolerance: 'intersect',
			drop : cb
		});
	},
	is_obstacle : function() {
		return this._obstacle;
	},
	set_obstacle : function(val) {
		this._obstacle = val;
		var elem = this.get_element();
		if (val) {
			elem.style.backgroundColor = "black";
			// $("#" + elem.id).DroppableDestroy();
		} else {
			elem.style.backgroundColor = "";
		}
	},
	get_coords : function() {
		return this._coords;
	},
	set_coords : function(coords) {
		this._coords = coords;
	},
	// methods
	toggleObstacle : function() {
		var newVal = !(this.is_obstacle());
		this.set_obstacle(newVal);
	},
	dropHandler : function(event, ui) {
		if (this.is_obstacle()) {
			if('hiro' === ui.draggable.prop('id')) ui.draggable.css("top", 0).css("left", 0);
			if('enemy' === ui.draggable.prop('id')) ui.draggable.css("top", 0).css("left", 40);
			return;
		}
		var coords = this.get_coords();
		this.Map.injectObject(coords, ui.draggable);
		return coords;
	},
	valueOf : function() {
		return (this.g + this.h);
	},
	// priv
	Map : null
};

function MapContainer(width, height, tileSize) {
	this._width = width;
	this._height = height;
	this._tileSize = tileSize;
	this._element = null;
	this._tiles = null;
	this._pathStart = null;
	this._pathEnd = null;
	this._path = null;
}

MapContainer.prototype = {
	// properties
	get_dimensions : function() {
		var dims = {};
		dims.x = this._width;
		dims.y = this._height;
		return dims;
	},
	get_element : function() {
		return this._element;
	},
	set_element : function(elem) {
		this._element = elem;
	},
	set_pathStart : function(coords) {
		this._pathStart = coords;
	},
	get_pathStart : function() {
		return this._pathStart;
	},
	set_pathEnd : function(coords) {
		this._pathEnd = coords;
	},
	get_pathEnd : function() {
		return this._pathEnd;
	},

	// methods
	initMap : function() {
		var elem = this.get_element();
		elem.style.width = this._width * this._tileSize + "px";
		elem.style.height = this._height * this._tileSize + "px";
		this._buildMap();
	},
	_buildMap : function() {
		var tiles = [];
		var elem = this.get_element();
		for ( var row = 0; row < this._height; row++) {
			var rowArray = [];
			for ( var col = 0; col < this._width; col++) {
				var tile = new Tile();
				var coords = {
					x : col,
					y : row
				};
				tile.set_coords(coords);
				var tileElem = tile.get_element();
				tileElem.style.left = col * this._tileSize + "px";
				tileElem.style.top = row * this._tileSize + "px";
				// tileElem.innerHTML = "[" + col + "," + row +
				// "]";
				tileElem.id = "t_" + col + "_" + row;

				var cb = createDelegate(tile, tile.toggleObstacle);
				$(tileElem).click(cb);

				elem.appendChild(tileElem);
				tile.set_obstacle(false);
				tile.set_map(this);
				rowArray.push(tile);
			}
			tiles.push(rowArray);
		}
		this._tiles = tiles;
		this._setTileStyles();
	},
	_setTileStyles : function() {
		// $("#container > div").addClass("tile");
		$("#astar-container > div").css("width", this._tileSize);
		$("#astar-container > div").css("height", this._tileSize);
	},
	injectObject : function(coords, obj) {
		if (obj.prop('id') == "hiro") {
			this.set_pathStart(coords);
		} else if (obj.prop('id') == 'enemy') {
			this.set_pathEnd(coords);
		}
	},
	get_successors : function(coords) {
		var tiles = this._tiles;
		var row = coords.y;
		var col = coords.x;
		var succ = [];
		// left
		if (col - 1 >= 0) {
			succ.push(tiles[row][col - 1]);
		}
		// right
		if (col + 1 < this._width) {
			succ.push(tiles[row][col + 1]);
		}
		// top
		if (row - 1 >= 0) {
			succ.push(tiles[row - 1][col]);
		}
		// bottom
		if (row + 1 < this._height) {
			succ.push(tiles[row + 1][col]);
		}
		return succ;
	},
	findPath : function() {
		var cA = this.get_pathStart();
		var cB = this.get_pathEnd();
		if (cA == null || cB == null) {
			alert("endpoints not set");
			return false;
		}
		// min-priority queue, hence less than
		var openQ = new PriorityQueue();
		openQ.cmp = function(a, b) {
			return a < b;
		};
		var closedList = [];

		var startNode = this._tiles[cA.y][cA.x];
		startNode.prevStep = null;
		startNode.g = 0;
		startNode.h = this.d(cA, cB);
		var endNode = this._tiles[cB.y][cB.x];
		openQ.insert(startNode);

		while (openQ.get_size() > 0) {
			var n = openQ.extract_extreme();
			if (n == endNode) {
				this._path = this.constructPath(n);
				return true;
			}
			var su = this.get_successors(n.get_coords());
			for ( var s = 0; s < su.length; s++) {
				var newg = n.g + this.dist(su[s], n);
				if ((Array.contains(closedList, su[s]) || Array.contains(openQ.nodes.slice(1, -1), su[s]) || su[s].is_obstacle()) && su[s].g <= newg) {
					continue;
				}
				su[s].prevNode = n;
				su[s].g = newg;
				su[s].h = this.dist(su[s], endNode);
				if (Array.contains(closedList, su[s])) {
					Array.remove(closedList, su[s]);
				}
				if (!Array.contains(openQ.nodes.slice(1, -1), su[s])) {
					openQ.insert(su[s]);
				}
			}
			closedList.push(n);
		}
		return false;
	},
	dist : function(tileA, tileB) {
		var a = tileA.get_coords();
		var b = tileB.get_coords();
		return this.d(a, b);
	},
	d : function(a, b) {
		var x = Math.abs(b.x - a.x);
		var y = Math.abs(b.y - a.y);
		return x + y;
	},
	constructPath : function(endNode) {
		var current = endNode;
		var path = [];
		while (current.prevNode != null) {
			path.push(current);
			current = current.prevNode;
		}
		return path;
	},
	get_pathElements : function() {
		var path = this._path;
		var elems = [];
		for ( var e = 0; e < path.length; e++) {
			elems.push(path[e].get_element());
		}
		return elems;
	},
	clear_all : function() {
		var tiles = this._tiles;
		for ( var row = 0; row < tiles.length; row++) {
			for ( var col = 0; col < tiles[row].length; col++) {
				var tile = tiles[row][col];
				tile.prevNode = null;
				tile.g = null;
				tile.h = null;
			}
		}
	}
};