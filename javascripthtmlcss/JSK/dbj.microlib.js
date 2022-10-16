
/**
    DBJ*MICROLIB GPL (c) 2011 - 2016 by DBJ.ORG
*/
(function ( GLOBAL, undefined ) {

if ("object" == typeof dbj) {
	var msg = "dbj core object must be defined only once and only in here";
	if (console && console.error) console.error(msg);
	if ("function" == typeof alert) alert(msg);
	return;
};
	/**
	GLOBAL section -- is where we dare to create things in global scope
	*/
	/** (c) 2016 by DBJ.ORG
	printf(a,b,c ...) ; printf(a,b,c ...)(d,e,f ... ).flush() ; printf(a,b,c ...).flush() ;
	printf.element is where output goes to
	printf.flush () empties the stored string to the innerText of element given or body if nothing is given as printf.element
	printf.target = function (s) {} is used as (yes) printing target 

	NOTE! be very carefull NOT to create global functions which do exist on window, in case of running in the presence of dom!
	      for example naming this print will produce all sorts of weird bugs because window.print is defined in dom
	*/
		if ("function" == typeof printf) {
			return alert("dbj MICROLIB want to create global printf()\n\nPlease rename it or simply remove it from inside dbj.microlib.js.");
		}
	(function () {
		var print_buffer_ = (new Date()).toLocaleString() + "\n";

		printf = function (s) {
			var ags = [].slice.call(arguments);
			printf.target(ags.join("\n"));
			return printf;
		}
		var print_buffer_flush = function () { printf.element.innerText += print_buffer_; print_buffer_ = ""; return printf; }
		printf.flush = print_buffer_flush;
		printf.target = function (s_) {
			print_buffer_ += ("\n" + s_);
			if (print_buffer_.length > 0xFFFF) print_buffer_flush();
		}
		printf.element = document.body;
	}());

     
if ("function" !== typeof String.format) {
/**
* .net string.format like function
* usage:   "{0} means 'zero'".format("nula") 
* returns: "nula means 'zero'"
* place holders must be in a range 0-99.
* if no argument given for the placeholder, 
* no replacement will be done, so
* "oops {99}".format("!")
* returns the input
* same placeholders will be all replaced 
* with the same argument :
* "oops {0}{0}".format("!","?")
* returns "oops !!"
*/
String.prototype.format = function () {
        var args = arguments;
        return this.replace(/\{(\d|\d\d)\}/g, function ($0) {
            var idx = 1 * $0.match(/\d+/)[0]; return args[idx] !== undefined ? args[idx] : (args[idx] === "" ? "" : $0);
        }
            );
    }
};

var TOS_ = Object.prototype.toString, HOP_ = Object.prototype.hasOwnProperty; /*
 dbj core object must be defined only once and in here
 */
GLOBAL.dbj = {

    "GLOBAL" : (function () {

        // global helpers
        if ("function" !== typeof GLOBAL.roleof) {
            GLOBAL.roleof = function (o) { return TOS_.call(o).match(/\w+/g)[1]; }
        }
        if ("function" !== typeof GLOBAL.isArray) {
            GLOBAL.isArray = function (x) { return roleof(x) === "Array"; }
        }
        if ("function" !== typeof GLOBAL.isObject) {
            GLOBAL.isObject = function (x) { return roleof(x) === "Object"; }
        }
        if ("function" !== typeof GLOBAL.isFunction) {
            GLOBAL.isObject = function (x) { return roleof(x) === "Function"; }
        }
    }()),
	
	keep_inside : function (val, bounds ) {
				var boundaries = bounds ? bounds.sort() : [0,1];
					val = val - 0;
						if (isNaN(val)) throw new Error(0xFF,"dbj.keep_inside() received NaN value.");
				return val > boundaries[1] ? boundaries[1] : (val < boundaries[0] ? boundaries[0] : val);
	},

	err2str : function (e) {

    if (roleof(e) != "Error") return ""+e;

    return "Error Code: {0} Facility Code: {1}, Error Message: {2}, Error Name: {3}".format(
			e.number & 0xFFFF,
			e.number >> 16 & 0x1FFF,
			e.message,
			e.name
		);
    },

    createXHR: function () {

        var XMLHttpFactories = [
	        function () { return new XMLHttpRequest() },
	        function () { return new ActiveXObject("Msxml2.XMLHTTP") },
	        function () { return new ActiveXObject("Msxml3.XMLHTTP") },
	        function () { return new ActiveXObject("Microsoft.XMLHTTP") }
        ];

        this.createXHR = function () {
            var i = XMLHttpFactories.length, e;
            while (i--) {
                try {
                    return XMLHttpFactories[i]();
                }
                catch (e) {
                    /**/
                }
            }
            throw ("dbj.createXMLHTTPObject() failed ?");
        }

        return this.createXHR();
    },
    $: function (selector, el) {
        return (el || document).querySelector(selector);
    },
    $$: function (selector, el) {
        return (el || document).querySelectorAll(selector);
    },
        /**
         * execute function a bit later, default timeout is 1 mili sec,execution context is global name space
         * arguments after 'timeout', are passed to the callback
         */
    later: function (context, func, timeout) {
        var args = timeout ? [].slice.call(arguments, 3) : [].slice.call(arguments, 1);
        context || (context = (this || window));
        var tid = setTimeout(function () {
            clearTimeout(tid); tid = null; delete tid;
              try {
                func.apply(context, args);
              } catch (x) {
                  throw x.message ;
              }
        }, timeout || 1);
    },

    /** 
	 * multipuropse logging, aserting etc... 
	 * always using the console object
	 * but adding functionality ... perhaps?
     */
    console: {
        group       : function () { console.group("dbj MICROLIB"); },
        group_end   : function () { console.groupEnd(); }
    },

    assert: function (x) {
        if (!(x)) {
            throw new Error(0xFF,"dbj.assert(" + x + "), rendered to false");
        }
    },

    print: function () {
    	if (console) {
    		var ags = [].slice.call(arguments);
    		this.console.group();
    		for (var j = 0; j < ags.length; j++) console.log(ags[j]);
    		this.console.group_end();
    	} else
			throw new Error(0xFF,"dbj.print() -- console does not exist?")
    },

    evil: function (x) {
        // eval in presence of 'use strict'	
        "use strict";
        // spn = secret property name
        var spn = "evil_" + (+new Date());
        this.evil = function (x) {
        	(1, eval)("window['" + spn + "'] = (" + x + ")");
        	return top[spn];
        };
        return this.evil(x);
    },
    /**
      numerical section follows
    */
    /**
     *   one of those mind bending things for JS begginers
     *   usefull for assuring value is a number
     *   of course if it is not a object when it is number NaN
     *   num ("1.1")  --> number 1.1 
     *   num ("1")    --> number 1
     *   num (new Date()) --> number 1457181273435
     *   num ( new String() ) --> number 0
     *   num ( new Object() ) --> number NaN
     *
     *@param {object} any legal javascript value
    */
    num: function num(a) {
        return a - 0;
    },
    /* quick number rounder */
    round: function (f, places) {
    	return +f.toFixed(places || 2);
    },

	/** Pretty print an array. Examples:
		a2s( create2Dset(2))     --> [[0,0][1,0]]
		a2s( create2Dset(2),"!") --> [[0,0!1,0]]
    */
    a2s : function ( a, mid ) { 
    	mid = mid || "][" ;
    	return "[" + a.join(mid) + "]" ; 
    },
	/**	http://stackoverflow.com/questions/4959975/generate-random-value-between-two-numbers-in-javascript
	*/
    random : function (min,max)
    {
    	return Math.floor(Math.random()*(max-min+1)+min);
    } ,
    /* http://www.2ality.com/2012/02/js-integers.html */
    toUint32: function (x) {
        return x >>> 0;
    },

    toInt32: function (x) {
        return x >> 0;
    },
    /**
     * returns Uint32 seed randomized by time ticks
     * returns unique values even if called in smallest possible intervals
     * eg: [seed(), seed(), seed()]
     */
    seed: function () { return (Math.random() * (new Date() - 0)) >>> 0; },

	/** Now this is positively evil, and irresistible ;) */
    sum : function (arr) {
    	this.assert( arr.length < 0xFF ); // at least some sanity check
    	return dbj.evil(arr.join("+"));
    },
	avg : function (arr) {
		this.assert(arr.length < 0xFF); // at least some sanity check
		return this.sum(arr) / arr.length;
		},

	 GUID : function () {
	    var empty = "00000000-0000-0000-0000-000000000000",
            four = function () {
            	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).toUpperCase();
            };

	    	this.GUID  = function () {
	    		return (four() + four() + "-" + four() + "-" + four() + "-" + four() + "-" + four() + four() + four());
	    	}
		    	return this.GUID();
        }

}; /* eof dbj {} */

/* the stuff only old magician can produce :) */
/** 
 * following  works only in IE < 11, in WSH's and in HTA's of course
 * thus when in html be sure not to use 
 * <meta http-equiv="X-UA-Compatible" content="IE=edge">
 * if you want bellow to work
 */
/*@cc_on @if ( @_win32 )
dbj.GUID = function () 
{
    try
    {
        var x = new ActiveXObject("Scriptlet.TypeLib");
    return (x.GUID);
    }
    catch (e)
    {
    return ("error creating GUID");
    }
}
@end @*/

}( this || window ));
