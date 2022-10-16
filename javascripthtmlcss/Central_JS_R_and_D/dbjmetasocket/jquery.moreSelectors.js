/*!
* Enhanced attribute selectors for Sizzle/jQuery
* Version: 1.0.1
* Copyright (c) 2009 Balazs Endresz (balazs.endresz@gmail.com)
* Released under the MIT, BSD, and GPL Licenses.

 2010-04-21 Balazs fix for jQuery (Sizzle) 1.4.2

*/

(function(Sizzle) {

    var Expr = Sizzle.selectors;

    Expr.attrPrefix = {};

    Expr.match.ATTR = /\[\s*(\W*(?:[\w\u00c0-\uFFFF_-]|\.|\\.)+)\s*(?:(\S?[=<>])\s*(['"]*)(.*?)\3|)\s*\](?![^\[]*\])(?![^\(]*\))/;
    //inserted:              \W*                      |\.                 [ <>]                         lookahead appended later

    // 2010-04-21 Balazs fix for jQuery (Sizzle) 1.4.2
    Expr.leftMatch.ATTR = new RegExp(/(^(?:.|\r|\n)*?)/.source +
    Expr.match.ATTR.source.replace(/\\(\d+)/g, function(all, num) { return "\\" + (num - 0 + 1); }));
        
    Expr.filter.ATTR = function(elem, match) {

        var name = match[1],
		result,
		value,
		type = match[2],
		check = match[4],
		prefix = name.match(/(^\W+)(.*)/);

        if (prefix !== null) {
            for (var i in Expr.attrPrefix)
                if (i === prefix[1]) {
                result = Expr.attrPrefix[i](elem, prefix[2]);
                break;
            }
        } else
            result = Expr.attrHandle[name] ?
			Expr.attrHandle[name](elem) :
			elem[name] != null ?
				elem[name] :
				elem.getAttribute(name);

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
        value = isNaN(newValue) ? value : newValue;
        check = isNaN(newCheck) ? check : newCheck;

        return type === "<" ? value < check :
		type === ">" ? value > check :
		type === "<=" ? value <= check :
		type === ">=" ? value >= check :
		false;
    }

})((jQuery && jQuery.find) || Sizzle);


(function($) {
    //Sizzle.selectors.attrPrefix
    $.extend($.expr.attrPrefix, {
        ':': function(e, val) { return $(e).data(val); },
        '~': function(e, val) { return $.curCSS(e, val); },
        '&': function(e, val) { var d = $.data(e, 'events'); return d && d[val]; },
        '::': function(e, val) { var d = $.data(e, 'metadata'); return d && d[val]; }
    })

})(jQuery);