//--------------------------------------------
// role = type + class 
// for objects and 
// role = "function" + function_name
// for native functions
function can_decomp(o) { return (""+(o+"")).length > 0 ; }
function roleof (o)
{
   var retval = Object.prototype.toString.call(o).match(/\w+/g) ;
   if ("Object" === retval[1] ) if ( can_decomp(o) ) retval = (o+"").match(/\w+/g);
   return "[" + retval[0] + " " + retval[1] + "]" ;
}
//--------------------------------------------
function isCallable(o) {
   var rx = /function/i ;
   return rx.test(roleof(o)) ;
}
//--------------------------------------------
var cases = [
"roleof()",
"roleof( roleof.xyz )",
"roleof( roleof )","roleof( document.createElement )",
"roleof ( document )","roleof ( alert )",
"roleof( new RegExp() )","roleof( XMLHttpRequest )",
"roleof( null )","roleof( undefined )",
"roleof( 1 )","roleof( '')",
"roleof( new Date() )","roleof( Math )",
"roleof( new Array )","roleof( [] )",
"roleof( new Object )","roleof ( {} )",
"roleof( { toString: {}, valueOf: null })" , // can not be decomposed
"roleof({ toString: function() { return 'function'; }, valueOf: function() { return 'function'; } })" //the "bomb" 
];
var s = "Testing\n" ;
for ( var j in cases ) s += "\n" + cases[j] + ":\t" + "'"+eval(cases[j])+"'" ; alert(s)
/*
undefined
*/