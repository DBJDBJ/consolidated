/// <reference path="../../jq132-vsdoc.js" />
/*
$Revision: 1 $
$Date: 11/01/10 16:00 $

DEPENDANCIES : jQuery 1.3.2 or higher + dbj.lib.js
------------------------------------------------------------------------------------------------------------
*/
(function($) {
    // $.NS is defined in dbj.lib.js
    dbj.parseUri = function(str) {
    ///<summary>
    ///parseUri 1.2.1
    ///(c) 2007 Steven Levithan <stevenlevithan.com>
    ///MIT License
    ///</summary>
    var o = options_,
		m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i = 14;

        while (i--) uri[o.key[i]] = m[i] || "";

        uri[o.q.name] = {};
        uri[o.key[12]].replace(o.q.parser, function($0, $1, $2) {
            if ($1) uri[o.q.name][$1] = $2;
        });

        return uri;
    };

    var options_ = {
        strictMode: false,
        key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
        q: {
            name: "queryKey",
            parser: /(?:^|&)([^&=]*)=?([^&]*)/g
        },
        parser: {
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        }
    };

    //    use this to test
    //    $.dbj.parseUri("http://user@password:host:13/query/string?param1=12#bookmark");

})(jQuery);
/* TODO: do we need this actually? */
