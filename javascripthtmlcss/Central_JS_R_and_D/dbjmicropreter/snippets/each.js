/*
based on badly implemented idea by some Michal Tatarynowicz 
*/

/*
this is bollocks ...
------------------------------------------
if (!Object.prototype.hasOwnProperty){
Object.prototype.hasOwnProperty = function(p){
return typeof this[p] != 'undefined';
}
}
*/

Object.prototype.each = function(fn){
for (var p in this) {
// if (!this.hasOwnProperty(p)) fn(this,p);
   if ( p != "each" )
   fn(this,p);
}
}

function DBJ () { this.property = "DBJ"; this.fun = function () { return null;} } ;

var foo = [1,2,3] ;
var callback = function(a,b){ $('#display').append("\n" + (b + " : " + a[b])) ; }
foo.each(callback);