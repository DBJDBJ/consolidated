//----------------------------------------------------------------
function newarr( len, lower, upper ){
     var rv = [] ;
     for ( var j = 0 ; j < len ; j++ )
     rv.push( parseFloat(Math.random() * upper) ) ;
     return rv ;
}
//----------------------------------------------------------------
(function () {
function flip (a,b) { flip.a = b; flip.b = a; return flip ; }
[].swap = function(a,b, temp ) { this[a] = flip(this[a],this[b]).a ; this[b] = flip.a ; return this; }
}());
//----------------------------------------------------------------
function bsort ( arr ) {
  var swapped = false ;
   do {
   for ( var j = 0 ; j < arr.length ; j++ )
   for ( var k = j+1 ; k < arr.length ; k++ ) {
       swapped = false ;
       if ( arr[j] < arr[k] ) swapped = arr.swap(j,k);     
   }
   } while( swapped ) ;
   return arr;
}
//----------------------------------------------------------------
POP(
//  (bsort( newarr(999,0,99999) ))
bsort([9,6,1,2,3,8,7,6,1,4,3,2,1])
  .join('<li>')
);
//----------------------------------------------------------------