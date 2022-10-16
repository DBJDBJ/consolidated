/// <reference path="../../jq132-vsdoc.js" />
///
/// Dynamic configurable loader.
/// Usage :
/// <script src="http://dbj.org/6/dbj.ldr.js" _CFG_="dbj.lib.json" ></script>
/// Attrib _CFG_ must exist
/// Path to the cfg json is takend from the src attribute
/// json format is this :
/*
{  "dbj.lib.js" : null , "jquery.dbj.js" : null  }

After loading this json will be logged , changed like this

{  "dbj.lib.js" : "success" , "jquery.dbj.js" : "file not found"  }

this says that first file loaded OK, but second did not

*/
/*
* A technique for avoiding browsers' cross-domain restriction
* Allows you to request information cross-domain from client
* You request a script from a cross domain
* That service must respond in JSON wrapped in a function call you specify
*
window.myFunc = function ( data ) {
        alert('JSONP callback');
}
var script = document.createElement('script');
script.src = 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=Dog&callback=myFunc';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);
*/
///
/// GPL (c) 2009 by DBJ.ORG
/// DBJ.LDR.JS(tm)
///
/// $Revision: 18 $$Date: 10/03/10 17:56 $
///
/// Dependencies : jQuery 1.3.2 or higher
(function(global, undefined) {

    window.dbj_loader_cache || (window.dbj_loader_cache = {});

    var 
        dbj = dbj || (dbj = {}),
        STR_JQUERY_URL = "http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js",
        STR_APPLY = "apply",
        STR_ASYNC = "async",
        STR_CACHE = "cache",
        STR_CALL = "call",
        STR_CHAIN = "chain",
        STR_CHARSET = "charset",
        STR_CREATE_ELEMENT = "createElement",
        STR_GET_ELEMENTS_BY_TAG_NAME = "getElementsByTagName",
        STR_HREF = "href",
        STR_LENGTH = "length",
        STR_ON_LOAD = "onload",
        STR_ON_READY_STATE_CHANGE = "onreadystatechange",
        STR_PLUS = "+",
        STR_PUSH = "push",
        STR_READY_STATE = "readyState",
        STR_URL = "url",
        STR_SCRIPT = "script",
        STR_SRC = "src",
        STR_TYPE = "type",
        STR_CFG_ATT = "_CFG_", STR_PTH_ATT = "_PATH_",
        STR_CFG_READY = "_ONREADY_",
        STR_LOADED_SIGNAL = "LOADED",
        STR_DBJ_LOADER = "DBJ*Loader",
        STR_COLON_COLON = "::",
        STR_SPECIAL_CFG_ID = "dbj.lib.cfg",
        loadedCompleteRegExp = /loaded|complete/,
        slice = [].slice,
        head = document[STR_GET_ELEMENTS_BY_TAG_NAME]("head")[0] || document.documentElement,
        join = function() { return [].join.call(arguments, ''); },
        terror = function() {
            var s_ = [].join.call(arguments, '');
            if (console && console.error) console.error(s_);
            throw new Error(0xFFFF, STR_DBJ_LOADER + " ERROR: " + s_);
        };

    // Defer execution just enough for all browsers (especially Opera!)
    function later(func, self, time_out) {
        var THAT = this, ARG = arguments, tid = setTimeout(function() {
            clearTimeout(tid); delete tid;
            try {
                if (!func) debugger;
                func[STR_APPLY](self || global, slice[STR_CALL](ARG, 2));
            } catch (x) {
                terror.call(global, " name: ", x, "", ", message: ", x.message);
            }
        }, time_out || 0);
    }

    // we do this log-method-quickie here so that we do not depend on some library
    // if firebug or other window.console is not present
    var LOG = (function() {
        var local = { end_: null, msg: null, begin_: null, opened: false };
        function is_worker(internal_worker) {
            if ("function" !== typeof internal_worker) return false; // signal it was not a internal worker
            internal_worker.call(local);
            return true; // signal it was an internal worker
        }

        if (window.console) {
            local.begin_ = function() { if (!window.firebug && !local.opened) console.group(STR_DBJ_LOADER); local.opened = !local.opened; }
            local.end_ = function() { if (!window.firebug && local.opened) console.groupEnd(); local.opened = !local.opened; };
            local.msg = function(s_) { return s_; }
            return function() {
                if (is_worker(arguments[0])) return;
                var A = local.msg([].join.call(arguments, ''));
                later(function() {
                    console.log(A);
                }, this, 1000);
            };
        } else {
            local.begin_ = function() { /*...*/ }
            local.end_ = function() { /*...*/ };
            local.msg = function(s_) { return STR_DBJ_LOADER + STR_COLON_COLON + s_; };
            return function() {
                if (is_worker(arguments[0])) return;
                var A = local.msg([].join.call(arguments, ''));
                later(function() {
                    document.body.innerHTML += ("<ul style='margin:2px; padding:2px; font:8px/1.0 verdana,tahoma,arial; color:black; background:white;'><li>" + A + "</ul></li>").replace(/\n/g, "<br/>");
                }, this, 1000);
            }
        };

    } ());
    LOG.OPEN = function() { LOG(function() { this.begin_(); }); };
    LOG.CLOSE = function() { later(function() { LOG(function() { this.end_() }); }, LOG, 2500); };

    // for the time being this method is winning ...
    var loadScript = function(options, callback) {
        if (global.dbj_loader_cache[options[STR_URL]]) return;
        var script = document[STR_CREATE_ELEMENT](STR_SCRIPT),
                done = false;
        script[STR_ASYNC] = STR_ASYNC;
        script[STR_TYPE] = "text/javascript";
        script[STR_CHARSET] = options[STR_CHARSET] || "";
        script["id"] = options["id"] || "";
        script[STR_SRC] = options[STR_URL];

        // Attach handlers for all browsers
        script[STR_ON_LOAD] = script[STR_ON_READY_STATE_CHANGE] = function() {

            if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                done = true;
                // Handle memory leak in IE
                script[STR_ON_LOAD] = script[STR_ON_READY_STATE_CHANGE] = null;

                global.dbj_loader_cache[this.src] = this.id || true;
                head.removeChild(script);

                if ("function" === typeof callback) later(callback, global);
            }
        };
        // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
        // This arises when a base node is used (jQuery #2709 and #4378).
        head.insertBefore(script, head.firstChild);
    };

    //--------------------------------------------------------------------------
    // this is present in ES5
    if ("function" !== typeof "".trim) {
        var Ltrim = /^[\s\u00A0]+/, Rtrim = /[\s\u00A0]+$/;
        String.prototype.trim = function() {
            return this.replace(Ltrim, String.empty).replace(Rtrim, String.empty);
        }
    };
    if ("function" !== typeof Object.keys)
        Object.keys = function(object) {
            var k = [];
            if ("object" === typeof object)
                for (var name in object) {
                if (Object.prototype.hasOwnProperty.call(object, name))
                    k.push(name);
            }
            return k;
        };

    // this is dbj's sequential recursive loader
    // it loads javascritps in sequence, vs. in parallel
    // when last one is done it calls the onready callback
    var loader = function(jQuery, CFG_PATH, CFG_FILE, callback, undefined) {

        CFG_PATH = CFG_PATH.trim();
        CFG_FILE = CFG_FILE.trim();
        var json_string = CFG_FILE.charAt(0) === "{";

        function load_q(data, stat) {
            // key is array of js file names
            // j is index in that array
            function inner_loader(j, key) {
                var js = key[j];
                if (!js) return;
                loadScript({ "url": CFG_PATH + js }, function() {
                    LOG("Loaded:", CFG_PATH, js, " :status: ", stat);
                    if (j === (key.length - 1)) {// time to call the final callback
                        if ("function" === typeof callback) {
                            LOG("Now calling final ONREADY handler");
                            later(callback, window);
                            LOG.CLOSE();
                            return;
                        }
                    } else {
                        inner_loader(j + 1, key);
                    }
                });
            }
            inner_loader(0, Object.keys(data)); // start loading from the first one
        };

        if (!json_string) {
            jQuery.ajaxSetup({ async: false }); // CRUCIAL!
            $.getJSON(CFG_PATH + CFG_FILE, load_q);
        } else {
            load_q(JSON.parse(CFG_FILE), "user declared loader sequence: " + CFG_FILE);
        }
    };
    //
    var on_jq_ready = function() {
        /*
        jQuery(document.body).error(function(msg, url, line) {
        LOG("DBJ*Loader XHR Error: ", msg, "url: ", url, line); return false;
        });
        jQuery(document.body).ajaxError(function(event, xhr, settings, thrownError) {
        LOG("DBJ*Loader XHR Error requesting: ", settings.url, (thrownError ? ", message: " + thrownError.message : "")); return false;
        });
        */
        var $cfg = jQuery("script[" + STR_CFG_ATT + "][src]");
        if ($cfg.length < 1) {
            terror.call(global, "At least one script element must have valid both src and ", STR_CFG_ATT, " attributes");
        }
        $cfg.each(function() {
            try {
                var $this = jQuery(this),
                        CFG_FILE = $this.attr(STR_CFG_ATT),
                        CFG_PATH = $this.attr(STR_PTH_ATT), // try to use path attribute from the script element
                        path = $this.attr('src'),
                        CFG_ONREADY = $this.attr(STR_CFG_READY);

                if (top.dbj_was_here[path]) {
                    LOG("Already done: ", path);
                    return;
                }
                top.dbj_was_here[path] = true;

                if (undefined === CFG_FILE)
                    terror.call(global, STR_CFG_ATT + " attribute is not defined?");
                if (CFG_PATH === undefined) {
                    // if not user defined make path to be the same as script src attribute path component
                    CFG_PATH = path.match(/^.*\//) ? "" + path.replace(/\\/g, "/").match(/^.*\//) : "./";
                }
                var defualt_onready = new Function(join(" console.log('no ready handler found for:", CFG_PATH, CFG_FILE, "')")),
                        on_ready;
                try {
                    on_ready = (new Function("return " + CFG_ONREADY))();

                    if ("function" !== typeof on_ready) {
                        LOG.call(global, "User defined ready handler can not be used, because it is not a function");
                        on_ready = defualt_onready;
                    }
                    LOG("Function : ", CFG_ONREADY, "(), is found to be user defined onready handler");
                } catch (x) {
                    LOG.call(global, "ERROR while evaluating _ON_READY_ attribute. Default onready handler will be used.");
                    on_ready = defualt_onready;
                }
                loader(jQuery, CFG_PATH, CFG_FILE, on_ready);
            } catch (x) {
                LOG.call(global, "ERRROR:\n" + x.message);
            }
        });
    };
    //
    top.dbj_was_here = [];
    LOG.OPEN();

    function load_jquery() { loadScript({ "url": STR_JQUERY_URL }, on_jq_ready); }

    if ("object" !== typeof window.JSON) {
        loadScript({ "url": "http://dbj.org/4/json2.js" }, load_jquery);
    } else {
        load_jquery();
    }

})(window);
    ////////////////////////////////////////////////////////////////////////////////////////