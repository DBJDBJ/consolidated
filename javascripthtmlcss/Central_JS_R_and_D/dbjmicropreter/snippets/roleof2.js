//--------------------------------------------
// http://webreflection.blogspot.com/2009/08/isfunction-hacked-iscallable-solution.html
var isCallable = (function(toString){
    var s = toString.call(toString),
        u = typeof u;
    return typeof this.alert === "object" ?
        function(f){
            return s === toString.call(f) || (!!f && typeof f.toString == u && typeof f.valueOf == u && /^\s*\bfunction\b/.test(f));
        }:
        function(f){
            return s === toString.call(f);
        }
    ;
})(Object.prototype.toString);

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
function isF(o) {
   var rx = /function/ ;
   return rx.test(roleof(o)) ;
}
//--------------------------------------------
var cases = {
"null": 0 , "undefined": 0 ,
"roleof.xyz": 0 , "roleof": 0 ,
"document": 0 , "top.alert": 0 ,
"new RegExp()": 0 , "new XMLHttpRequest()": 0 ,
"1": 0 , "new String()": 0 ,
"new Date()" : 0 , "Math": 0 ,
"new Array()": 0 , "[]": 0 ,
"new Object()": 0 , "{}": 0
, "{ toString: {}, valueOf: null }" : 0 
, "o = { toString: function() { return 'function X'; }, valueOf: function() { return 'function X'; } }" : 0 
};
function TEST() {
function left ( s, l, c ) { s = ""+s; s = s.length < l ? dbj.rpad(s,l,c || " ") : s.substr(0,l); return s +"|" ; }
  function use( f, o ) { try { return left(f(eval(o)),20) ; } catch(x) { return left(x.description,20); } }
  var s = "Testing\n" ;
  s += "\n" + left("-",20,"-") + left("-",20,"-") + left("-",20,"-")  ;
  s += "\n" + left("input",20) + left("roleof()",20) + left("isF()",20);
  s += "\n" + left("-",20,"-") + left("-",20,"-") + left("-",20,"-")  ;
  for ( var c in cases ) {
      s += "\n" + left(c,20)   
           + use( roleof,c) 
           + use( can_decomp,c) ; 
  }
 return s;
}
TEST()
/*
Testing

--------------------|--------------------|--------------------|
input               |roleof()            |isF()               |
--------------------|--------------------|--------------------|
null                |[null undefined]    |true                |
undefined           |[undefined undefined|true                |
roleof.xyz          |[undefined undefined|true                |
roleof              |[object Function]   |true                |
document            |[object HTMLDocument|true                |
top.alert           |[function alert]    |true                |
new RegExp()        |[object RegExp]     |true                |
new XMLHttpRequest()|[object XMLHttpReque|true                |
1                   |[object Number]     |true                |
new String()        |[object String]     |false               |
new Date()          |[object Date]       |true                |
Math                |[object Math]       |true                |
new Array()         |[object Array]      |false               |
[]                  |[object Array]      |false               |
new Object()        |[object Object]     |true                |
{}                  |[undefined undefined|true                |
{ toString: {}, valu|Syntax error        |Syntax error        |
o = { toString: func|[function X]        |true                |
*/