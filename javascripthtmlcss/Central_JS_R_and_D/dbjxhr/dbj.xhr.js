/*
$Revision: 1 $ $Date: 22/12/09 17:10 $

DBJ XHR 
------------------------------------------------------------------------
http://www.w3.org/TR/XMLHttpRequest/

interface XMLHttpRequest {
// event handler
attribute EventListener onreadystatechange;

// state
const unsigned short UNSENT = 0;
const unsigned short OPENED = 1;
const unsigned short HEADERS_RECEIVED = 2;
const unsigned short LOADING = 3;
const unsigned short DONE = 4;
readonly attribute unsigned short readyState;

// request
void open(in DOMString method, in DOMString url);
void open(in DOMString method, in DOMString url, in boolean async);
void open(in DOMString method, in DOMString url, in boolean async, in DOMString user);
void open(in DOMString method, in DOMString url, in boolean async, in DOMString user, in DOMString password);
void setRequestHeader(in DOMString header, in DOMString value);
void send();
void send(in DOMString data);
void send(in Document data);
void abort();

// response
DOMString getAllResponseHeaders();
DOMString getResponseHeader(in DOMString header);
readonly attribute DOMString responseText;
readonly attribute Document responseXML;
readonly attribute unsigned short status;
readonly attribute DOMString statusText;
};

*/
function dbjXHTTP() {
    return {
        open: function(type, url, async, username, password) {
            this.stack += "open()|";
            this.my_data["open"] = {};
            this.my_data["open"]["type"] = type;
            this.my_data["open"]["url"] = parseUri(url);
            this.my_data["open"]["async"] = async;
            this.my_data["open"]["username"] = username;
            this.my_data["open"]["password"] = password;
            // before calling open() jQ will do the following:
            // if type is "GET" data available will be made into url query (aka argument)
            // data will be made null
            // and send() will be called with no data
            // if type is not "GET" send() will be called with data
            // therefore ...
            if (type == "GET") {
                this.my_data["data"] = this.my_data["open"]["url"].query;
                this.responseText = this.my_data["data"];
                this.responseXML = this.my_data["data"];
            }
        },
        // xhr.setRequestHeader("Content-Type", s.contentType);
        setRequestHeader: function(name, value) {
            this.stack += "setRequestHeader()|";
            this.my_data["requestHeader"] = !this.my_data["requestHeader"] ? {} : this.my_data["requestHeader"];
            this.my_data["requestHeader"][name] = value;
        },
        // close opended socket
        abort: function() {
            this.stack += "abort()|";
        },
        readyState: 4 /* aka 'complete' */,

        // Have to handle :
        // getResponseHeader("Last-Modified");
        // getResponseHeader("content-type")
        getResponseHeader: function(type) {
            this.stack += "getResponseHeader()|";
            this.my_data["responseHeader"] = !this.my_data["responseHeader"] ? {} : this.my_data["responseHeader"];
            this.my_data["responseHeader"][type] = "required by: " + arguments.caller;
            // it seems this is ok for json returns
            // jQ only checks if 'xml' is in the returned string
            if (type.toLowerCase() == "content-type") return "application/x-javascript";
            // NotModified for FFox ?
            // also it is apprently OK to return nothing ...
            if (type.toLowerCase() == "last-modified") return "NotModified";
            // ok for others ?
            return "application/x-www-form-urlencoded";
        },
        // xhr.status >= 200 && xhr.status < 300
        status: 200 /* aka OK */,
        send: function(data) {
            this.stack += "send()|";
            this.my_data["data"] = data;
            if (data != null) {
                // if method is "GET" data is null
                // so in the open() method we have already set up url query to be the response
                // and we do not want to loose it here
                this.responseText = data;
                this.responseXML = data;
            }
        },

        // have to handle
        // data = xml ? xhr.responseXML : xhr.responseText
        responseXML: "",
        responseText: "",

        my_data: {}, // internal
        stack: "" // internal
    };
}
