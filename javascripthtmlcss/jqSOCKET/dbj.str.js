/*

 MIT (c) 2009-2013 by DBJ.ORG
 DBJ.STR.JS(tm)
-----------------------------------------------------------------------------
DBJ String additions
no dependancies

CURRENTLY NOT USED

key uility available from here is "string {0} rules".format("format")

 */

(function (global, undefined) {

    global = global || {}; // 'this' is null in the global ES5 space

    // System-wide string constants
    String.empty = "";
    String.space = " ";
    String.F = "function";
    String.U = "undefined";
    String.O = "object";
    String.S = "string";
    String.N = "number";
    String.NL = "\n";
    //@cc_onString.NL = "\r\n";
    String.T = "\t";
    String.R = "\r";

    var
    TOS = Object.prototype.toString,
    HOP = Object.prototype.hasOwnProperty,
    SLC = Array.prototype.slice,
    JON = Array.prototype.join,
    STT = window.setTimeout,
    CTT = window.clearTimeout;

    var STR_PAD_LEFT = 1, STR_PAD_RIGHT = 2, STR_PAD_BOTH = 3;

    function pad(str, opt) {

        if (!opt) return str;

        var len = opt.len || 0, pad = opt.pad || ' ', dir = opt.dir || STR_PAD_RIGHT;

        if (len < str.length) return str;

        switch (dir) {
            case STR_PAD_LEFT:
                {
                    return Array(len + 1 - str.length).join(pad) + str;
                }
            case STR_PAD_BOTH:
                {
                    var right = Math.ceil((padlen = len - str.length) / 2),
                        left = padlen - right;
                    return Array(left + 1).join(pad) + str + Array(right + 1).join(pad);
                }
            default: /* STR_PAD_RIGHT */
                {
                    return str + Array(len + 1 - str.length).join(pad);
                }
        }
    }


    if (String.F !== typeof "".minus)
        String.prototype.minus = function(what_) {
            ///<summary>
            /// "ABCBDBEB".minus("B"), returns : "ACDE"
            /// Argument is optional, and by default is one empty space
            /// So: "A B C".minus(), returns "ABC"
            /// argument can be an regular expression
            /// reg.exp. given does not require 'g' or 'm' modifier
            /// if argument is not found in the original, the original is returned
            ///</summary>
            return (this.split(what_ || String.space)).join(String.empty);
        }

    if (String.F !== typeof "".trim) {
        var Ltrim = /^\s+/, Rtrim = /\s+$/;
        // Verify that \s matches non-breaking spaces (IE fails on this test)
        if (!/\s/.test("\xA0")) {
            // due to the bug in IE where "\u00A0" is not covered by \s
            // we have to explicitly add it to the regexp
            Ltrim = /^[\s\xA0]+/;
            Rtrim = /[\s\xA0]+$/;
        }
        String.prototype.trim = function() {
            ///<summary>
            // String.trim() ES5
            ///</summary>
                return this.replace(Ltrim, String.empty).replace(Rtrim, String.empty);
            }
    }
    // String.trim() is *not* part of ES5. It is an Mozzila invention.
    if (String.F !== typeof String.trim) {
        String.trim = function(text) {
            return !text ? "" : String.prototype.trim.call(text.toString());
        }
    }
    if (String.F !== typeof "".reverse)
        String.prototype.reverse = function() {
            ///<summary>
            ///String.reverse() not in ECMA5
            ///</summary>
            return this.split(String.empty).reverse().join(String.empty);
        }
    if (String.F !== typeof "".lpad)
        String.prototype.lpad = function(max_, pad_char) {
            ///<summary>
            /// left-pad n, max_ times with the c character
            /// if user defined pad char is not given, single space is default
            ///</summary>
            return pad(this, { len: max_, pad: pad_char, dir: STR_PAD_LEFT });
        }
    if (String.F !== typeof "".rpad)
        String.prototype.rpad = function(max_, pad_char) {
            ///<summary>
            /// right-pad n, max_ times with the c character
            /// if user defined pad char is not given, single space is default
            ///</summary>
            return pad(this, { len: max_, pad: pad_char, dir: STR_PAD_RIGHT });
        }
    // center pad
    if (String.F !== typeof "".cpad)
        String.prototype.cpad = function(max_, pad_char) {
            ///<summary>
            /// center-pad n, max_ times with the c character
            /// if user defined pad char is not given, single space is default
            ///</summary>
            return pad(this, { len: max_, pad: pad_char, dir: STR_PAD_BOTH });
        }
    if (String.F !== typeof "".lcut)
        String.prototype.lcut = function(l, c) {
            ///<summary>
            /// cut from left to size l. pad on left if smaller
            ///</summary>
            return this.length < l ? this.lpad(l, c) : this.slice(this.length - l);
        }
    if (String.F !== typeof "".rcut)
        String.prototype.rcut = function(l, c) {
            ///<summary>
            ///cut from right to size l. pad on right if smaller
            ///</summary>
            return this.length < l ? this.rpad(l, c) : this.substr(0, l);
        }

    if (String.F !== typeof "".wrap)
        String.prototype.wrap = function(l, r) {
            ///<summary>
            ///Wrap with l-eft and r-ight.
            ///Both are optional.
            ///</summary>
            return (l || String.empty) + this + (r || String.empty);
        }

    if (String.F != typeof "".has)
        String.prototype.has = function(c) { 
    ///<summary>
    ///return true if char c found in this string
    ///signals only the first instance found
    ///</summary>
    return this.indexOf(c) > -1;
    };

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
    if (String.F != typeof "".format)
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/\{(\d|\d\d)\}/g, function ($0) {
                var idx = 1 * $0.match(/\d+/)[0]; return args[idx] !== undefined ? args[idx] : (args[idx] === "" ? "" : $0);
            }
     );
        };
    

})(this);
/* 'this' is null in the global ES5 space */
