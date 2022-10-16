function each (object, callback, args) {
    var name, i = 0,
        length = object.length,
        isObj = length === undefined || "function" === typeof object; 
//    if (args) {
        if (isObj) {
            for (name in object) {
                if (callback.apply(object[name], args || [name,object[name]]) === false) {
                    break;
                }
            }
        } else {
            for (; i < length;) {
                if (callback.apply(object[i++], args || [i-1,object[i-1]]) === false) {
                    break;
                }
            }
        }
/*    } else {
        if (isObj) {
            for (name in object) {
                if (callback.call(object[name], name, object[name]) === false) {
                    break;
                }
            }
        } else {
            for (var value = object[0]; i < length && callback.call(value, i, value) !== false; value = object[++i]) {}
        }
    }
*/
    return object;
}
//
var measure = function ( fun, looplen ) {
var t1 = new Date(), counter = looplen || 1e3 ;
while ( counter-- ) { fun() ; }
return (new Date() - t1) + " ms, loop size: " + (looplen || 1e3);
}
//
make_object = function ( size ) { var o = { "size":size }; while( size-- ) { o[size] = size; }; return o; }
//
function test (obj_siz) {
var s=[], o = make_object(obj_siz), cb = function () { s.push(this+","+[].join.call(arguments));}, args = ["one", "two"] ;

return "object size: {0}, dbj each: {1}, jQ each: {2}".format( o.size, measure( function () {each( o, cb, args )} ),  measure( function () {each( o, cb, args )} )) ;
}
var final = [] , tid = top.setTimeout( function () { top.clearTimeout(tid); tid = null ;
for ( var j = 1; j--; ) { final.push( test(1e1) ); top.alert(final.join("\n")); } ;
},1 ) ;