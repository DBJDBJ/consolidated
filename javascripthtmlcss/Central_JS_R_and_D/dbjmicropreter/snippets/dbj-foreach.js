Array.prototype.forEach1 = function ( callback ) {
        for (var j = 0, k ; k=this[j++]; ) {  callback(k,j,this) ; }
}
Array.prototype.forEach2 = function ( callback ) {
        for (var j = 0 ; j < this.length; j++ ) {  callback(this[j],j,this) ; }
}
Array.prototype.forEach3 = function ( callback ) {
        var j = 0 ; while( this[j++] ) {  callback(this[j],j,this) ; }
}
var a = [1,2,3,4,5,6,7,8,9,0] ;
function unit ( method ) 
{
   var s = [] ;
    a[method]( function (v,i,a) { s.push(i+":"+v); } )
  return s ;
}

function loop ( size, method ) {
var t1 = new Date() ;
 while ( size--) { unit(method); }
return (new Date()) - t1 ;
}

loopall = function ( ) {
 var s = [] ;
 var j = 0, method ; while ( method = arguments[j++] ) {
  s.push( method + ": " +  loop( 1e4 , method )  + " ms " ) ;
 }
   return s ;
} ( "forEach1", "forEach2", "forEach3" ) .join("\n") ;