(function (undefined) {

    /*
    (c) dbj.org
    The absolute core of dbj cores ... perhaps we can call it dbj.core
    
        additions to ES5 intrinsics
    
        moot point: what happens in the presence of another "".format() ?
    */
    if ("function" != typeof "".format)
        String.prototype.format = function () {
            let args = arguments;
            return this.replace(/\{(\d|\d\d)\}/g, function ($0) {
                let idx = 1 * $0.match(/\d+/)[0];
                return args[idx] !== undefined
                    ? args[idx]
                    : (args[idx] === "" ? "" : $0);
            }
            );
        };

    const oprot = Object.prototype, aprot = Array.prototype, sprot = String.prototype;

    const /*implementation*/
        imp_ = {
            /* coercion to Int32 as required by asm.js */
            toInt32: function (v_) {
                return v_ | 0;
            },
            isEven: function (value) { return (imp_.toInt32(value) % 2 == 0); },
            /* dbj's type system */
            type: (function () {
                let rx = /\w+/g, tos = oprot.toString;
                return function (o) {
                    if (typeof o === "undefined") return "undefined";
                    if (o === null) return "null";
                    if ("number" === typeof (o) && isNaN(o)) return "nan";
                    return (tos.call(o).match(rx)[1]).toLowerCase();
                };
            }()),
            isObject: function (o) { return "object" === imp_.type(o); },
            isFunction: function (o) { return "function" === imp_.type(o); },
            isArray: function (o) { return "array" === imp_.type(o); },
            isString: function (o) { return "string" === imp_.type(o); }
        };

    dbj.core = {

        "toString": function () { return "dbj(); kernel 1.2.0"; },
        /* 
        coercion to Int32 as required by asm.js
        */
        "toInt32": imp_.toInt32,
        "isEven": imp_.isEven,

        "oprot": oprot,
        "aprot": aprot,
        "sprot": sprot,

        "type": imp_.type,
        "isObject": imp_.isObject,
        "isFunction": imp_.isFunction,
        "isArray": imp_.isArray,
        "isString": imp_.isString
    };

    //   export it to node from here
        if ('undefined' != typeof module ) module['exports'] = dbj ;
}(
    function () {
        // for dom env this creates window.dbj
        // for node env this creates module local var
        if ("undefined" == typeof dbj)
            dbj = {};
        return dbj;
    }()
    ));
