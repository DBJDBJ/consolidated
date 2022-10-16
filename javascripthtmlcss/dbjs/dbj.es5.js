///
/// GPL (c) 2009 by DBJ.ORG
/// DBJ.LIB.JS(tm)
/// $Revision: 5 $$Date: 25/02/10 14:06 $
///
/// Dependencies : dbj.lib.js
/*
NOTE: ES5 default call context is null, not global object any more ! Example :
function es5 () { return this === null; }  // true
*/
(function(window, dbj, undefined) {

if ( undefined === dbj ) return window.alert("ERROR: dbj.es5 requires dbj.lib to be included before itself...");

    var TOS_ = Object.prototype.toString,
        HOP_ = Object.prototype.hasOwnProperty,
		string_as_array = "1"[0] === "1";

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(obj, fromIndex) {
            if (fromIndex == null) {
                fromIndex = 0;
            } else if (fromIndex < 0) {
                fromIndex = Math.max(0, this.length + fromIndex);
            }
            for (var i = fromIndex, L = this.length; i < L; i++) {
                if (this[i] === obj)
                    return i;
            }
            return -1;
        };
    }
    // http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:lastIndexOf
    if (!Array.prototype.lastIndexOf) {
        Array.prototype.lastIndexOf = function(obj, fromIndex) {
            if (fromIndex == null) {
                fromIndex = this.length - 1;
            } else if (fromIndex < 0) {
                fromIndex = Math.max(0, this.length + fromIndex);
            }
            for (var i = fromIndex; i >= 0; i--) {
                if (this[i] === obj)
                    return i;
            }
            return -1;
        };
    }


    // http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:forEach
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function(f, obj) {
            var l = this.length; // must be fixed during loop... see docs
            obj = obj || null; /* defualt call context is null in ES5 */
            for (var i = 0; i < l; i++) {
                f.call(obj, this[i], i, this);
            }
        };
    }

    // http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:filter
    if (!Array.prototype.filter) {
        Array.prototype.filter = function(f, obj) {
            var l = this.length; // must be fixed during loop... see docs
            obj = obj || null; /* defualt call context is null in ES5 */
            var res = [];
            for (var i = 0; i < l; i++) {
                if (f.call(obj, this[i], i, this)) {
                    res.push(this[i]);
                }
            }
            return res;
        };
    }

    // http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:map
    if (!Array.prototype.map) {
        Array.prototype.map = function(f, obj) {
            var l = this.length; // must be fixed during loop... see docs
            obj = obj || null; /* defualt call context is null in ES5 */
            var res = [];
            for (var i = 0; i < l; i++) {
                res.push(f.call(obj, this[i], i, this));
            }
            return res;
        };
    }

    // http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:some
    if (!Array.prototype.some) {
        Array.prototype.some = function(f, obj) {
            var l = this.length; // must be fixed during loop... see docs
            obj = obj || null; /* defualt call context is null in ES5 */
            for (var i = 0; i < l; i++) {
                if (f.call(obj, this[i], i, this)) {
                    return true;
                }
            }
            return false;
        };
    }

    // http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:every
    if (!Array.prototype.every) {
        Array.prototype.every = function(f, obj) {
            var l = this.length; // must be fixed during loop... see docs
            obj = obj || null; /* defualt call context is null in ES5 */
            for (var i = 0; i < l; i++) {
                if (!f.call(obj, this[i], i, this)) {
                    return false;
                }
            }
            return true;
        };
    }

    Array.prototype.contains = function(obj) {
        return this.indexOf(obj) != -1;
    };

    Array.prototype.copy = function(obj) {
        return this.concat();
    };

    Array.prototype.insertAt = function(obj, i) {
        this.splice(i, 0, obj);
    };

    Array.prototype.insertBefore = function(obj, obj2) {
        var i = this.indexOf(obj2);
        if (i == -1)
            this.push(obj);
        else
            this.splice(i, 0, obj);
    };

    Array.prototype.removeAt = function(i) {
        this.splice(i, 1);
    };

    Array.prototype.remove = function(obj) {
        var i = this.indexOf(obj);
        if (i != -1)
            this.splice(i, 1);
    };

/* ----------------------------------------------------------------------------------- */    
})(window, dbj);

