

    // String.trim() ECMA5
    if ("function" !== typeof "".trim)String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, ''); }
     
// Type Discovery Mechanism V.2 ---------------------------------------
// simpler and better 
function isWhat(o){ 
 return Object.prototype.toString.call(o).match(/\w+/g)[1]; 
// constructor of inbuilt objects can be changed!
// return (""+(o).constructor).match(/\w+/g)[1]; 
} 
// optimization
var TYPENAME = { 'obj' : isWhat({}), 'arr' : isWhat([]), 'fun' : isWhat(Function()), 'str' : isWhat(""),'num' : isWhat(1) } ;

function isObject(x)   { return isWhat(x) === TYPENAME.obj;}
function isArray(x)    { return isWhat(x) === TYPENAME.arr;}
function isFunction(x) { return isWhat(x) === TYPENAME.fun;}
function isString(x)   { return isWhat(x) === TYPENAME.str;}
function isNumber(x)   { return isWhat(x) === TYPENAME.num;}

       function tname ( x , all ){ 
             return (x+"").match(/\w+/g)[1] ;
       }

   // TESTING ---------------------------------------------------------
   function test () {
       
       var far = [ isObject, isArray, isFunction, isString, isNumber ] ;
       

    function E(S, i) { 
        var retval = "" ;
        try { retval = far[i](S)} catch(x) {retval = "ERROR: " + x.description } ;
        return "\n" + dbj.pad(tname(far[i]) + "()",30) + 
                      dbj.pad("\t--> " + retval,30) ; 
    }
    function T(X) {
        var s = "" ;
        for( var j = 0; j < far.length; j++ ){
               s += E(X,j) ;
          }
         return s ;
      }
        var s = "";
          for ( var n=0; n < arguments.length; n++ ) {  
            s += "\n" + "cheking: " + arguments[n] ;
            s += "\n" + T(arguments[n]) ;
          }
        return s ;
   }

var	types = [
	new Array,	new Boolean,  new Date,
	new Error,  new Function, Math,	
	new Number,	new Object,	new RegExp,	
      new String
];

// test.apply(this, types) ;
isWhat(document)
Object.prototype.toString.call(alert)
alert+""