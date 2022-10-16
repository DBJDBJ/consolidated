var inArray = typeof [].indexOf === 'function' ? function(elem, array) {
                                      return array.indexOf(elem);
                                 }
: function ( elem, array )  {
            var i = array.length ; 
             while( i-- ) { if ( array[i] === elem ) return i ; }
            return -1 ;
        } ;

inArray( 4, [1,2,3,4,5] )


function ina ( elem, array )
{  
    var i = array.length ;
      do {
          if ( i-- === 0 ) return i ;
      } while ( array[i] !== elem ) ;
   return i ;
}

ina( 5, [1,2,3,4,5])
/*
0
*/

/*
4
*/