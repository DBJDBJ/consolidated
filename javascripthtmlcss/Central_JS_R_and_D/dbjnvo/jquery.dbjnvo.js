/// <reference path="../jq132-vsdoc.js" />
/*
 OP-NVO 1.0.0 (jQuery dbj plugin)

 NVO = Name Value Operations

 INTENT : 
 1 :: shorthands for operating on numerical values of attributes or css properties
 2 :: introduction of DOM Atrr object to be used for both attributes and css properties
      also to allow for jQuery usage chaining which is not possible with current (1.3.2)
      methods attr( name ) and css ( name ), which do not return jQuery instance
 
 Copyright (c) 2009 Dusan Jovanovic ( http://dbj.org ) 
 
 Licensed under the MIT license:
   http://www.opensource.org/licenses/mit-license.php

***********************************************************************************   
 API:
 
 Attributes and CSS properties logically share the same interface.
 To represent it this plugin uses DOM Attr object implementation.
 Without  methods it inherits from its parrents in the spec.
 
--------------
Object :: Attr (http://www.w3.org/TR/DOM-Level-2-Core/ecma-script-binding.html)
--------------
Attr has the all the properties and methods of the Node object as well as the properties 
and methods defined below.

The Attr object has the following properties:

name() :: This read-only property is of type String.

specified() :: This read-only property is of type Boolean.

value() :: This property is of type String and can raise a DOMException object on setting.

ownerElement() :: This read-only property is a Element object. Made into method for this plugin

owner()        :: Added for this plugin. A method which returns jQuery instance
                  handling the ownerElement. Through this method we can chain 
                  next jQuery method
--------------
All this are properties in the W3C DOM spec. Here they are methods.                  
This is the base object used by this plugin. Two objects inheriting are:

Attribute   :: represents the Attribute, inherits from Attr
CssProp   :: Css property object, inhertis from Attr

Beside properties inheriting from a parent Attr Object, these two objects exhibit 
methods for operating on the numeric value they represent. If value is not numeric
jQuery will throw an exception as defined in its documentation.

Currently inteface methods of both Attribute and CssProp are :

inc ( new_value ) :: current_value = current_value + new_value
dec ( new_value ) :: current_value = current_value - new_value
mul ( new_value ) :: current_value = current_value * new_value
div ( new_value ) :: current_value = current_value / new_value
mod ( new_value ) :: current_value = current_value % new_value

In all methods if new_value is not given it is defaulted to 1

--------------
These two objects are returned by plugin, with two methods:
 
    $(some_element).csso("top")  :: Returns CssProp object

    $(some_element).atto("data")  :: Returns Attribute object
--------------

    Users  may use implementation methods directly.
    Above is the OO facade. Bellow is the implementation exposed.
    
	$(some_element).nvopp(name, num_value, operation, use_attr)
	 
	the core method. applies operation on the num_value of the css property
	or attr value of 'some_element' handled by jQuery. If use_attr is present
	operation will be applies on the attribute otherwise and default, 
	is CSS property.
	
	Currentl (V 1.0) methods availabel are:
	For all methods bellow num_value will default to 1 if not given.
	Default behavior is to use CSS properties, unless use_att is given.
	
	$(some_element).inc(name, new_value, use_att); // current_value = current_value + new_value
	$(some_element).dec(name, new_value, use_att); // current_value = current_value - new_value
	$(some_element).mul(name, new_value, use_att); // current_value = current_value * new_value
	$(some_element).div(name, new_value, use_att); // current_value = current_value / new_value
	$(some_element).mod(name, new_value, use_att); // current_value = current_value % new_value
*/

	(function() {

	    // ---------------------------------------------------------------------------------------------------------------
	    var OP = { toString: function() { return "OPerators and utilities for nvopp"; } };

	    OP.check = function(args) {
	    }
	    // here add checks !!
	    OP.inc = function(a, b) { return a + b; }
	    OP.dec = function(a, b) { return a - b; }
	    OP.mul = function(a, b) { return a * b; }
	    OP.div = function(a, b) { return a / b; }
	    OP.mod = function(a, b) { return a % b; }
	    // create a value/unit pair from current attr value
	    // css '#' hex values are transformed to '0x' hex values 
	    // and then to integers
	    OP.vu = function(s_, v, u) {
	        if (isNaN(parseFloat(s_))) {
	            v = 1 * s_.replace("#", "0x"); u = "";
	        }
	        else {
	            v = parseFloat(s_);
	            s_ = ("" + s_).match(/\D+$/i);
	            u = (s_ != null ? s_[0] : "");
	        }

	        if (isNaN(v)) v = s_; // revert to original
	        return { val: v, unit: u };
	    }

	    // ------------------------------------------------------------------------------------------------------------------
	    // Name Value Opperation
	    // element has to be jQ instance
	    jQuery.nvopp = function(JQ, name, new_value, operation, is_attr) {

	        // var JQ = jQuery(element);
	        var vup = null, x;
	        var label = is_attr ? "attribute" : "css property";

	        try {
	            vup = OP.vu(is_attr ? JQ.attr(name) : JQ.css(name));
	        } catch (x) {
	            throw new Error(0xFF, "[DBJNVO ERROR: " + label + ", by name " + name + ", not found on this element]");
	        }

	        try {
	            if (is_attr)
	                return JQ.attr(name, operation(vup.val, new_value) + vup.unit);
	            else
	                return JQ.css(name, operation(vup.val, new_value) + vup.unit);
	        } catch (x) {
	            throw new Error(0xFF, "[DBJNVO ERROR: Can not apply " + operation + ", on: " + label +
	                            " '" + name + "', with current value: '" + vup.val + vup.unit +
	                            "', using new value: '" + new_value + "']");
	        }
	    }

	    // ------------------------------------------------------------------------------------------------------------------
	    // NV -- Name Value pair
	    function NV(jq_host, prop_name) {

	        if (!jq_host) throw new Error(0xFF, "[DBJNVO: Name Value Object must be constructed with valid jQuery host ]");
	        if (!prop_name) throw new Error(0xFF, "[DBJNVO: Name Value Object must be constructed with valid attribute or css property name ]");

	        var $host_ = jq_host;
	        var prop_name_ = prop_name;
	        this.toString = function() { return "NV"; }
	        // interface and implementation
	        // Attr W3C spec
	        this.name = function() { return prop_name_; }
	        this.specified = function() { return true; /* as we can't have this without host existence */ }
	        /* return the actual DOM object not the jQuery handler */
	        this.ownerElement = function() { return $host_[0]; }
	        // Added for this plugin. A method which returns jQuery instance
	        // handling the ownerElement. Through this method we can chain next jQuery method
	        this.owner = function() { return $host_; }
	        //
	        // OPERATIONS BEGIN HERE
	        //
	        // increment a numerical value of the current attr value
	        this.inc = function(num_value, use_att) {
	            num_value = num_value ? parseFloat(num_value) : 1;
	            return jQuery.nvopp(this.owner(), this.name(), num_value, OP.inc, use_att);
	        }
	        // decrement a numerical value of the current attr value
	        this.dec = function(num_value, use_att) {
	            num_value = num_value ? parseFloat(num_value) : 1;
	            return jQuery.nvopp(this.owner(), this.name(), num_value, OP.dec, use_att);
	        }
	        // decrement a numerical value of the current attr value
	        this.mul = function(num_value, use_att) {
	            num_value = num_value ? parseFloat(num_value) : 1;
	            return jQuery.nvopp(this.owner(), this.name(), num_value, OP.mul, use_att);
	        }
	        // decrement a numerical value of the current attr value
	        this.div = function(num_value, use_att) {
	            num_value = num_value ? parseFloat(num_value) : 1;
	            return jQuery.nvopp(this.owner(), this.name(), num_value, OP.div, use_att);
	        }
	        // decrement a numerical value of the current attr value
	        this.mod = function(num_value, use_att) {
	            num_value = num_value ? parseFloat(num_value) : 1;
	            return jQuery.nvopp(this.owner(), this.name(), num_value, OP.mod, use_att);
	        }
	        // ------------------------------------------------------------------------------------------------------------------
	    } // eof NV object
	    // ------------------------------------------------------------------------------------------------------------------
	    function Attribute(jq_host, prop_name) {
	        Attribute.prototype = new NV(jq_host, prop_name);
	        this.toString = function() { return "Attribute"; }
	        this.value = function() { return this.owner().attr(this.name()); }
	        this.inc = function(new_value) { Attribute.prototype.inc(new_value, true); return this; }
	        this.dec = function(new_value) { Attribute.prototype.dec(new_value, true); return this; }
	        this.mul = function(new_value) { Attribute.prototype.mul(new_value, true); return this; }
	        this.div = function(new_value) { Attribute.prototype.div(new_value, true); return this; }
	        this.mod = function(new_value) { Attribute.prototype.mod(new_value, true); return this; }
	    }
	    function CssProp(jq_host, prop_name) {
	        CssProp.prototype = new NV(jq_host, prop_name);
	        this.toString = function() { return "CssProp"; }
	        this.value = function() { return this.owner().css(this.name()); }
	        this.inc = function(new_value) { CssProp.prototype.inc(new_value); return this; }
	        this.dec = function(new_value) { CssProp.prototype.dec(new_value); return this; }
	        this.mul = function(new_value) {
	            CssProp.prototype.mul(new_value);
	            return this;
	        }
	        this.div = function(new_value) { CssProp.prototype.div(new_value); return this; }
	        this.mod = function(new_value) { CssProp.prototype.mod(new_value); return this; }
	    }
	    // ------------------------------------------------------------------------------------------------------------------	    
	    // Attribute and CssProp are returned by plugin, with two methods here :
	    jQuery.fn.extend({
	        // $(some_element).csso("top")  :: Returns CssProp object
	        csso: function(css_property_name) {
	            if (this.length < 1) throw new Error(0xFF, "csso() can not operate on empty selection");
	            return new CssProp(this, css_property_name);
	        },
	        //  $(some_element).atto("data")  :: Returns Attribute object
	        atto: function(attribute_name) {
	        if (this.length < 1) throw new Error(0xFF, "atto() can not operate on empty selection");
	        return new Attribute(this, attribute_name);
	        }
	    });

	    // ------------------------------------------------------------------------------------------------------------------
	    // Example of a simple custom selector. To prove that name value pair exists on the element
	    // and to help selecting them all with one filter
	    // E.g.: $("*:nv('position')") -- select all elements that have css property or attribute named 'position'
	    /*
	    jQuery.expr[':']["nv"] = function(
                                objNode,
                                intStackIndex,
                                arrProperties,
                                arrNodeStack
                            ) {
	        var arg = eval("(['" + arrProperties[3] + "'])");

	        var jThis = jQuery(objNode);

	        if ((jThis.css(arg[0])) || (jThis.attr(arg[0])))
	            return true;
	        return (false);
	    }
        */
	    // ------------------------------------------------------------------------------------------------------------------	    
	    // eof 	'(function() {' enclosure
	})();


// ------------------------------------------------------------------------------------------------------------------	    
/// <reference path="jquery.dbjnvo.js" />