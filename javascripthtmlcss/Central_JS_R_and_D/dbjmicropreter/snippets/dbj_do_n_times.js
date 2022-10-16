a=[];
function N ( fp, n, i )
{
  N.c = n ;
  var tid = setInterval( function () {
      fp();
      if ( ! N.c-- ) {
         clearInterval(tid) ;
         alert(a);
      }
  }, i ) ;
}
// N.c = 0 ;
function x ( )
{
   a.push("x: " + x.c++) ;
}
x.c = 0 ;

N(x,3, 1000 )
a
/*

*/