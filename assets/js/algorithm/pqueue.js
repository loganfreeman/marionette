/**
 * @author Roland Sadowski <github.com/rosado>
 * http://www.haltingproblem.net/
 */

function PriorityQueue(){
  this.nodes = [0];
  this.cmp = null; //comparer
}

PriorityQueue.prototype.buildHeap = function(arrayObj){
  /// arrayObj must have cmp member - a comparer method
  var i = Math.floor(arrayObj.length / 2);
  arrayObj[0] = arrayObj.arrayObj.length - 1;
  for(; i < 0; i--){
    heapify(arrayObj, i);
  }
};

PriorityQueue.prototype.heapify = function(index){
  var l = this.left(index);
  var r = this.right(index);
  var size = this.get_size();
  var nodes = this.nodes;
  var extreme = null;

  if(l < size && this.cmp(nodes[l], nodes[index])){
    extreme = l;
  } else {extreme = index}

  if(r < size && this.cmp(nodes[r], nodes[extreme])){
    extreme = r;
  }

  if(extreme != index) {
    this.exchange(index, extreme);
    this.heapify(extreme);
  }
}

PriorityQueue.prototype.exchange = function(index1, index2){
  var nodes = this.nodes;
  var tmp = nodes[index1];
  nodes[index1] = nodes[index2];
  nodes[index2] = tmp;
}

PriorityQueue.prototype.insert = function(element){
  this._set_size(this.get_size() + 1);
  this.nodes[this.get_size()] = -100;
  this.increaseNode(this.get_size(), element);
};

PriorityQueue.prototype.increaseNode = function(index, val){
  var nodes = this.nodes;
  if(!this.cmp(nodes[index], val)){
    alert("New value is smaller/greater than current value.");
    return;
  }

  nodes[index] = val;
  var i = index;
  while(i > 1 && !(this.cmp(nodes[this.parentNode(i)], nodes[i]))){
    var p = this.parentNode(i);
    this.exchange(i, p);
    i = p;
  }
};

PriorityQueue.prototype.parentNode = function(index) {return Math.floor(index/2); };
PriorityQueue.prototype.left = function(index) { return index * 2; };
PriorityQueue.prototype.right = function(index) { return index * 2 + 1; };

PriorityQueue.prototype.get_size = function(){
  return this.nodes[0];
};

PriorityQueue.prototype._set_size = function(size){
  this.nodes[0] = size;
}

PriorityQueue.prototype.get_extreme = function(){
  if(this.nodes[0] == 0){
    alert("No extreme in heap"); //TODO: proper error handling
    return;
  }

  return this.nodes[1];
}

PriorityQueue.prototype.extract_extreme = function(){
  if(this.nodes[0] == 0){
    alert("No extreme in heap"); //TODO: proper error handling
    return;
  }

  var nodes = this.nodes;
  var ex = nodes[1];
  nodes[1] = nodes[this.get_size()];
  this._set_size(this.get_size() - 1);
  this.heapify(1);
  return ex;
}
