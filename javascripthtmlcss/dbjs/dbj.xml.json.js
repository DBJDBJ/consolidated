/// DBJ.XML.JSON.JS(tm)
/// (c) 2009 by DBJ.ORG(tm)
/// This work is licensed under Creative Commons GNU LGPL License.
///	License: http://creativecommons.org/licenses/LGPL/2.1/
/// $Revision: 2 $$Date: 12/03/10 17:18 $
(function($, dbj) {
    var window = this, undefined;
    /*	Inspired by:  Stefan Goessner/2006 http://goessner.net/ 
    */
    dbj.json2xml = function(o, options) {
        options = options || {};
        var tab = options.tab || "";
        var rootname = options.rootname || dbj.json2xml.rootname;
        var O = dbj.json2xml.open, C = dbj.json2xml.close;
        var toXml = function(v, name, ind) {
            var xml = "";
            v = v || ""; // DBJ: value may be null
            if (!name) // DBJ: but name can not
                return xml;
            if (dbj.roleof(v) === "Array") {
                // DBJ: added above usage
                for (var i = 0, n = v.length; i < n; i++)
                    xml += ind + toXml(v[i], name, ind + "\t") + "\n";
            }
            else if (dbj.roleof(v) === "Object") {
                // DBJ: added above usage
                var hasChild = false;
                xml += ind + "<" + name;
                for (var m in v) {
                    if (m.charAt(0) == "@")
                        xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
                    else
                        hasChild = true;
                }
                xml += hasChild ? ">" : "/>";
                if (hasChild) {
                    for (var m in v) {
                        if (m == "#text")
                            xml += v[m];
                        else if (m == "#cdata")
                            xml += "<![CDATA[" + v[m] + "]]>";
                        else if (m.charAt(0) != "@")
                            xml += toXml(v[m], m, ind + "\t");
                    }
                    xml += (xml.charAt(xml.length - 1) == "\n" ? ind : "") + C(name);
                }
            }
            else if (dbj.roleof(v) === "Number") {
                xml += ind + O(name) + (v + "") + C(name);
            }
            else if (dbj.roleof(v) === "Date") {
                xml += ind + O(name) + (v + "") + C(name);
            }
            else if (dbj.roleof(v) === "String") {
                xml += ind + O(name) + dbj.decode(v) + C(name);
            }
            else {
                // everything else (of course) is transformed into CDATA
                xml += ind + O(name) + "<![CDATA[" + dbj.decode(v) + "]]>" + C(name);
            }
            return xml;
        }, xml = "";
        for (var m in o)
            xml += toXml(o[m], m, "");
        xml = O(rootname) + xml + C(rootname); // DBJ added
        return xml.replace(/\t/g, tab).replace(/\n/g, "");
    }
    dbj.json2xml.rootname = "json";
    dbj.json2xml.open = function(tag) { return "<" + dbj.json2xml.legalize(tag) + ">"; }
    dbj.json2xml.close = function(tag) { return "</" + dbj.json2xml.legalize(tag) + ">"; }
    dbj.json2xml.legalize = function(name) { return name.replace(/\~\$|\@|\W/g, '_'); }


    /*
    XML strings, have to be parsed first into xml document nodes. 
    This can be accomplished by the following function ( also tested in Firefox 1.5 and IE6)
    With this helper function a TEST conversion can be performed as follows:

var xml = '<e name="value">text</e>',
    dom = parseXml(xml),
    json = xml2json(dom),
    xml2 = json2xml(eval(json));
    */
    dbj.parseXml = dbj.role.isFunction(window.DOMParser) ? function(xml) {
        // returns xml dom doc , or throws exception 
        return (new DOMParser()).parseFromString(xml, "text/xml");
    }
   : dbj.role.isFunction(window.ActiveXObject) ? function(xml) {
    // returns xml dom doc , or throws exception 
    var dom, error = null;
        dom = new ActiveXObject('Microsoft.XMLDOM');
        dom.async = false;
        if (!dom.loadXML(xml)) // parse error ..
            throw "XML Parsing Error: " + dom.parseError.reason + ", src text: " + dom.parseError.srcText;
    return dom;
   } : function(xml) {
       throw new Error(0xFF, "Cannot parse xml in this browser?");
   }
    /*	This work is licensed under Creative Commons GNU LGPL License.

License: http://creativecommons.org/licenses/LGPL/2.1/
    Version: 0.9
    Author:  Stefan Goessner/2006
    Web:     http://goessner.net/ 
    */
    dbj.xml2json = function(xml, tab) {
        var LB = "{", RB = "}", CL = ":";
        var X = {};
        X.toObj = function(xml) {
            var o = {};
            if (xml.nodeType == 1) {   // element node ..
                if (xml.attributes.length)   // element with attributes  ..
                    for (var i = 0; i < xml.attributes.length; i++)
                    o["@" + xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue || "").toString();
                if (xml.firstChild) { // element has child nodes ..
                    var textChild = 0, cdataChild = 0, hasElementChild = false;
                    for (var n = xml.firstChild; n; n = n.nextSibling) {
                        if (n.nodeType == 1) hasElementChild = true;
                        else if (n.nodeType == 3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                        else if (n.nodeType == 4) cdataChild++; // cdata section node
                    }
                    if (hasElementChild) {
                        if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                            X.removeWhite(xml);
                            for (var n = xml.firstChild; n; n = n.nextSibling) {
                                if (n.nodeType == 3)  // text node
                                    o["#text"] = X.escape(n.nodeValue);
                                else if (n.nodeType == 4)  // cdata node
                                    o["#cdata"] = X.escape(n.nodeValue);
                                else if (o[n.nodeName]) {  // multiple occurence of element ..
                                    if (o[n.nodeName] instanceof Array)
                                        o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                                    else
                                        o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                                }
                                else  // first occurence of element..
                                    o[n.nodeName] = X.toObj(n);
                            }
                        }
                        else { // mixed content
                            if (!xml.attributes.length)
                                o = X.escape(X.innerXml(xml));
                            else
                                o["#text"] = X.escape(X.innerXml(xml));
                        }
                    }
                    else if (textChild) { // pure text
                        if (!xml.attributes.length)
                            o = X.escape(X.innerXml(xml));
                        else
                            o["#text"] = X.escape(X.innerXml(xml));
                    }
                    else if (cdataChild) { // cdata
                        if (cdataChild > 1)
                            o = X.escape(X.innerXml(xml));
                        else
                            for (var n = xml.firstChild; n; n = n.nextSibling)
                            o["#cdata"] = X.escape(n.nodeValue);
                    }
                }
                if (!xml.attributes.length && !xml.firstChild) o = null;
            }
            else if (xml.nodeType == 9) { // document.node
                o = X.toObj(xml.documentElement);
            }
            else
                alert("unhandled node type: " + xml.nodeType);
            return o;
        }
        X.toJson = function(o, name, ind) {
            var json = name ? ("\"" + name + "\"") : "";
            if (dbj.roleof(o) === "Array") {
                for (var i = 0, n = o.length; i < n; i++)
                    o[i] = X.toJson(o[i], "", ind + "\t");
                json += (name ? ":[" : "[") + (o.length > 1 ? ("\n" + ind + "\t" + o.join(",\n" + ind + "\t") + "\n" + ind) : o.join("")) + "]";
            }
            else if (o == null)
                json += (name && CL) + "null";
            else if (dbj.roleof(o) === "Object") {
                var arr = [];
                for (var m in o)
                    arr[arr.length] = X.toJson(o[m], m, ind + "\t");
                json += (name ? (CL + LB) : LB) + (arr.length > 1 ? ("\n" + ind + "\t" + arr.join(",\n" + ind + "\t") + "\n" + ind) : arr.join("")) + RB;
            }
            else if (dbj.roleof(o) === "String")
                json += (name && CL) + "\"" + o.toString() + "\"";
            else
                json += (name && CL) + o.toString();
            return json;
        }
        X.innerXml = function(node) {
            var s = ""
            if ("innerHTML" in node)
                s = node.innerHTML;
            else {
                var asXml = function(n) {
                    var s = "";
                    if (n.nodeType == 1) {
                        s += "<" + n.nodeName;
                        for (var i = 0; i < n.attributes.length; i++)
                            s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue || "").toString() + "\"";
                        if (n.firstChild) {
                            s += ">";
                            for (var c = n.firstChild; c; c = c.nextSibling)
                                s += asXml(c);
                            s += "</" + n.nodeName + ">";
                        }
                        else
                            s += "/>";
                    }
                    else if (n.nodeType == 3)
                        s += n.nodeValue;
                    else if (n.nodeType == 4)
                        s += "<![CDATA[" + n.nodeValue + "]]>";
                    return s;
                };
                for (var c = node.firstChild; c; c = c.nextSibling)
                    s += asXml(c);
            }
            return s;
        }
        X.escape = function(txt) {
            return txt.replace(/[\\]/g, "\\\\")
                   .replace(/[\"]/g, '\\"')
                   .replace(/[\n]/g, '\\n')
                   .replace(/[\r]/g, '\\r');
        }
        X.removeWhite = function(e) {
            e.normalize();
            for (var n = e.firstChild; n; ) {
                if (n.nodeType == 3) {  // text node
                    if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                        var nxt = n.nextSibling;
                        e.removeChild(n);
                        n = nxt;
                    }
                    else
                        n = n.nextSibling;
                }
                else if (n.nodeType == 1) {  // element node
                    X.removeWhite(n);
                    n = n.nextSibling;
                }
                else                      // any other node
                    n = n.nextSibling;
            }
            return e;
        }
        //
        if (typeof xml !== "object") throw new Error(0xFF, "dbj.xml2json() needs xml doc object as first argument.");
        if (xml.nodeType == 9) // document node
            xml = xml.documentElement;
        if (xml.xml.length < 2) return "{}"; // DBJ added
        var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
        return (LB + "\n") + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + ("\n" + RB);
    }


})(jQuery, dbj);