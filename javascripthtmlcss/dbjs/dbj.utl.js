/*

 GPL (c) 2001-2013 by DBJ.ORG
 DBJ.UTL.JS(tm)

 Dependencies : dbj.es5, dbj.lib and jQuery

NOTE: ES5 default call context is null, not global object any more ! Example :
function es5 () { return this === null; }  // true
*/
(function(window, dbj, undefined) {

if ( undefined === dbj ) return window.alert("ERROR: dbj.utl requires dbj.lib to be included before it.");

    var TOS_ = Object.prototype.toString,
        HOP_ = Object.prototype.hasOwnProperty;

    //-------------------------------------------------------------------------------------
    /* 
    GENERICS : array generics can be applied to every object that has a length property
    But in case of host where string does not allow for indexing this is a bit tricky
    */
    if ("function" !== Array.indexOf) {
        Array.indexOf = function(obj, elt, from) {
            if ("String" === roleof(obj)) return obj.indexOf(elt, from);
            return Array.prototype.indexOf.call(obj, elt, from);
        }
    }
    // Generic variant
    if ("function" !== Array.lastIndexOf) {
        Array.lastIndexOf = function(obj, elt) {
            if ("String" === roleof(obj)) return obj.lastIndexOf(elt);
            return Array.prototype.lastIndexOf.call(obj, elt);
        }
    }
    // Generic variant
    if ("function" !== Array.forEach) {
        Array.forEach = function(obj, fun) {
            if ("String" === roleof(obj)) obj = obj.split("");
            return Array.prototype.forEach.call(obj, fun);
        }
    }

    //[].filter 
    // Generic variant
    if ("function" !== Array.filter) {
        Array.filter = function(obj, fun) {
            if ("String" === roleof(obj)) obj = obj.split("");
            return Array.prototype.filter.call(obj, fun);
        }
    }
    // every() Generic variant
    if ("function" !== Array.every) {
        Array.every = function(obj, fun) {
            if ("String" === roleof(obj)) obj = obj.split("");
            return Array.prototype.every.call(obj, fun);
        }
    }

    // map() Generic variant
    if ("function" !== Array.map) {
        Array.map = function(obj, fun) {
            if ("String" === roleof(obj)) obj = obj.split("");
            return Array.prototype.map.call(obj, fun);
        }
    }
    // some() 
    if ("function" !== Array.some) {
        Array.some = function(obj, fun) {
            if ("String" === roleof(obj)) obj = obj.split("");
            return Array.prototype.some.call(obj, fun);
        }
    }
    /* reduce    
    Summary         Apply a function against an accumulator and each value of the array (from left-to-right) 
    as to reduce it to a single value.
    Syntax
    var result = array.reduce(callback[, initialValue]);
    Parameters
    callback        Function to execute on each value in the array.
    initialValue    Object to use as the first argument to the first call of the callback.
    */
    if ("function" !== Array.prototype.reduce) {
        Array.prototype.reduce = function(fun /*, initial*/) {
            if (typeof fun != "function") dbj.konsole.terror("[].reduce : callback is not a function");
            var len = this.length >>> 0;

            if (len === 0 && arguments.length == 1)
                dbj.konsole.terror("[].reduce : no value to return if no initial value and an empty array");

            var i = 0;
            if (arguments.length >= 2) { var rv = arguments[1]; }
            else {
                do {
                    if (i in this) { rv = this[i++]; break; }
                    if (++i >= len)
                        dbj.konsole.terror("[].reduce : array contains no values, no initial value to return");
                }
                while (true);
            }
            for (; i < len; i++) {
                if (i in this)
                    rv = fun.call(null, rv, this[i], i, this);
            }
            return rv;
        };
    }
    /* ES5 Examples
    REDUCE Examples
    Example: Sum up all values within an array

var total = [0, 1, 2, 3].reduce(function(a, b){ return a + b; });  
    // total == 6  

Example: Flatten an array of arrays
    var flattened = [[0,1], [2,3], [4,5]].reduce(function(a,b) {  
    return a.concat(b);  
    }, []);  
    // flattened is [0, 1, 2, 3, 4, 5]  

Example: Filtering out all small values
    The following example uses filter to create a filtered array that has all elements with values less than 10 removed.

function isBigEnough(element, index, array) {  
    return (element >= 10);  
    }  
    var filtered = [12, 5, 8, 130, 44].filter(isBigEnough); 
    
    -------------------------------------------------------------------------------------
    */

    if ("function" !== Object.keys)
        Object.keys = function(object, own) {
            var k = [];
            if (own) {
                for (key in object) {
                    if (HOP_.call(object, key))
                        k[k.length] = key;
                }
            } else {
                for (key in object) k[k.length] = key;
            }
            return k;
        }

    // following two adapterts are used for dbj.forEach
    var make_keys_callback = function(object, callback) {
        var object_ = object;
        return function(key, index, keys_array) {
            /* this callback is called on keys of object_ */
            return callback.call(object_, object_[key], key, object_);
            /* callback arguments are given and ordered by ES5 convention */
        }
    }, make_args_callback = function(callback, args) {
        /* returned callback arguments are given and ordered by ES5 convention */
        return function(value, name, object) {
            return callback.apply(value, args);
        }
    };

    dbj.utl = {

        isMSFT: (/*@cc_on!@*/false),
        isBrowser: "undefined" === typeof WScript,
        
    forEach : function(object, callback, args, own) {
        var Type = TOS_.call(object);

        if (isArray(args)) callback = make_args_callback(callback, args);

        if (isArray(object))
            return object.forEach(callback);
        if ("[object Object]" === Type)
            return (Object.keys(object, own)).forEach(make_keys_callback(object, callback));
        if ("[object String]" === Type)
            return (object.split("")).forEach(callback);

        throw "dbj.forEach() can iterate only over arrays, strings and objects. object argument is found to be: " + roleof(object);
    },
    /*
    Args example : suppose you want to pass arguments object or array of arguments to the callback
        //
        var result = ["non standard callback results"],
        obj = { a: 1, b: 2, c: 3 },
        non_standard_callback = function(a, b, c) { result.push(new Array(this, a, b, c)); return true; }
        dbj.forEach(obj, non_standard_callback, ["A", "B", "C"]);
        alert(result.join("\n"));
        //
    */
    reveal : function(O, drill) {
        /// <summary>
        /// More revealing than JSON.stringify()
        /// </summary>
        ///	<param name="O" type="object">
        ///	Reveal properties and methods of this object
        ///	</param>
        var left_brace, rigt_brace, r;

        // ES5 way : callback.call(thisp, this[i], i, this);
        var callbackO = function(value, name, obj) {
            if (!HOP_.call(obj, name)) return; // do not process inherited properties
            r += (" " + name + ": " + (drill && isObject(obj[name]) ? dbj.reveal(obj[name], drill) : obj[name]) + ",");
        },
          callbackA = function(value, name, obj) {
        r += (" " + (drill && isObject(obj[name]) ? dbj.reveal(obj[name], drill) : obj[name]) + ",");
          }

        if (isArray(O)) {
            left_brace = "[", rigt_brace = "]", r = left_brace;
            O.forEach(callbackA);
        }
        else if (isObject(O)) {
            left_brace = "{", rigt_brace = "}", r = left_brace;
            dbj.forEach(O, callbackO);
        } else {
            left_brace = "", rigt_brace = "", r = left_brace;
            r += (O + ",");
        }

        return (r + rigt_brace).replace("," + rigt_brace, " " + rigt_brace);
    },
       	later: function (func, timeout) {
        		/* execute function a bit latter, default timeout is 1 sec */
        		var args = [].slice.call(arguments, 2);
        		tid = setTimeout(function () {
        			clearTimeout(tid); tid = null; delete tid;
        			func.apply(this || top, args);
        		}, timeout || 1000);
        	}
    , 
        	harvester: function (frm_id, defaults) {
        		/*
        		use this function to harvest form values on inputs named in its "defaults" argument
        		example call :
        		var harvest = harvester("myForm", { "name" : "Default", "age" : 22, "sex" : "male" } );
        		look for inputs name, age and sex in the form "myForm". if input value is null use the
        		values given in the argument.
        		*/
        		var $frm = jQuery("#" + frm_id, document.object), $input,
                getval = function (id_) {
                	$input = $frm.find("input#" + id_);
                	return ($input.val() || defaults[id_]);
                };
        		for (name in defaults) { defaults[name] = getval(name); }
        		return defaults;
        	},
        	round: function (original_number, decimals) {
        		/* quick number rounder */
        		var V1 = original_number * Math.pow(10, decimals), V2 = Math.round(V1);
        		return V2 / Math.pow(10, decimals);
        	},
        	crazyLoader: function () {
        		/* 
        		just slap the script tag(s) in the page wherever that might be 
				do not use script onload event or anything simillar
        		*/
        		for (var i = 0, L = arguments.length; i < L; i++) {
        			document.write("<script type='text/javascript' src='" + arguments[i] + "' ></" + "script>");
        		}
        	}, try_n_times: function (callback, times_, delay_) {
        		/*
        		try N times with delay between, 
        		break if callback returns true
        		defaults:    
        		no of times : 10     
        		uSec in between : 10 
        		*/
        		var tid, times = times_ || 10, delay = delay_ || 10;
        		function _internal() {
        			if (tid) clearInterval(tid); tid = null;
        			if ((times_--) < 1) {
        				return false; // whatever we waited for did not happen
        			}
        			if (false === callback()) {
        				return tid = setInterval(_internal, delay);
        			}
        			return true; // whatever we waited for did happen
        		}
        		return _internal();
        	},
        	table: function (host, id, klass, undefined) {
        		/*
        		very simple and effective table 'writer'

				// all the arguments are optional
        		var tabla = dbj_.table(your_host_dom_element, "your_table_id", "your_css_class_name");

        		tabla.hdr("ID", "Name", "Average Rating");  // defines table of 3 columns
        		tabla.caption("Waiting for " + query[1]);

        		tabla.row(1,"Bob",3.5); // proceed with number of columns
        		tabla.row(2,"DBJ",2.5); // 

        		// optional: style the table made
        		$(tabla.uid()).dataTable(); // apply 'dataTable' jQuery plugin 

        		*/
        		host || (host = document.body);
        		id || (id = "dbj_table_" + (0 + new Date));
        		klass || (klass = "dbj_table");
        		var 
				slice = Array.prototype.slice,
        		/* attach to table if exist */
				$existing = $("#" + id),
				table = $existing[0] ? $existing : jQuery("<table id='{0}' class='{1}'><caption></caption><thead></thead><tbody></tbody>".format(id, klass)).appendTo(host),
                $table = jQuery(table[0], host), colcount = null;
        		delete table;

        		/* 
        		first row added defines number of columns 
        		latter can make row with different number; the table will be jaddged
        		*/
        		function to_row(row_, header) {
        			if (jQuery.isArray(row_)) {
        				if (!colcount) colcount = row_.length;
        				var td = header ? "TH" : "TD", wid = Math.round(100 / colcount);
        				td += " width='{0}%' ".format(wid);
        				row_ = row_.join("</{0}><{0}>".format(td));
        				return "<tr><{0}>{1}</{0}></tr>".format(td, row_);
        			}
        			else {
        				throw "to_row() first argument must be array";
        			}
        		}
        		return {
        			hdr: function () {
        				$table.find("thead").append(to_row(slice.call(arguments), true)); return this;
        			},
        			row: function () {
        				$table.find("tbody").append(to_row(slice.call(arguments))); return this;
        				return this;
        			},
        			caption: function (caption) {
        				$table.find("caption").html(caption || "Caption"); return this;
        			},
        			err: function () {
        				$table.find("tbody").append(to_row(
                        "<span style='color:#cc0000;'>" + slice.call(arguments).join(" ")) + "</span>"
                        );
        				return this;
        			},
        			uid: function () { return id; }
        		}
        	},
        /*-----------------------------------------------------------------------------------------------------
        this is WIN32 only stuff
        -----------------------------------------------------------------------------------------------------*/
        	GUID : function( null_) {
        	    var empty = "00000000-0000-0000-0000-000000000000",
                    four = function() { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).toUpperCase(); },
                // 'fake' GUID for browser hosts
                    make = function() {
                        return (four() +
                         four() + "-" + four() + "-" + four() + "-" + four() + "-" + four() + four() + four());
                    };

        	    if (! dbj.utl.isBrowser ) {
        	        var x_ = null || new ActiveXObject("Scriptlet.TypeLib");
        	        dbj.utl.GUID = function (null_) {
        	            try {
        	                return null_ ? empty : (x_.GUID);
        	            }
        	            catch (e) {
        	                throw "ERROR in dbj.utl.GUID() : " + e;
        	            }
        	        }
        	    }
        	    else {
        	        dbj.utl.GUID = function(null_) { return null_ ? empty : make(); }
        	    }
        	    return dbj.utl.GUID(null_);
        	},
        	date: {
        	    diff: function (date1, date2) {
        	        ///<summary>
        	        ///timespan of the difference of first date and second date
        	        ///returns: '{ "date1": date1, "date2": date2, "weeks": weeks, "days": days, "hours": hours, "mins": "mins", "secs": secs, "approx_years": years }'
        	        ///</summary>
        	        ///<returns type="object" />
        	        var diff = new Date();
        	        diff.setTime(Math.abs(date1.getTime() - date2.getTime()));
        	        var timediff = diff.getTime();
        	        var weeks = Math.floor(timediff / (1000 * 60 * 60 * 24 * 7));
        	        timediff -= weeks * (1000 * 60 * 60 * 24 * 7);
        	        var days = Math.floor(timediff / (1000 * 60 * 60 * 24));
        	        timediff -= days * (1000 * 60 * 60 * 24);
        	        var hours = Math.floor(timediff / (1000 * 60 * 60));
        	        timediff -= hours * (1000 * 60 * 60);
        	        var mins = Math.floor(timediff / (1000 * 60));
        	        timediff -= mins * (1000 * 60);
        	        var secs = Math.floor(timediff / 1000);
        	        timediff -= secs * 1000;
        	        var years = parseInt(weeks / 52);
        	        return { "date1": date1.getTime(), "date2": date2.getTime(), "weeks": weeks, "days": days, "hours": hours, "mins": "mins", "secs": secs, "approx_years": years };
        	    }
        	}
	} /* eof dbj.utl */
})(window, dbj);

