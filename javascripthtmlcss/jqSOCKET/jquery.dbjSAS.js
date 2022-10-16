/*!
    Enhanced attribute selectors for Sizzle/jQuery
    Version: 1.0.1
    Copyright (c) 2009 Balazs Endresz (BE) (balazs.endresz@gmail.com)
    Released under the MIT, BSD, and GPL Licenses.
 
    2010-04-21 Balazs fixed for jQuery (Sizzle) 1.4.2

    Version 2.0.0
    Copyright (c) 2013 DBJ.ORG 
    Released under the MIT, BSD, and GPL Licenses.
    Works with jQuery 1.9.1 or better

    Extended attribute selection syntax:

    for data -- "[:name  operator value]"
    for css  -- "[~name  operator value]"
    for prop -- "[::name operator value]"

    If extended attr syntax is used four new operators can also be applied: 
    >, <, <=, >=
    in which case,before comparison, parseFloat() is applied to value obtained.
    Example:
    $("div[id][~bottom>=10]").css("bottom");
    Above will select any div element that has a 'id' attribute and css bottom property
    bigger or equal to "10px" or "10%" or any other number/unit combination stored in css style.
    NOTE: if value or check value can not be parsed into float (NaN situation) they will NOT 
          be compared and the result will be false. So think of that.

           $("p[~top > auto]") // makes no sense and result is false

    NOTE: This extensions provide more functionality. More functionality is less speed.
*/

(function(Sizzle) {

    var Expr = Sizzle.selectors;

    /* 2012 MAR 03 DBJ moved here */
    Expr.attrPrefix = {
        ':': function (e, val) { return $(e).data(val); },
        /* Mar-2013 DBJ replaced curCSS() with css() */
        '~': function (e, val) { return $.css(e, val); },
        /*  
        2013 APR 7 DBJ removed, 
        'event' attribute is not maintained anymore by jQ
        '&': function (e, val) { var d = $.data(e, 'events'); return d && d[val]; },

           2013 APR 7 DBJ removed
           'metadata' attribute is no longer maintained by jQ
        '::': function (e, val) { var d = $.data(e, 'metadata'); return d && d[val]; }

           2013 APR 7 DBJ added prop() handling
         */
        '::': function (e, val) { return $(e).prop(val); }
    };

    /* 2013 MAR 03 this has to stay even for jQ 1.9.1+
       otherwise attr prefixes above will not be handled
    */
    Expr.match.ATTR = /\[\s*(\W*(?:[\w\u00c0-\uFFFF_-]|\.|\\.)+)\s*(?:(\S?[=<>])\s*(['"]*)(.*?)\3|)\s*\](?![^\[]*\])(?![^\(]*\))/;
    //inserted:              \W*                      |\.                 [ <>]                         lookahead appended later

    /* 2013 Mar 03 DBJ */
    if (! Expr.leftMatch) Expr.leftMatch = {} ;

        /* 2010-04-21 Balazs fix for jQuery (Sizzle) 1.4.2 */
        Expr.leftMatch.ATTR = new RegExp(/(^(?:.|\r|\n)*?)/.source +
        Expr.match.ATTR.source.replace(/\\(\d+)/g, function (all, num) { return "\\" + (num - 0 + 1); }));
        
    /* 
    2012 MAR 04: DBJ
    This was the BE version that worketh with jq 1.4.x

    2013 MAR DBJ 
    this was the footprint: var BE_ATTR = function(elem, match) {}
    changed footprint to this version  
    */
        var BE_ATTR = function(prefix, elem, name_, operator_, check_ ) 
        {
        var name = name_,
		result,
		value,
		type = operator_ ,
		check = check_ 
        /* DBJ removed , prefix = name.match(/(^\W+)(.*)/) */ ;

            /* DBJ removed
        if (prefix !== null) {
            for (var i in Expr.attrPrefix)
                if (i === prefix[1].trim()) {
                result = Expr.attrPrefix[i](elem, prefix[2]);
                break;
            }
        } else
            result = Expr.attrHandle[name] ?
			Expr.attrHandle[name](elem) :
			elem[name] != null ?
				elem[name] :
				elem.getAttribute(name);
            */        
        result = Expr.attrPrefix[prefix](elem, name);

        value = result + "";

        var ret = result == null ?
		type === "!=" :
		type === "=" ?
		value === check :
		type === "*=" ?
		value.indexOf(check) >= 0 :
		type === "~=" ?
		(" " + value + " ").indexOf(check) >= 0 :
		!check ?
		result === 0 || result :
		type === "!=" ?
		value != check :
		type === "^=" ?
		value.indexOf(check) === 0 :
		type === "$=" ?
		value.substr(value.length - check.length) === check :
		type === "|=" ?
		value === check || value.substr(0, check.length + 1) === check + "-" :
		type === "/=" ?
		new RegExp(check).test(value) :
		false;

        if (ret || type && type.match(/<|>/) === null) return ret;

        var newValue = parseFloat(value), newCheck = parseFloat(check);
            /* 2013 APR 07 DBJ Removed
        value = isNaN(newValue) ? value : newValue;
        check = isNaN(newCheck) ? check : newCheck;

            DBJ Added instead
        */
        if ( isNaN(newValue) && isNaN(newCheck)) return false ;

        return type === "<" ? value < check :
		type === ">" ? value > check :
		type === "<=" ? value <= check :
		type === ">=" ? value >= check :
		false;
        } /* eof BE_ATTR */

    var sizzle_ATTR = Expr.filter.ATTR,
        rx_attr_prefix = /(^\W+)(.*)/ ;

    Expr.filter.ATTR = function (name, operator, check) {
        /* 2013 MAR 06 DBJ: if there is a BE prefix use BE ATTR() */
        var name_match = name.trim().match(rx_attr_prefix),
            pfx = name_match && name_match[1] ? name_match[1].trim() : null ,
            just_name = pfx && name_match[2] ? name_match[2].trim() : null;

        if (pfx && !just_name) 
            return false;
        /* although it appears to be imposible (since it is a syntax error) this
           measure handles yes prefix, no name situation, eg. [~ 10px] */

        if (pfx in Expr.attrPrefix) 
            return function (elem) {
                return BE_ATTR(pfx, elem, just_name  , operator, check);
            }
        /* else */
        return sizzle_ATTR(name, operator, check);
    }

})((jQuery && jQuery.find) || Sizzle);

/* 
*/