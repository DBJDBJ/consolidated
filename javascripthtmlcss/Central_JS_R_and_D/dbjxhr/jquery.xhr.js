/**
 * jQuery.XHR
 * Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 8/7/2008
 *
 * @projectDescription Registry of XHR implementations
 *
 * @author Ariel Flesler
 * @version 1.0.0
 *
 * @meddler Dusan Jovanovic   $Revision: 1 $ $Date: 22/12/09 17:10 $
 * @version 2.0.
 *
 * changed 'transport' to 'proxy'
 * added method $.xhr.unregister( name )
 * added method $.xhr.reset() ;
 * added method $.xhr.toString() ;
 */
	;(function($) {

	    var as = $.ajaxSettings;

	    $.xhr = {
	        r: {
	            xhr: as.xhr // save the jQ default xhr() as r["xhr"]
	        },
	        // reveal to caller all the registered xhr's
	        toString : function () { var A = []; for( var j in this.r ) A.push(j); return "" + A; },
	        // User defined xhr provider function will receive one argument
	        // which is $.ajaxSettings object
	        // First : jQuery.xhr.register( 'my_xhr', my_xhr_func )
	        register: function(name, fn) {
	            this.r[name] = fn;
	        },
	        unregister: function(name) {
	            if (this.r[name]) {
	                delete this.r[name];
	            }
	            // to reset() is not good here because one can register
	            // several user defined xhr's
	        },
	        reset: function() { as.proxy = 'xhr'; }
	    };

	    // Second: to set the registered XHR one as default,
	    // use $.ajaxSetup({ proxy:'my_xhr' })
	    // by default we name it 'xhr' so that the jQuery inbuilt 
	    // is called for by default
	    as.proxy = 'xhr';
	    // This handler is used instead, don't override it
	    as.xhr = function() {
	        // grown-up computing
	        if (!$.xhr.r[this.proxy])
	            throw new Error(0xFFFF, "ERROR from $.xhr plugin: Trying to use XHR, by name: " + this.proxy + ", which is not registered");
	        // user defined xhr provider function will receive one argument
	        // which is $.ajaxSettings object a.k.a. 'this' in this method 
	        return $.xhr.r[this.proxy](this);
	    };

	})(jQuery);
