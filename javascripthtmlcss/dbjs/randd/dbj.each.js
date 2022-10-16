
// helpers
window.roleof = function(o) { return Object.prototype.toString.call(o).match(/\w+/g)[1]; }

window.isArray = typeof Array.isArray !== "function" 
            ? function (x) { return roleof(x) === "Array"; }
            : Array.isArray;
//
// DBJ each
//
        (function(toString, undefined) {

            // Function Table
            var ft = [      //     0 | 1        T | F   case "D": args==true  && isObj==true, 
               ["A", "B"],  //  0: A | B     T: A | B   case "C": args==true  && isObj==false
               ["C", "D"]   //  -----+--     -----+--   case "B": args==false && isObj==true
            ];              //  1: C | D     F: C | D   case "A": args==false && isObj==false

            var hop = Object.prototype.hasOwnProperty,
                fun_sig = toString.call(Function);  // function signature

            ft[1][1] = /* case "D": args==true && isObj==true */
           function(callback, object, args) {
               for (var name in object) {
                   if ( hop.call(object,name) // Ticket #5499
                       && callback.apply(object[name], args) === false) break;
               }
               return object;
           }
            ft[1][0] =  /* case "C" : args==true && isObj==false */
            function(callback, object, args) {
                var i = object.length; while ((i--) && (callback.apply(object[i], args) !== false));
                return object;
            }

            ft[0][1] = /* case "B" : args==false && isObj==true */
            function(callback, object) {
                for (var name in object) {
                    if (  hop.call(object,name) // Ticket #5499
                        && callback.call(object[name], name, object[name]) === false) break;
                }
                return object;
            }
            ft[0][0] = /* case "A" : args==false && isObj==false */
            function(callback, object) {
                var i = object.length;
                while ((i--) && (callback.call(object[i], i, object[i]) !== false));
                return object;
            }
            //
            window.optimized_each = function(object, callback, args) {
                return ft
                [0 + (!!args)]
                [0 + (object.length === undefined || (toString.call(object) === fun_sig))]
                (callback, object, args);
            }
        })(Object.prototype.toString);
        //------------------------------------------------------------------------------------------
        /* HOP : Has Own Property */
        (function(toString, HOP, undefined) {

            // DBJ first each optimization
            var fsig = toString.call(function() { });
            window.each140 = function(object, callback, args) {
                var name,
			length = object.length,
            isObj = length === undefined || (toString.call(object) === fsig);
                if (args) {
                    if (isObj) {
                        for (name in object) {
                            if (object.hasOwnProperty(name)) { // Ticket #5499
                                if (callback.apply(object[name], args) === false) {
                                    break;
                                }
                            }
                        }
                    } else {
                        // #5496
                        var i = length; while (i--) {
                            if (callback.apply(object[i], args) === false) {
                                break;
                            }
                        }
                    }

                    // A special, fast, case for the most common use of each
                } else {
                    if (isObj) {
                        for (name in object) {
                            if (object.hasOwnProperty(name)) { // Ticket #5499
                                if (callback.call(object[name], name, object[name]) === false) {
                                    break;
                                }
                            }
                        }
                    } else {
                        // #5496
                        var i = length; while (i--) {
                            if (callback.call(object[i], i, object[i]) === false) break;
                        }
                    }
                }
                return object;
            };
            // -------------------------------------------------------------------------------------------
            // each 1.2.6
            //
            // from jQuery 1.2.6
            window.each126 = function(object, callback, args) {
                var name, i = 0, length = object.length;

                if (args) {
                    if (length == undefined) {
                        for (name in object)
                            if (callback.apply(object[name], args) === false)
                            break;
                    } else
                        for (; i < length; )
                        if (callback.apply(object[i++], args) === false)
                        break;

                    // A special, fast, case for the most common use of each
                } else {
                    if (length == undefined) {
                        for (name in object)
                            if (callback.call(object[name], name, object[name]) === false)
                            break;
                    } else
                        for (var value = object[0];
					i < length && callback.call(value, i, value) !== false; value = object[++i]) { }
                }

                return object;
            };
            /* As in jQuery but with ES5 constructs
            ES5 callback call is arranged like this :
            callback.call( context, value, index_or_name, structure);
            IMPORTANT! context is user defined, in ES5 if not, it is null, not global object any  more!         
            example:
            callback.call(obj, this[i], i, this);                        
            where this is array and i is index of it, and obj is null by default                       
            */
            window.each_es5 = function(object, callback, args) {
                var name, i = 0, length = object.length;

                if (args) {
                    /* args is for internal usage only. ES5 could not be applied here. */
                    if ("Object" === roleof(object)) {
                        for (name in object)
                            if (HOP.call(object, name) && callback.apply(object[name], args) === false)
                            break;
                    } else
                        for (; i < length; ) {
                        if (callback.apply(object[i++], args) === false) break;
                    }
                } else {
                    /* The most common use of each */
                    switch (roleof(object)) {
                        case "Object":
                            for (name in object) {
                                if (HOP.call(object, name) && callback.call(object[name], name, object[name]) === false)
                                    break;
                            }
                            break;
                        case "Array":
                            object.forEach(callback);
                            break;
                        case "String":
                            (object.split("")).forEach(callback);
                            break;
                        case "Number":
                            for (; i < object; i++) {
                                if (callback.call(i, i, i) === false) break;
                            }
                            break;
                        default:
                            throw "each_es5 can not iterate over type: " + roleof(object);
                    }
                }
                return object;
            }
            //----------------------------------------------------------------------------------------------
            // optimization :: no ES5
            window.each7 = function (object, callback, args) {
                var name, i = 0, value, length = object.length || 0 ;
                if ("object" === typeof object) {
                    for (name in object) {
                        value = object[name];
                        if (HOP.call(object, name) && callback.apply(value, args || [name, value]) === false) {
                            break;
                        }
                    }
                } else {
                    for (; i < length; i++) {
                        value = object[i];
                        if (callback.apply(value, args || [i, value]) === false) {
                            break;
                        }
                    }
                }
                return object;
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////////
        })(Object.prototype.toString, Object.prototype.hasOwnProperty);
