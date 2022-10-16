
/*                                                                  
  Copyright 2013 by DBJ.ORG. All Rights Reserved. MIT/GPL applies.                                             
                                                                  
  THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF DBJ.ORG   
                                                                  
  The copyright notice above does not evidence any                
  actual or intended publication of such source code.             
*/                                                                             
(function (jQuery, undefined) {

    var dbj = (top.dbj = top.dbj || { }),
    nop = function (check) { return !!check; },
    OP = new function () {

        var rx = {
            label_name: /(.+):(.+)/,
            validOps : /(\!=|\^=|\*=|\$=|\~=|\|=|=)/g,
            validLabels: /^(data|css|prop):/,
            /* if no label 'attr' is default */
            parse_label_name: function (expr, retval) {
                retval = retval || { lab: null, prop: null };
                expr = expr.trim();
                retval.lab = expr.match(rx.validLabels) ? expr.split(':')[0] : 'attr';
                retval.prop =  expr.replace(rx.validLabels, '') ;
                return retval;
            }
        },
        map = {
            /* W3C standard operators */
            "!=": function (result, check) { return result !== check; },
            "^=": function (result, check) { return check && result.indexOf(check) === 0; },
            "*=": function (result, check) { return check && result.indexOf(check) > -1; },
            "$=": function (result, check) { return check && result.slice(-check.length) === check; },
            "~=": function (result, check) { return (" " + result + " ").indexOf(check) > -1; },
            "|=": function (result, check) { return result === check || result.slice(0, check.length + 1) === check + "-"; },
            "=": function (result, check) { return result === check; },
           /* extended operators using float values */
            "==": function (result, check) { return parseFloat(result) === parseFloat(check); },
            ">=": function (result, check) { return parseFloat(result) >=  parseFloat(check); },
            "<=": function (result, check) { return parseFloat(result) <=  parseFloat(check); },
            "<": function (result, check) { return parseFloat(result)  <   parseFloat(check); },
            ">": function (result, check) { return parseFloat(result)  <   parseFloat(check); },
        };

        dbj[":"] = map; /* for users to add operators */

        this.op_set = function ( op, fun ) { map[op] = fun; }
        this.op_get = function ( expr ) {
            for (var op in map ) {
                if ( expr.indexOf(op) > -1 ) return op ;
            }
            return null;
        }
        this.parse = function ( expr ) {
            var retval = { lab: null, prop: null, op: null, check: null, fun : null } ;
            for (var op in map ) {
                if ( expr.indexOf(op) > -1 ){
                    retval.op = op;
                    retval.fun = map[op] || null;
                    if ("function" != typeof retval.fun) throw ":dbj() handler for operator " + retval.op + ", not found ?";
                    expr = expr.split(op);
                    if (!expr[1]) throw ":dbj() operator rvalue not found in a selector";
                    retval.check = expr[1].trim() ;
                    rx.parse_label_name(expr[0], retval);
                    break;
                }
            }
            /* we might have a simple expression with no operator  */
            if (!retval.op) {
                /* therefore no space allowed */
                if (expr.match(/\s/)) throw ":dbj() no operator found, simple selector can not have a space";
                rx.parse_label_name(expr, retval);
            }
            if (!retval.prop) throw ":dbj() name not found ?";
            return retval ;
        }
    }

    jQuery.expr[":"].dbj = jQuery.expr.createPseudo(function (selector) {
        return function (elem) {
            // pedestrian code because of debugging
            var input = OP.parse(selector.trim());
            var current_value_ = jQuery(elem)[input.lab](input.prop);
            var result = input.op ? input.fun(current_value_, input.check)
                : nop(current_value);
            return result;
        };
    });

    (void jQuery.find.compile(":dbj"));


}($ || jQuery));
/*
usage:
var $see_mee_in_debugger_ = $("div:dj(css:right = 10px)");
*/

(function (jQuery, undefined) {
    /*
    (c) 2013 by DBJ.ORG, GPL/MIT applies
 
    expr arguments is any legal jQuery selector.
    returns array of { element: , events: } objects
    where events is jQuery events structure attached (as  data)
    to the element
    return is null on no events attached
 */
    jQuery.events = function (expr) {
        var rez = [], evo;
        jQuery(expr).each(
           function () {
               if (evo = jQuery._data(this, "events"))
                   rez.push({ element: this, events: evo });
           });
        return rez.length > 0 ? rez : null;
    }

}($ || jQuery));
