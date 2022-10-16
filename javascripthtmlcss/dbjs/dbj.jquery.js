/// DBJS(tm) jQuery(tm) plug-ins
/// GPL (c) 2010 by DBJ.ORG(tm)
/// $Revision: 2 $$Date: 10/02/10 2:05 $
/*
 Each dbj jquery plugin is to be declared in the "dbj" plugin "namespace" :
 $.NS("dbj" { p1 : function (){}, p2 : function () {} }) ; // etc ...
 And then latter called like this :
 $.dbj("p1", a1,a2 ) // a1 and a2 are arguments for plugin dbj.p1
 */
(function($, window, dbj, undefined) {

    $.NS = function(ns, functions)
    ///<summary>
    /// This is seen elsewhere on the net. An little namespace mechanism. Example:
    /// You create your plugin inside your namespace like this:
    /// $.NS("Z", { x: function() { return "jQuery:" + this.jquery + ", from X"; } });
    /// above creates or uses namespace 'Z'. and adds a plugin 'x' to it
    /// you call it like this, (with arguments or not) :
    /// $().Z("x",1,2,3)
    ///</summary>
    {
        $.fn[ns] = $.fn[ns] || function(cb) {
            cb = $.fn[ns][cb || ""];
            var retval;
            if ("function" !== typeof cb) {
                dbj.konsole.terror("$()." + ns + "() requires callaback or its name as first argument");
            }
            try {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                retval = cb.apply(this, args);
            } catch (x) {
                dbj.konsole.terror("Error in $()." + ns + "() plugin: " + x.message);
            }
            return retval || this;
        };

        for (var fn in functions)
            $.fn[ns][fn] = functions[fn];
    };

})(jQuery, window, dbj );

(function($, dbj) {
    var window = this, undefined;
    $.strict = $.strict || true;
    ///<summary>
    /// We use jQuery.strict to enforce proper jQuery usage
    /// if this global is true many rules are enforced and
    /// some plugins do work better. And some do not work at all.
    ///</summary>
    

    $.extend({ scope: function(selector, context) {
        ///<summary>
        ///$.scope( selector, dom_object )   // OK
        ///Every other $.scope() call format throws Error(0xFF).
        ///NOTE: http: //brandonaaron.net/blog/2009/06/24/understanding-the-context-in-jquery
        ///</summary>
        ///<argument name="selector" type="string">
        ///Standard jQuery selector
        ///</argument>
        ///<argument name="context" type="object">
        ///Must be given, and must be a legal dom node.
        ///</argument>
        if (!context)
            throw new Error(0xFF, ':STRICT ERROR: Scope Context is missing. Provide an element or element id.');
        if (context == document || context == document.body)
            throw new Error(0xFF, ':STRICT ERROR: Scope Context can not be an document or document.body.');
        if (context.jquery)
            throw new Error(0xFF, ':STRICT ERROR: Scope Context can not be a jQuery instance.');
        if (context.nodeType === undefined)
            throw new Error(0xFF, ':STRICT ERROR: Scope Context must be a dom node.');
        if (context.nodeType !== 1 && context.nodeType !== 9)
        // 1 == element
        // 9 == xml doc object
            throw new Error(0xFF, ':STRICT ERROR: Scope Context passed is neither an element(type:1) or xml doc object(type:9).');

        return jQuery(context).find(selector);
    }
});
     $.NS("dbj", { noSelect: function(p) {
        /// <summary>
        /// Example: $("button:first").noSelect()
        /// Make elements unselectable.
        ///</summary>
        ///<argument name="p" type="boolean">
        /// true or non-existent.
        /// Or flase to switch back to selectable.
        ///</argument>
        var prevent = p || true ? true : false, $jq = this;
        if (prevent) {
            return $jq.each(function() {
                if ($.browser.msie || $.browser.safari) $jq.bind('selectstart', function() { return false; });
                else if ($.browser.mozilla) {
                    $jq.css('MozUserSelect', 'none');
                    $('body').trigger('focus');
                }
                else if ($.browser.opera) $(this).bind('mousedown', function() { return false; });
                else $jq.attr('unselectable', 'on');
            });
        } else {
            return this.each(function() {
                if ($.browser.msie || $.browser.safari) $jq.unbind('selectstart');
                else if ($.browser.mozilla) $jq.css('MozUserSelect', 'inherit');
                else if ($.browser.opera) $jq.unbind('mousedown');
                else $jq.removeAttr('unselectable', 'on');
            });
        }
    } //end noSelect
    });


// ------------------------------------------------------------------------------------------------------------------
// test the equality of two jQ instances.
// strict logic is that comparing references they hold is NOT logical, and it is slow.
// better approach is to compare just the initial selections
// BTW: the strictest would be to put a ban on this kind of extensions.
//
$.NS("dbj", {
    equals: jQuery.strict ? function(compareTo) { // strict logic == fast code
        return ((this.selector == compareTo.selector) &&
                              (this.context == compareTo.context));
    }
                          : function(compareTo) {// no logic == slow code
                              if (!compareTo || !compareTo.length || this.length != compareTo.length)
                                  return false;
                              for (var i = 0; i < this.length; i++) {
                                  if (this[i] !== compareTo[i])
                                      return false;
                              }
                              return true;
                          }
});
// ------------------------------------------------------------------------------------------------------------------
$.NS("dbj", { flush: function()
/// <summary>
/// $().dbj("flush") re-makes the current element stack inside $() 
/// thus flushing-out the non-referenced elements
/// left inside after numerous remove's, append's etc ...
/// </summary>
{ return jQuery(this.context).find(this.selector); }
});
// ------------------------------------------------------------------------------------------------------------------
$.NS("dbj", { outer: function() {
    /// <summary>
    /// return outerHTML, for the whole current selection set
    /// flush() before clone() to avoid 'leaks'
    /// </summary>
    return $($('<div></div>').html(this.dbj("flush").clone())).html();
}
});

// ------------------------------------------------------------------------------------------------------------------
$.NS("dbj", { unbindall: function() {
    /// <summary>
    /// http: //townx.org/blog/elliot/memory-leaks-and-jquery
    /// </summary>
    return $('*').unbind(); 
}
});

$(document).unload(function() { $().dbj("unbindall"); });
// hopefully no try/catch is required for the above ? DBJ 2009 SEP 04

// ------------------------------------------------------------------------------------------------------------------
})(jQuery, dbj);
// ------------------------------------------------------------------------------------------------------------------
(function($, dbj, window, undefined) {
    dbj.color = { toString: function() { return "DBJ*Color library" } };

    function v2h(value) {
        value = parseInt(value).toString(16);
        return value.length < 2 ? value + "0" : value;
    }
    dbj.color.rgb2hex = function(rgb) {
        if (rgb.match(/^rgb/) == null) return rgb;
        var arr = rgb.match(/\d+/g);
        return "#" + v2h(arr[0]) + v2h(arr[1]) + v2h(arr[2]);
    }

    // none of the following is safe to script before DOM is ready
    // we use the button, since it has createTextRange() method, which we need in IE
    // for various color computations
    var btn_ = null;
    function btn() {
        if (btn_ == null) {
            btn_ = document.createElement("button");
            btn_.id = "dbjs_private_" + (new Date()).getTime();
            if (dbj.browser.support.css_on_newborns === false)
                document.getElementsByTagName("head")[0].appendChild(btn_);
            // for browser who do not allow CSS on new and detached elements
            // we attach to head, which should not provoke document re-flow
        }
        return btn_;
    }
    // Convert any *valid* colour value (rgb, named colours, etc) 
    // to the hex equivalent
    dbj.color.toHex = window.getComputedStyle ? function(color) {
        // For browsers who support it, we use getComputedStyle() 
        btn().style.color = color;
        return retval = dbj.color.rgb2hex(
           window.getComputedStyle(btn(), null).getPropertyValue("color")
           );
    }
    : function(color) {
        // for IE we use queryCommandValue()
        // http://www.geoffchappell.com/viewer.htm?doc=studies/windows/ie/mshtml/methods/basemso/querycommandvalue.htm
        btn().style.color = color;
        var value = btn().createTextRange().queryCommandValue("ForeColor");
        value = ((value & 0x0000ff) << 16) | (value & 0x00ff00) | ((value & 0xff0000) >>> 16);
        value = value.toString(16);
        return "#000000".slice(0, 7 - value.length) + value;
    };

    // expose as jQ plugin
    $.NS("dbj", { color: dbj.color.toHex });
    // usage: $.dbj("color", "red" )

})(jQuery, dbj, window);
// ------------------------------------------------------------------------------------------------------------------
