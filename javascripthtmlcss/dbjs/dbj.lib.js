/// <reference path="../../jq132-vsdoc.js" />
///
/// DBJ: "Infinitely well organized information leads to infinitely fragmented storage
/// of the same information. That is the attribute of our universe.
/// Goedels theorem is one proof."
///
/// GPL (c) 2009 by DBJ.ORG
/// DBJ.LIB.JS(tm)
/// $Revision: 25 $$Date: 11/03/10 15:29 $
///
/// Dependencies : none
(function (global, undefined) {

    if ( "undefined" !== typeof dbj ) throw "dbj object can not be defined before dbj.lib is created ?" ;
    //
    var  
    TOS = Object.prototype.toString,
    HOP = Object.prototype.hasOwnProperty,
    SLC = Array.prototype.slice,
    JON = Array.prototype.join,
    STT = window.setTimeout,
    CTT = window.clearTimeout;
    //
    var local = {
        "delay": function(func, self, time_out) {
            var tid = STT(function() {
                CTT(tid); delete tid;
                func.apply(self || global, SLC.call(arguments, 2));
            }, time_out || 0);
        },
        "isMSFT": (/*@cc_on!@*/false),
        "isBrowser": "undefined" === typeof WScript,
        "string_indexing": "ABC"[0] === "A",
        "alert_": (function(browser_host) {
            return browser_host ? function(m_) { var tid = STT(function() { CTT(tid); global.alert("" + m_); }, 1); }
        : function(m_) { WScript.Echo("" + m_); }
        })("undefined" === typeof WScript),
        "konsole": {
            "cons": (function(browser_host) {
                return browser_host && global.console
                       ? global.console : { log: this.alert_, warn: this.alert_, error: this.alert_, group: this.empty, groupEnd: this.empty };
            })("undefined" === typeof WScript),
            bg: function(m_) { this.cons.group(m_ || "DBJ"); return this; },
            eg: function() { this.cons.groupEnd(); return this; },
            log: function(m_) { this.bg(); this.cons.log(m_ || "::"); this.eg(); return this; },
            warn: function(m_) { this.bg(); this.cons.warn(m_ || "::"); this.eg(); return this; },
            error: function(m_) { this.bg(); this.cons.error(m_ || "::"); this.eg(); return this; },
            terror: function(m_) { this.error(m_); throw "DBJS*ERROR! " + m_; return this; },
            not_implemented: function() { this.terror(" not implemented yet"); }
        }
    }; // local
    /// The DBJ library object
    dbj = {
        extend : function() {
            var options, src, copy;
            for (var i = 0, length = arguments.length; i < length; i++) {
                if (!(options = arguments[i])) continue;
                for (var name in options) {
                    copy = options[name];
                    // Prevent never-ending loop
                    if (dbj === copy) continue;
                    // Don't bring in undefined values
                    if (copy !== undefined) dbj[name] = copy;
                }
            }
            return dbj;
        },
      "later": function(func, timeout) {
                /* execute a function bit latter, default timeout is 1 sec */
                var tid = setTimeout(function() {
                    clearTimeout(tid); tid = null; delete tid;
                    func.apply(this || top, [].slice.call(arguments, 2));
                }, timeout || 1000);
            },
        "konsole": local.konsole,
        "toString": function() { return "dbjS (tm) " + this.version + " (c) 2001 - 2013 by DBJ.ORG"; },
        "version": "2013.1",
        "empty": function() { },
        // feature checks , specific for DBJS 
        "ftr": {
            "isMSFT": local.isMSFT,
            "isBrowser": local.isBrowser,
            "string_indexing": local.string_indexing
        }, // ftr
        "browser": { "support": { "orphan_css": true} },
        "decode": function(s, en) {
            // Encodes the basic 4 characters used to malform HTML in XSS hacks
            if ("String" === dbj.roleof(s) && s.length > 1) {
                en = en || true;
                // do we convert to numerical or html entity?
                if (en) {
                    s = s.replace(/\'/g, "&#39;"); //no HTML equivalent as &apos is not cross browser supported
                    s = s.replace(/\"/g, "&quot;");
                    s = s.replace(/</g, "&lt;");
                    s = s.replace(/>/g, "&gt;");
                } else {
                    s = s.replace(/\'/g, "&#39;"); //no HTML equivalent as &apos is not cross browser supported
                    s = s.replace(/\"/g, "&#34;");
                    s = s.replace(/</g, "&#60;");
                    s = s.replace(/>/g, "&#62;");
                }
                return s;
            } else {
                return "";
            }
        },
        "uid": function(uid_) {
            /* unique identifier generator, made of dbj.prefix and the timer id. */
            return this.prefix + (uid_ = global.setTimeout(function() { global.clearTimeout(uid_) }, 0));
        },
        "prefix": "dbj",
        "now": function() { /* In a getTime format */return +(new Date()); },
        "create": function(o) {
            ///<summary>
            /// inspired by: http://javascript.crockford.com/prototypal.html
            /// This 'works' for all cases.
            /// dbj.create({}) returns new object inherited from object argument
            /// dbj.create([]) returns new array  inhertied from array  argument
            /// all "illegal" calls returns object that has empty object as a parent
            ///</summary>
            function F() { }; F.prototype = o || {};
            return new F();
        },
        "json": {
            ok_string: (function() {
                var rx0 = /^[\],:{}\s]*$/,
                rx1 = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                rx2 = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                rx3 = /(?:^|:|,)(?:\s*\[)+/g;
                return function(data) {
                    return rx0.test(data.replace(rx1, "@").replace(rx2, "]").replace(rx3, ""));
                }
            } ())
        },
        "xml": {
            /// <summary>
            /// cross browser xml doc creation 
            /// </summary>
            "doc": (global.ActiveXObject === undefined) ?
                function() { return document.implementation.createDocument("", "", null); }
            :
                function() { return new global.ActiveXObject("MSXML2.DOMDocument"); }
        },
        /*
        return undefined on any object that is not "object" or "function"
        return true if arg is empty object
        ignore the possible prototype chain
        */
        "isEmpty": function(object) {
            if (typeof object !== 'object' && typeof object !== 'function') return;
            for (var name in object) {
                if (HOP.call(object, name)) {
                    return false;
                }
            }
            return true;
        },
        "isNative": (function() {
            var function_signature = function(f) {
                // signature of a method through string decomposition
                // returns: [ <method name> , <method body with '~' instead of name>]
                // DBJ.ORG 2009-2010
                var name = (f + "").match(/\w+/g)[1]; // name
                return [name, (f + "").replace(name, "~")]; // signature
            }, native_signature = function_signature(Function);
            return function(f) {
                if (!local.isMSFT && "function" !== typeof f) return; // undefined on bad argument
                // we can do this test only for non-msft hosts since in an IE window.alert() is object
                try {
                    var sig = function_signature(f); // make name,signature pair
                    return sig[1] === native_signature[1]; // compare the signatures
                } catch (x) {
                    return false;
                }
            }
        })()

    }; // eof dbj {}
    //-----------------------------------------------------------------------------------------------------
    if (dbj.ftr.isBrowser) // in a browser
    {
        // CSS properties on new elements still not attached to the document
        // check if CSS properties get/set is supported on newly created but still detached elements
        // check only for W3C compliant browsers
        if (typeof global.getComputedStyle === "function") {
            var btn = document.createElement("button");
            btn.style.color = "red";
            dbj.browser.support.orphan_css = ("" !== global.getComputedStyle(btn, null).getPropertyValue("color"));
            delete btn;
        }

        /*
        IMPORTANT: FireFox has a problem with nested closures
        */

        if ("object" === typeof window.JSON)
            try {
            JSON.parse('{ a : 1 }');
            dbj.json.nonstandard = true;
                /* { "a:" :1 } is standard */
        } catch (x) {
            dbj.json.nonstandard = false;
        }

        // non-standard JSON stops here
        dbj.json.parse =
     (global.JSON && ("function" === typeof global.JSON.parse)) ?
           dbj.json.nonstandard ?
             function json_parse(data) {
                 if (!dbj.json.ok_string(data)) dbj.konsole.terror("Bad JSON string.");
                 return global.JSON.parse(data);
             }
          : // else 
             function json_parse(data) {
                 return global.JSON.parse(data);
             }
    : // else 
    function json_parse(data) {
        if (!dbj.json.ok_string(data)) dbj.konsole.terror("Bad JSON string.");
        return (new Function("return " + data))();
    }
    } // if isBrowser
    //-----------------------------------------------------------------------------------------------------
})(this);

//--------------------------------------------------------------------------------------------
// synchronous and asynchronous function callers
(function() {
    // arguments to array
    function a2a(A, start_index) {
        A = A || a2a.caller.arguments;
        return Array.prototype.slice.call(A, start_index || 0)
    };
    // synchro caller
    // function F () { alert( a2a() ); }
    // var retval = callA(F,1,2,3)
    dbj.sync = function(cb) {
        if ("function" !== typeof cb) dbj.konsole.terror("dbj.callS() first argument must be a function.");
        var args = a2a(arguments, 1);
        return cb.apply(this, args);
    }
    /*
    asynchronous caller
    function F () { alert( a2a() ); }
    callA(F,1,2,3)
    obviously there is no return value, use: dbj.async.retval 
    */
    dbj.async = function(cb) {
        var self = this, args = arguments, tid = window.setTimeout(function() {
            window.clearInterval(tid); tid = null; delete tid;
            dbj.async.retval = dbj.sync.apply(self, args);
        }, dbj.async.microseconds);
    }
    dbj.async.microseconds = 100;
    dbj.async.retval = undefined;
})();

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//
(function () {
    ///<summary>
    ///usefull regular expressions
    ///</summary>
    /*
    The following table lists frequently used special characters and their Unicode value.
    
    Category	        Unicode value	        Name	Format name
    White space values	
                        \u0009	Tab	            <TAB>
                        \u000B	Vertical Tab	<VT>
                        \u000C	Form Feed	    <FF>
                        \u0020	Space	        <SP>
    Line terminator values	
                        \u000A	Line Feed	    <LF>
                        \u000D	Carriage Return	<CR>
    Additional Unicode escape sequence values	
                        \u0008	Backspace	    <BS>
                        \u0009	Horizontal Tab	<HT>
                        \u0022	Double Quote	 "
                        \u0027	Single Quote	'
                        \u005C	Backslash	\
    */
    dbj.rx = {
        catch_all: [
        ///<summary>
        ///catch-all regular expressions
        ///</summary>
               (new RegExp).compile(".|\\n+", "mg"),
        ///<summary>
        ///this one is apparently correct and slow
        ///</summary>
               (new RegExp).compile("[\\w\\W].*?", "mg")
        ///<summary>
        ///this one is apparently unbelievably fast, and correct
        ///</summary>
        ],
        c_style_comments: (new RegExp).compile("(\\/\\*)(.*?)(\\*\\/)", "mg"),
        ///<summary>
        /// match /* */ comments
        ///</summary>
        slashslash_comments: (new RegExp).compile("(\\/\\/)(.*?)($)", "mg"),
        ///<summary>
        /// match // comments
        ///</summary>
        source_junk: (new RegExp).compile("\\t+|\\s*", "mg"),
        ///<summary>
        /// match \t, and \s , but NOT \n or \r !
        ///</summary>
        new_line: (new RegExp).compile("\\n+|\\r+", "mg")
        ///<summary>
        /// match ONLY \n or \r
        ///</summary>
    }

})();
//-----------------------------------------------------------------------------
(function(tos, window, undefined ) {
    dbj.classof = function(o) {
    ///<summary>
    /// as far as I know this works properly everywhere but in IE
    /// 'even' for the likes of top.alert()
    ///</summary>
    return tos.call(o);
    }

    /*@cc_on
    @if (1==1)
    // IE only version, overwrites the previous version
    var rxo = /\bObject\b/, rxf = /\bfunction\b/,
    u = tos.call(undefined),
    n = tos.call(null);

    dbj.classof = function(o) {
    ///<summary>
    /// The controversial type alert === "object", in IE has born the
    /// following controversial classof() function
    /// it is based on object decomposition, so it might not work in some browsers
    /// although there is a very smal probability of that
    ///</summary>
    if (o === undefined) return u;
        if (o === null) return n;
        var descriptor = tos.call(o);
        try {
            // non-objects are properly described in IE 
            if (!rxo.test(descriptor))
                return descriptor;
            // decompose objects
            var ret = (o + "").match(/\w+/g);
            return rxf.test(ret[0]) ? "[object Function]" : "[" + ret[0] + " " + ret[1] + "]";
        } catch (x) {
            // illegal object literals can provoke decomposition exception
            return descriptor;
        }
    }
    @end
    @*/
})(Object.prototype.toString, window );




//-------------------------------------------------------------------------------------------------------
(function() {
    ///<summary>
    ///Terminology is important. W3C term "Class" is unfortunately selected. 
    ///There is no OO Class in JavaScript. It is a prototype based language.
    ///Therefore, I will use the term: "role" instead of "class", to name JavaScript types. 
    ///Object.prototype.toString.call(o) returns what W3C call "Class".
    ///I shall call it:"type descriptor"
    ///It's format I shall define as :  "[ object " + <role name> + "]"
    ///Example:  "[object Error]"
    ///"role names" are in essence names of all javascript global objects
    ///This will help us understand what is the type name and what is the role.
    ///Example: [] is an "object" whose role is to be an "Array".
    ///There is no "roleof" operator in javascript. I shall be so bold 
    ///to implement the closest approximation to it.
    ///I shall encapsulate the implementation in one global object.
    /// Note: There are 3 kinds of objects: JavaScript, Browser and DOM objects
    ///</summary>
    var globals = [
	        new Array, new Boolean, new Date, new Error, new Function, Math,
	        new Number, new Object, new RegExp, new String
       ];
    if ("object" === typeof Arguments) // ECMA5 Arguments object
        globals[globals.length] = Arguments;

    if ("object" === typeof JSON) // add JSON if exist as inbuilt object
        globals[globals.length] = JSON;

    dbj.role = {
        name: function(o) {
            ///<summary>
            /// NOTE: for DOM objects function bellow will return "object"
            ///       in IE. example: window.alert returns "object"
            ///</summary>
            return o === undefined ? "undefined" : o === null ? "null" : Object.prototype.toString.call(o).match(/\w+/g)[1];
        },
        names: {
        ///<summary>
        /// distinctive role names, and their unique role id's
        /// { "Array" : 0, ... }
        ///</summary>
    }
};
// EXPORT to the global space
window.roleof = dbj.roleof = dbj.role.name ;
//
/// generate dbj.role.names object, with distinctive role names
/// and their type ID's
var name_ = "";
for (var j = 0; j < globals.length; j++) {
    name_ = dbj.role.name(globals[j]);
    dbj.role.names[name_] = j;
};

/// generate dbj.role.is<role name>() checks
/// we compare role id's bellow, not names
/// so we compare numbers, not strings
for (var j in dbj.role.names) {
    dbj.role["is" + j] = Function(
              "o",
              "return dbj.role.names[dbj.role.name(o)] === dbj.role.names['" + j + "'];");
};
})();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
(function (tos) {
    var fs_ = tos.call(function () { }),  /* function signature */
        os_ = tos.call({});              /* object signature */
    dbj.isFunction = ("function" === (typeof window.open)) ? function (f) {
        ///<summary>
        /// isFunction V.5
        /// does not handle properly only one case and only in IE
        /// var singularity = { toString: undefined, valueOf : function(){return "function";}}
        ///</summary>
        return fs_ === tos.call(f);
    } :
    function (f) {
        // IE version is less trivial since in IE dom and browser methods are of a type "object"
        // "object" === typeof window.alert
        try {
            return /\bfunction\b/.test(f);
        } catch (x) {
            return false;
        }
    };

    dbj.isObject = ("function" === (typeof window.open)) ? function (x) {
        return (os_ === tos.call(x));
    } : function (x) {
        // In IE we have to take care of the dom and browser objects being of a
        // "object" type. So we have to check first (in IE only) dbj.isFunction(x)
        if (dbj.isFunction(x)) return false;
        return (os_ === tos.call(x));
    };

})(Object.prototype.toString);
