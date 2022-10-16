(function (window, undefined) {

var rx0 = /^[\],:{}\s]*$/ ,
    rx1 = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g ,
    rx2 = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
    rx3 = /(?:^|:|,)(?:\s*\[)+/g ;

var ok_json = function ( data ) {
  return rx0.test(
    data.replace( rx1 , "@").replace(rx2, "]").replace(rx3, "")
   ) ;
}

var ok_wrong_json = function () {  
try { JSON.parse("{ a : 1, '[]': 2, 'b':3 }"); return true ; } catch(x) { return false ; }  
}(); 

window.json_parse = 
 ( window.JSON && ("function" === typeof window.JSON.parse) ) ?

       ( ok_wrong_json ) ?
         function json_parse ( data ) {
          if ( ! ok_json( data ) ) throw new Error(0xFFFF,"Bad JSON string.") ;
          return window.JSON.parse( data ) ;
         }
      : // else 
         function json_parse ( data ) {
          return window.JSON.parse( data ) ;
         }
: // else 
function json_parse ( data ) {
    if ( ! ok_json( data ) ) throw new Error(0xFFFF,"Bad JSON string.") ;
    return (new Function("return " + data))(); 
}
;

})(window) ;