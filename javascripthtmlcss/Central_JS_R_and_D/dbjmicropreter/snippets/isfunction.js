        // V.4
        // universal isFunction for every situation ?
        isFunction = function(x) {
            if ( ! x ) return false ;
            var rx = /function/, ft = "function";
            switch (typeof x) {
                case ft: return true;
                case "object":
                    if ((ft !== typeof x.toString) &&
                        (ft !== typeof x.valueOf))
                        try { return rx.test(x); } catch (x) { return false; }
                    else
                        return Object.prototype.toString.call(x) === "[object Function]";
                    break;
                default: return false;
            }
        }
var test = [
        { valueOf: null, toString: null }, false,
        { valueOf: function() { return "function"; }, toString: null }, false,
        XMLHttpRequest, false,
        JSON, false ,
        alert, true ,
        Function(), true,
        null, false,
        undefined, false
        ]
// passed if : isFunction(test[j]) === test[j+1]
// where j in [0,2,4,6,8,10,12,14]
s = "test"
for ( var j = 0 ; j < test.length ; j ++ )
{
     s += "\n" + j + " : " + (isFunction( test[j] )) ;
     j += 1 ;
}
s
/*
test
0 : false
2 : false
4 : false
6 : false
8 : true
10 : true
12 : false
14 : false
*/