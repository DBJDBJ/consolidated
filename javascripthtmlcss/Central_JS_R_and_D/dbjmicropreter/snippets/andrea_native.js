var isCallable = (function(toString)
{
 // The Latest WebReflection Proposal
 // Recently Updated with "explicit" cast
 // thanks to abozhilov for the test case
 var s = toString.call(toString),
 u = typeof u;
 return typeof this.alert === "object" ?
 function(f){
 return s === toString.call(f) || (!!f && typeof f.toString == u && typeof f.valueOf == u && /^\s*\bfunction\b/.test("" + f));
 }:
 function(f){
 return s === toString.call(f);
 }
 ;
})(Object.prototype.toString);
function isNative(o){
var r=1;
try{
 Function(o)
}catch(e){
 r="[object Object]".match(o)
};
return !r
};
isNative( { toString : function () { return ""+alert; }} )
/*
true
*/