
var dbj ={} ;
    // String.trim() ECMA5
    if ("function" !== typeof "".trim)String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, ''); }
// Type Discovery Mechanism V.1 ---------------------------------------
    // type discovery helpers avoiding the 'typeof' usage
    dbj.isWhat = function (x) {
        return ("" + x.constructor).split("(")[0].split("function")[1].trim();
    }

    // is<T>() function generator 
    dbj.isWhat.gener = function( names, root ) {
        for ( var n in names ) {
         root["is"+names[n]] = Function("x"," return dbj.isWhat(x) === '"+names[n]+"'")
        }
    }

   // generate is<T>() functions by using constructor names
   // which are capitalised vs type names, which are not 
   dbj.isWhat.gener( ["Array","Object","Function", "String", "Number"], dbj )
     
// Type Discovery Mechanism V.2 ---------------------------------------
// simpler and better 
function isWhat(o){ 
// return Object.prototype.toString.call(o).match(/\w+/g)[1]; 
// V.3 -- just this change
return (""+(o).constructor).match(/\w+/g)[1]; 
} 
// optimization
var TYPENAME = { 'obj' : isWhat({}), 'arr' : isWhat([]), 'fun' : isWhat(Function()), 'str' : isWhat(""),'num' : isWhat(1) } ;

function isObject(x)   { return isWhat(x) === TYPENAME.obj;}
function isArray(x)    { return isWhat(x) === TYPENAME.arr;}
function isFunction(x) { return isWhat(x) === TYPENAME.fun;}
function isString(x)   { return isWhat(x) === TYPENAME.str;}
function isNumber(x)   { return isWhat(x) === TYPENAME.num;}

   // TESTING ---------------------------------------------------------
   function test () {
    function E(S) { 
        var retval = "" ;
        try { retval = Function(S)()} catch(x) {retval = "ERROR: " + x.description } ;
        return "\n" + S + "\t--> " + retval ; 
    }
    function T(X) {
     return E('isArray('+X+')') + E('isObject('+X+')') + 
            E('isFunction('+X+')') +
            E('isString('+X+')') + E('isNumber('+X+')') ;
      }
        var s = "";
          for ( var n=0; n < arguments.length; n++ ) {  
            s += "\n" + T(arguments[n]) ;
          }
        return s ;
   }

test(Object(),Function(),String(),Number(),Array())