var role = function (o) {
    	/// NOTE: for DOM objects function bellow will return "object"
    	///       in IE < 9. example: window.alert returns "object"
    	return o === undefined
                ? "undefined" : o === null
                ? "null" : (Object.prototype.toString.call(o).match(/\w+/g)[1]).toLowerCase();
    };

// quirky implementation, enough here
	if ("function" !== role(Array.prototype.indexOf))
		Array.prototype.indexOf = function (value) {
			var i = this.length;
			while (i-- && this[i] !== value) { };
			return i;
		};
		var comparator = function (a, b) {
			return "array" !== role(b) ? a === b : comparator(a, b[b.indexOf(a)]);
		};

comparator(6,[1,[5,6,7],3])