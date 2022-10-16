// array-like enumeration
if (!Array.forEach) { // mozilla already supports this
  Array.forEach = function(object, block, context) {
    for (var i = 0; i < object.length; i++) {
      block.call(context, object[i], i, object);
    }
  };
}

// generic enumeration
Function.prototype.forEach = function(object, block, context) {
  for (var key in object) {
    if (typeof this.prototype[key] == "undefined") {
      block.call(context, object[key], key, object);
    }
  }
};

// globally resolve forEach enumeration
var forEach = function(object, block, context) {
  if (object) {
    var resolve = Object; // default
    if (object instanceof Function) {
      // functions have a "length" property
      resolve = Function;
    } else if (object.forEach instanceof Function) {
      // the object implements a custom forEach method so use that
      object.forEach(block, context);
      return;
    } else if (typeof object.length == "number") {
      // the object is array-like
      resolve = Array;
    }
    resolve.forEach(object, block, context);
  }
};

// This allows me to write loops without knowing what kind of object I’m dealing with:
s = []
function print (v,k ) {  s.push( k + ":" + v ); }

function printAll() {
  forEach (arguments, function(object) {
    forEach (object, print); 
  });
};
// or
forEach (document.scripts, function(v,k) { printAll(v) ; });
s.join("\n");