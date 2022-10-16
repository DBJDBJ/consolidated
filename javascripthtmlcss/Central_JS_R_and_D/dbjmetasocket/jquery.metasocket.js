/*
 METASOCKET $Revision: 5 $ (jQuery dbj plugin)

 INTENT : Socket of sockets. "Plugs" slot into the "socket". 
          INTENT: Provide simple extension to act as a socket for
          small and simple but usefull and reusable plugs that will operate
          on jQuery result set. Also if ubiquotusly used, this jQuery plugin 
          will lower the number of  plugins. 90% of plugins are very small and 
          simple. But they "polute" the jQuery name space. 
 
 Copyright (c) 2010 Dusan Jovanovic ( http://dbj.org ) 
 
 Licensed under the MIT license:
   http://www.opensource.org/licenses/mit-license.php

***********************************************************************************   
 API:
 
    ( Terminology : nvo := Name Value Object, attribute or css style property object. )
 
    $( selector, context ).S( plug ) ;  // S is for Socket
        
    plug    := function ( load ) { return [ true | false ] ; } 
                   called once for each element from a result set. 'this' is the element.
                   must return true or false. it true, the values changed inside a plugin
                   will be saved 'back' to the host element.
    load    := objectified and parsed representation of the 
                   name/value objects (attributes and style properties),
                   harvested from a selector, and it also 
                   contains their current values,
                   harvested from the dom. 
    
    Example:
 
    $("[status][~top!=auto]",".person").S( function( load ) {
                load.status = "incremented top for 50 units"  ;
                load.top += 50 ;
                return true ; 
                // true signals to the meta socket, to 
                // take the value from the load and to 
                // change them on the originating objects
    } ) ;
    
    Above selector (in english) means :
    SELECT every element of a class '.person' WHERE attribute 'status' exists and style.top is not 'auto'
    Then "Meta Socket",for every element selected
    uses a 'plug' function given to S(), to operate on the attribute and style propertyes 
    harvested by the jQuery host instance selector.
    
    REMEMBER: After plugin returns true, attribute or style property, value changes 
    are changed on the host element.
    
    Every "plug" receives a "load" argument , which is an object that contains,
    as its properties name/value pairs of attributs and css properties as mentioned
    in the jQuery selector. Load structure and format is this:
    
    load := {
                   // array where each n.v.obj from the selector string is parsed and stored
                   // by it's name
                   nvo :  [
                   "nvo_name" = {
                     parsed : { // parsed selector of only this nvo
                               prefix: "or '' if not used" ,
                               name : "of the nvo" ,
                               operator : "'' if not used",
                               operand  : "'' if not used"
                               } ,
                    value : "of this nvo",
                    unit  : "px,em,% etc, or '' if not used"  ,
                    // take the value of the parsed nvo for element given
                    set4  :  function (element ) ,
                    // map back to element given the current value
                    map2  :  function (element ) 
                   } 
                   ] ,
                   // 
                   select  : "the jQ selector part, left of the first '['" ,
                   where   : "the WHERE part of the selector",
                   cache   : "small cache to pass data between plugs of the same instance of jQ",
                   version : "DBJ*MEtasocket V:13"
                }

Example :

(Terminology : <space> := a single space)

For this call : $("[status][~top!=auto]",".person"), $.selector := ".person<space>[status][~top!=auto]"

load :=  {
                status : {
                   parsed : { prefix: '', name: 'status', operator: '', operand: '' } ,
                   value  : 'done' , unit   : '' 
                },
                top : {
                   parsed : { prefix: "~", name: 'top', operator: '!=', operand: 'auto' } ,
                   value  : '100' ,unit   : 'px' 
                },
                select : ".person<space>" ,
                where  : "[status][~top!=auto]"
                cache  : // cache object
                   { put: function ( object_to_put ) {} , get : function (key) {} , jq: <current jq instance > }
                version : "the version id"   
             }
*/

// ------------------------------------------------------------------------------------------------------------------
// jQuery METASOCKET plugin
(function() {

    var NS = ""; // Null String
    //
    // little cache based on Object uid() method
    //
    function small_and_simple_cache(jq_instance) {
        var cache_ = [];
        var uid = function() {
            var delimiter = "-", tid;
            var suffix = function() { return (new Date()).getTime(); }
            var prefix = function() { return "dbj"; }
            return prefix() + delimiter +
                (tid = setTimeout(function() { clearTimeout(tid) }, 0)) + delimiter +
                suffix();
        }
        this.put = function(key, obj) {
            key = (!key ? uid() : key); cache_[key] = obj; return key;
        }
        this.get = function(key, x) {
            try { return cache_[key]; } catch (x) { return null; }
        }
        // made by this jq instance
        this.jq = jq_instance;
    }
    // example: for "10px" return { val : "10", unit: "px" }
    function css2vu(s_, v, u) {
        if (isNaN(parseFloat(s_))) {
            v = s_; u = "";
        }
        else {
            v = parseFloat(s_);
            s_ = ("" + s_).match(/\D+$/i);
            u = (s_ != null ? s_[0] : NS);
        }
        return { 'val': v, 'unit': u };
    }
    //
    // here are the prefixes we catter for and functions getting/setting the values for
    // kind of a property defined by the prefix in a selector
    // NOTE: these are the prefixes that Balazs Advanced Selector can handle
    //       without such a plugin we can parse only attributes ...
    //
    var prefix2SETvalue = {
        '': function(e, name, val) { jQuery.attr(e, name, val); },
        ':': function(e, name, val) { jQuery.data(eval, name, val); },
        '~': function(e, name, val) { jQuery.attr(e.style, name, val); },
        '&': function(e, name, val) { jQuery.data(e, 'events', val); },
        '::': function(e, name, val) { jQuery.data(e, 'metadata', val); }
    }
    // always return {'val' : value, 'unit' : unit }
    // get the unit if style.property is used
    // otherwise it is empty string
    var prefix2GETvalue = {
        '': function(e, val) { return { 'val': e[val] || jQuery.attr(e, val), 'unit': NS }; },
        ':': function(e, val) { return { 'val': jQuery.data(e, val), 'unit': NS }; },
        '~': function(e, val) { return css2vu(jQuery.curCSS(e, val)); },
        '&': function(e, val) { var d = jQuery.data(e, 'events'); return { 'val': d && d[val], 'unit': NS }; },
        '::': function(e, val) { var d = jQuery.data(e, 'metadata'); return { 'val': d && d[val], 'unit': NS }; }
    }
    //
    var EX = /\[\s*(\W*(?:[\w\u00c0-\uFFFF_-]|\.|\\.)+)\s*(?:(\S?[=<>])\s*(['"]*)(.*?)\3|)\s*\](?![^\[]*\])(?![^\(]*\))/;
    var RX = /\[(.+)\]/ig;
    //
    // make single NVObject
    // value and unit are populated when needed ...
    function parse_name_value_object(last_match) {
        var match = EX.exec(last_match), nme = match[1], pfx = nme.match(/(^\W+)(.*)/);
        var name = nme.match(/\w+/)[0],
                prefix = (pfx ? pfx[1] : ""),
                operator = match[2],
                operand = match[4];

        return { "parsed": {
            "prefix": prefix, "name": name, "operator": operator, "operand": operand
        },
            "value": "", "unit": "",
            // populate for the current element
            "set4": function(current_element) {
                var geter = prefix2GETvalue[this['parsed']['prefix']];
                var vu = geter(current_element, this['parsed']['name']);
                this["value"] = vu.val || "";
                this["unit"] = vu.unit || "";
                    return this["value"] + this["unit"];
            } ,
            // map to current element
            "map2": function(current_element) {
            var seter = prefix2SETvalue[this['parsed']['prefix']];
                seter(current_element, this['parsed']['name'], this['value'] + this['unit']);
            }
        };
    }
    /// <summary>
    /// make Packet structure "lloking into" selector in jQuery
    /// use cases :
    /// $('[name]','#mydiv' ) will produce one NVO for the attribute 'name' on the element 'mydiv'
    /// $('[name][status]','#mydiv' ) will produce two NVO's for the attributes 'name' and 'status', on the element 'mydiv'
    /// $('#mydiv', '#toolbar') will produce no NVO's
    /// </summary>
    function parse_selector(selector) {
        var nvo = null, rez = {
            "nvo": {}, // store nvo's harvested. 
            "select": selector.split("[")[0],
            "where": (null == selector.match(/\[.+\]/) ? "" : selector.match(/\[.+\]/)[0]),
            // "length": 0,
            "let": function(name, value) {
                // set or get = let
                var kv = this.nvo[name];
                if (undefined === kv) throw "There is no name: " + name + ", in the current Packet";
                if (!!value) kv["value"] = value;
                return kv["value"] + kv["unit"];
            }
        };
        while (EX.test(selector)) {
            selector = RegExp.rightContext;
            nvo = parse_name_value_object(RegExp.lastMatch); // parse the next nvo found
            rez["nvo"][nvo["parsed"]["name"]] = nvo;               // add it as a property named as nvo itself
        }
        return rez;
    } // eof parse_selector()
    //------------------------------------------------------------------------------------------------------
    jQuery.fn.extend({

        //S is for Socket
        S: function(plug_method) {

            if (!plug_method || ("function" != typeof plug_method)) throw new Error(0xFF, "$(" + this.selector + "," + this.context + ").S(plug), no plug given.");
            if (this.length < 1) throw new Error(0xFF, "$('" + this.selector + "'," + this.context + ").S() can not operate on empty jQuery");

            // we need to make objectified selector structure ( but only once! )
            if (!this.objectified_selector_) {
                this.objectified_selector_ = parse_selector(this.selector);
                // for plugs to pass data to each other
                this.objectified_selector_["cache"] = new small_and_simple_cache(this);
            }
            // now we have: this.objectified_selector_ 
            var OS = this.objectified_selector_; // just a short name

            jQuery.each(this, function(idx, current_element) {
                // We have to populate values and units inside objectified selector
                // for each element in the current jQ result set
                jQuery.each(OS.nvo, function(j, kv) {
                    kv.set4(current_element);
                }); // each()
                // now call the plug method given by user
                // giving to it the current element as a context
                if (true === plug_method.call(current_element, OS)) {
                    // map the changes made by plug_method(), back to the current element 
                    jQuery.each(OS.nvo, function(k, kv) {
                        kv.map2(current_element);
                    }); // each()
                }; // eof result set loop
            });
            return this; // jQ instance
        }
    });
    //
    jQuery.extend({ "S": { "version": "DBJ*MetaSocket (c) 2009-2010 by DBJ.ORG $Revision: 5 $"} });
    //
})() // eof anonimous function enclosure
// ------------------------------------------------------------------------------------------------------------------	    
/// <reference path="jquery.transformers.js" />