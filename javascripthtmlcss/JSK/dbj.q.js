//-------------------------------------------------------------------------------------
// (c) 2009-2010 by DBJ.ORG
//     Please mail to: dbjdbj@gmail.com
//     for the usage of this code to be granted 
//
// micro-engine for simpler AND faster page queries
//
// NOTE! this works in all browser supported by this extension
//       since its using querySelectorAll() method
// NOTE! here error checks are *minimal*, and there are no exceptions whatsoever.
// NOTE! this caches the results and thus works ONLY if you do not 
//       add or remove or change nodes you have been searching for. 
//       if you have done this, then use Q.FLUSH() ... see bellow
//       Which makes it ideal for CHROME extensions
//       2009.JAN.01 dbjdbj@gmail.com  Created
(function() {
    // cache is array indexed by container objects
    var cache = [];
    // each cache element is: {  "_container_" : container , "selector" : staticNodeList, ... }
    function cached_selections(cont) {
        // return saved selections for the cont(ainer) or make it if not in the cache
        return cache[cont] || (cache[cont] = { "_container_": cont });
    };
    // ss is individual cache [] element 
    function cached_result(ss, sel) {
        // take the result or make it and store it if not made
        return ss[sel] = ss[sel] || (ss[sel] = ss._container_.querySelectorAll(sel));
    };
    // the Q method is visible on the level of extension aka "globaly"
    // selector is any valid CSS "like" selector
    // container method is optional
    // returns: always an list of matched elements, with a "length" property
    //          no result will return null
    Q = function(selector, container) {
        var list = [];
        if ("string" !== typeof selector) return list;
        if ("object" !== typeof (container || document)) return list;
        list = cached_result(cached_selections(container || document), selector);
        return list.length > 0 ? list : null;
    };
    // flush the cache
    // the whole 
    // or  for the container if given
    // and for the selector if given
    Q.FLUSH = function(container, selector) {
        if (container) {
            if (!selector) {
                cache[container] = null;
                delete cache[container];
                // above leaves 'holes' in the cache 
            }
            else {
                delete cache[container][selector];
            }
        } else
            cache = [];
    };
    // helper : query by ID only, 
    // return the first element found by id given
    // returns null if no element found
    Q.ID = function(id_string) {
        var list = Q("#" + id_string, document);
        return list.length > 0 ? list[0] : null;
    };
    // use this to replace getElementByClassName
    Q.CLASS = function(class_name) {
        var list = Q("." + id_string, document);
        return list.length > 0 ? list[0] : null;
    };
    // helper: return true if query has result,
    // otherwise null
    Q.NULL = function(selector, container) {
        return Q(selector, container).length > 0;
    };
    // for each element found call the function given
    Q.EACH = function(method, selector, container) {
        if ("function" !== typeof method) return;
        var list = Q(selector, container), j = 0;
        if (list)
            for (; j < list.length; j++) {
            method(list[j]); // element found is passed as first argument
        }
    };

    var _q_label_ = "_q_label_" + (+new Date());
    // label each element found by the selector+container given
    // previous labels will be replaced
    // if label_ is object the label of that object will be returned
    // null is returned for missing attributes
    Q.LABEL = function(label_, selector_, container_) {
        try {
            if ("object" === typeof label_) {
                return label_.getAttribute(_q_label_);
            }
            Q.EACH(function(E) {
                E.setAttribute(_q_label_, label_);
            }, selector_, container_);
        } catch (x) {
            Q.LOG("Q.LABEL()," + x);
        }
    };

    // An micro-log 
    var logbuf_ = [], loglock_ = false,
    logtid_ = setInterval(function() {
        if (logbuf_.length < 1) return;
        var logcopy = logbuf_;
        if ("undefined" !== typeof console) console.log(logcopy.join("\n")); else alert(logcopy.join("\n"));
        // a critical moment
        logbuf_ = [];
    }, 1000);

    var q_log_msg_ = null;

    Q.LOG = function(msg_) {
        q_log_msg_ = q_log_msg_ || (q_log_msg_ = Q.msg("log"));
        var tid = setTimeout(function() {
            clearTimeout(tid); delete tid;
            logbuf_.unshift(q_log_msg_.format((new Date()).toLocaleTimeString()) + msg_);
        }, 0);
    };

})();                       // end of Q closure

//
// Q messages aka literal strings
//
( function () {
// messages, aka literal strings
// {0} place holders in strings follow the .NET format rules
     var  en = {
               log : "Q log [{0}] ", // standard message for the log entry
               q_msg_err : "Q.msg ({0}), failed."
    }; // eof 'en' messages

    Q.msg = function ( mid_ ) {
        try {
        var a = Array.prototype.slice.call(arguments) ; a.shift(); // all but first argument
              return String.prototype.format.apply(en[mid_], a ) ;
        } catch (x) {
           Q.LOG(en.q_msg_err.format(mid_));
           return en.q_msg_err.format(mid_);
        }
    }; // eof Q.msg
})();

//-------------------------------------------------------------------------------------
//
// .net string.format like function
// usage:   "{0} means 'zero'".format("nula") 
// returns: "nula means 'zero'"
// place holders must be in a range 0-99.
// if no argument given for the placeholder, 
// no replacement will be done, so
// "oops {99}".format("!")
// returns the input
// same placeholders will be all replaced 
// with the same argument :
// "oops {0}{0}".format("!","?")
// returns "oops !!"
//
String.prototype.format = function() {
    var args = arguments;
    return this.replace(/\{(\d|\d\d)\}/g,
           function($0) {
               var idx = $0.match(/\d+/);
               return args[idx] ? args[idx] : $0;
           });
};

//-------------------------------------------------------------------------------------
// (c) 2009-2010 by DBJ.ORG
//     Please mail to: dbjdbj@gmail.com
//     for the usage of this code to be granted 
//
// DBJ*Q is a micro-engine for simpler AND faster, page queries
// Q.T = Q Text methods
//-------------------------------------------------------------------------------------
(function() {
    if ("undefined" === typeof Q) {
        return alert("ERROR!\nQ.T requires to be included after dbj.q.js!");
    };

    // IE9 navigator.userAgent == "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; OfficeLiveConnector.1.5; OfficeLivePatch.1.3)"
    Q.T = {
        F:   (function() {
            ///<summary>
            /// on the whole text found inside a node given, and anywhere inside its tree
            /// return the result of match with regexp given
            /// white space is filtered out, by the standard reg.exp. for that: /\S+/g
            /// if no regex given, the whole text is returned
            /// on error return null
            ///</summary>
            var 
            Rx = /\S+/g , /*filter out white spaces*/
            text_getter = document.body && document.body.innerText 
            ? function ( node ) { return  node.innerText.match(Rx); }
            : function ( node ) { return  node.textContent.match(Rx); }
            ;
            return function (rootnode, regex) {
            try {
                var paratext = text_getter(rootnode); 
                if (!paratext) return null; // there is no meaningfull text left
                paratext = paratext.join(" ");
                return regex ? paratext.match(regex) : paratext;
            } catch (x) {
                Q.LOG("Q.T.F(), " + x);
                return null;
            }
        } 
        }())
        ,
        M: function(rx_, selector_, container_) {
            ///<summary>
            /// for every  element found by selector
            /// create { "node": object , "match": "..."}
            /// if it contains text found by regexp given
            /// where 'node' is element , and 'match' is the result of
            /// matching the whole of the text found inside the element, using the regexp given
            /// on no result return empty array
            /// on error return null
            ///</summary>
            try {
                var retval = [], rv;
                Q.EACH(function(E) {
                    rv = Q.T.F(E, rx_);
                    if (rv) retval.push({ "node": E, "match": rv });
                }, selector_, container_);
                return retval;
            } catch (x) {
                Q.LOG("Q.T.M()" + " : " + x); return null;
            }
        }
    }; // eof Q.T
})();
//-------------------------------------------------------------------------------------
