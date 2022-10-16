/*
    DBJ*MICROLIB GPL (c) 2011 by DBJ.ORG
*/
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
if ("function" !== typeof String.format)
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/\{(\d|\d\d)\}/g, function ($0) {
            var idx = 1 * $0.match(/\d+/)[0]; return args[idx] !== undefined ? args[idx] : (args[idx] === "" ? "" : $0);
        }
            );
    }
    /*
    */
var dbj = {

    dummy: (function () {
        var TOS_ = Object.prototype.toString,
        HOP_ = Object.prototype.hasOwnProperty;
        // global helpers
        if ("function" !== typeof window.roleof) {
            window.roleof = function (o) { return TOS_.call(o).match(/\w+/g)[1]; }
        }
        if ("function" !== typeof window.isArray) {
            window.isArray = function (x) { return roleof(x) === "Array"; }
        }
        if ("function" !== typeof window.isObject) {
            window.isObject = function (x) { return roleof(x) === "Object"; }
        }
    } ()),

    sendRequest: function (url, callback, postData) {
        var x, req = dbj.createXMLHTTPObject();
        if (!req) return;
        var method = (postData) ? "POST" : "GET";
        req.open(method, url, true);
        req.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
        if (postData)
            req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        req.onreadystatechange = function () {
            if (req.readyState != 4) return;
            if (req.status != 0 && (req.status != 200 || req.status != 304)) {
                alert('HTTP error ' + (req.statusText || req.status));
                return;
            }
            try {
                callback(/*JSON.parse(req.responseText)*/eval("("+req.responseText+")"));
            } catch (x) {
                alert("sendRequest(), JSON parse error: " + x + "\n\nURL:" + url + "\nText:\n" + req.responseText );
            }
        }
        if (req.readyState == 4) return;
        req.send(postData);
    },

    XMLHttpFactories: [
	function () { return new XMLHttpRequest() },
	function () { return new ActiveXObject("Msxml2.XMLHTTP") },
	function () { return new ActiveXObject("Msxml3.XMLHTTP") },
	function () { return new ActiveXObject("Microsoft.XMLHTTP") }
     ],

    createXMLHTTPObject: function () {
        var i = dbj.XMLHttpFactories.length, e;
        while (i--) {
            try {
                return dbj.XMLHttpFactories[i]();
            }
            catch (e) {
                /**/
            }
        }
        alert("dbj.createXMLHTTPObject() failed ?");
        return false;
    },
    $: function (selector, el) {
        return (el || document).querySelector(selector);
    },
    $$: function (selector, el) {
        return (el || document).querySelectorAll(selector);
    },
    later: function (context, func, timeout) {
        /* execute function a bit later, default timeout is 1 micro sec,execution context is global name space
        arguments after 'timeout', are passed to the callback
        */
        var args = timeout ? [].slice.call(arguments, 3) : [].slice.call(arguments, 1);
        context || (context = (this || window));
        var tid = setTimeout(function () {
            clearTimeout(tid); tid = null; delete tid;
            func.apply(context, args);
        }, timeout || 1);
    },

    addListener: (function () {
        /*** Adds a listener. 
        Due to the fact that IE does not follow standards, this is work around:
        * @see https://developer.mozilla.org/en/DOM/element.addEventListener
        * @see http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-registration
        * @param eventName name of the event.
        * @param handler callback function
        * @param control control to attach, can be an Id or a control
        */

        function fetch_element(el) {
            // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Operators/Comparison_Operators
            if (el === String(el)) return document.getElementById(el);
            else
                return el || window;
        }

        if (window.addEventListener) //Standard W3C
            return function (eventName, handler, control) { return fetch_element(control).addEventListener(eventName, handler, false); }

        if (window.attachEvent) //IExplore
            return function (eventName, handler, control) { return fetch_element(control).attachEvent("on" + eventName, handler); }

        return false;
    } ()),
    /* 
    print to id="status" or to the body
    */
    print: (function () {
        var node = function () { return dbj.$("#status"); },
            W = function (s) { return "<p class='dbj_print_line'>" + s + "</p>"; };
        return function (s_) {
            var rezult_div = node() || document.body; // cludge!
            dbj.later(null, function (x) {
                rezult_div.innerHTML += W(s_);
            }, 1, s_);
        }
    } ())
} /* eof dbj {} */

    /* http://dean.edwards.name/weblog/2009/03/callbacks-vs-events/ */
dbj.addOnLoad = (function () {
    var currentHandler,
            onLoadHandlers = [],
            fakeEvents = "fakeEvents";

    if (document.addEventListener) {
        document.addEventListener(fakeEvents, function () {
            // execute the callback
            currentHandler();
        }, false);

        var dispatchFakeEvent = function () {
            var fakeEvent = document.createEvent("UIEvents");
            fakeEvent.initEvent(fakeEvents, false, false);
            document.dispatchEvent(fakeEvent);
        };
    } else { // MSIE

        document.documentElement[fakeEvents] = 0; // an expando property

        document.documentElement.attachEvent("onpropertychange", function (event) {
            if (event.propertyName === fakeEvents) {
                // execute the callback
                currentHandler();
            }
        });

        var dispatchFakeEvent = function (handler) {
            // fire the propertychange event
            document.documentElement.fakeEvents++;
        };
    }

    /*
    on window load fire all callbacks previously added to onLoadHandlers array
    */
    dbj.addListener("load", function () {
        var i = 0, L = onLoadHandlers.length;
        while ( undefined != (currentHandler = onLoadHandlers[i++])) {
            dispatchFakeEvent();
        }
    });

    /* interface
    assign one or array of callback to be called on window "load" event
    NOTE: absolutely no error checking
    */
    return function (handler) {
        handler = isArray(handler) ? handler : [handler];
        if (handler[0])
            onLoadHandlers = [].slice.call(handler, 0);
    };

} ());

    /* Micro WMI lib */

    dbj.wmi = {
        context: function () { return dbj.wmi; },
        stop_service_retvals: { /* for WMI class Win32_Service */
            "0": "Success",
            "1": "Not Supported",
            "2": "Access Denied",
            "3": "Dependent Services Running",
            "4": "Invalid Service Control",
            "5": "Service Cannot Accept Control",
            "6": "Service Not Active",
            "7": "Service Request timeout",
            "8": "Unknown Failure",
            "9": "Path Not Found",
            "10": "Service Already Stopped",
            "11": "Service Database Locked",
            "12": "Service Dependency Deleted",
            "13": "Service Dependency Failure",
            "14": "Service Disabled",
            "15": "Service Logon Failed",
            "16": "Service Marked For Deletion",
            "17": "Service No Thread",
            "18": "Status Circular Dependency",
            "19": "Status Duplicate Name",
            "20": "Status - Invalid Name",
            "21": "Status - Invalid Parameter",
            "22": "Status - Invalid Service Account",
            "23": "Status - Service Exists",
            "24": "Service Already Paused"
        },

        strComputer: ".",
        SWBemlocator: null,
        objWMIService: null,
        locator: function () { return this.SWBemlocator = this.SWBemlocator || new ActiveXObject("WbemScripting.SWbemLocator"); },
        service: function () { return this.objWMIService = this.objWMIService || this.locator().ConnectServer(this.strComputer, "/root/CIMV2"); },
        exec_method: function (cmd, method, messages) {
            // bollocoks: messages || (messages = { "0": "Unknown" });
            var objOutParams = dbj.wmi.service().ExecMethod(cmd, method);
            try {
                return messages ? messages[objOutParams.ReturnValue] : objOutParams.ReturnValue;
            } catch (x) {
                return "dbj.wmi.exec_method() Error: " + x;
            }
        },
        foreach: function (collection, method, context) {
            for (var e = new Enumerator(collection); !e.atEnd(); e.moveNext()) {
                method.call((context || this), e.item());
            }
        },
        enum_prop_vals: function (wmi_class_name, prop_name) {
            var names = [], colItems = this.service().ExecQuery("Select * from '" + wmi_class_name + "'");
            this.foreach(colItems, function (item) { names.push(item[prop_name]); });
            return names;
        },
        stop_service: function (service_name, printer) {
            var cmd = "Win32_Service.Name='" + service_name + "'", stop_report = [];
            try {
                var context = this, result = context.exec_method(cmd, "StopService");
                stop_report.push("<b>" + service_name + "</b>" + "   result:\t" + context.stop_service_retvals[result]);
                if (0 !== result) {
                    stop_report.push("    reason:\t" + context.exec_method(cmd, "InterrogateService", context.stop_service_retvals));
                }
            } catch (x) {
                stop_report.push(service_name + " stop attempt,failed:\t" + x.message);
            }
            if ("Function" == roleof(printer)) printer(stop_report.join(""));
        }
    };          // dbj.wmi