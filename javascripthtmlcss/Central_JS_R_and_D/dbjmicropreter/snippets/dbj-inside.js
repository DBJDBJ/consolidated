
function inside1 ( o, x ) { return o[x]; }

function inside2 ( o, x ) { if (x in o) return true; else return false; }

function inside3 ( o, x, own ) { if ("object" === typeof o || "function" === typeof o) {if (x in o) if (own || Object.prototype.hasOwnProperty.call(o,x)) return true; else return false; }}


inside1([3,2,1], "toString")
/*
function toString() {
    [native code]
}
*/
inside2([3,2,1], "toString")
/*
true
*/
inside3([], "toString", 1 )
/*
false
*/

/*
false
*/

/*
false
*/

/*
true
*/