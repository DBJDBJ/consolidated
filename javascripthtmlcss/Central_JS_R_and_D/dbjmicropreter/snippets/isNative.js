
(function (window) {
// signature of a native method 
// through string decomposition
function f_sig ( f )
{
  var name = (f+ "").match(/\w+/g)[1] ;
  return [ name ,(f+ "").replace( name, "~")];
}
var alert_signature = f_sig( window.alert )

window.isNative = function ( f ) 
{
   var sig = f_sig(f) ;
   return sig[1] === alert_signature[1] ;
}
})(this);

isNative( document.attachEvent )
/*
true
*/