
if (typeof require === "undefined") {
    // (C) WebReflection - Mit Style License
    var require = (function (context, root, Function) {
        function require(namespace) {
            if (!hasOwnProperty.call(cache, namespace)) {
                var xhr = new XMLHttpRequest;
                xhr.open("GET", (root + "." + namespace.replace(/(^.*)(?:\.[0-9A-Za-z$_]+)$/, "$1")).replace(/\./g, "/") + ".js", false);
                xhr.send(null);
                cache[namespace] = Function(xhr.responseText + ";return function(){return eval(arguments[0])};").call(context);
            }
            return /(?:^.*\.|^)([0-9A-Za-z$_]+)$/.test(namespace) && cache[namespace](RegExp.$1);
        };
        var XMLHttpRequest = this.XMLHttpRequest || function () {
            return new ActiveXObject("Microsoft.XMLHTTP");
        };
        var cache = {};
        var hasOwnProperty = cache.hasOwnProperty;
        return require;
    })(this, "", this.Function);
}

/*
<script src="require.js"></script>
<script>
var base = require("mylib.base");
base.alert("hello");

var $alert = require("mylib.base").alert;
$alert("world");
</script>
*/