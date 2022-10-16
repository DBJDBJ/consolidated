
function F(n, size) { 
var sign = n < 0 ? "-":"+" ; 
n = Math.abs(n); 
size = (size == null ? 10 : size );
return sign + (n < size ? '0' + n : n) ; 
} 

function namespace ()
{
    // scope and visibility of 'counter' is private to 'namespace'
    var counter = 0 ; 
    // O, O.m and O.counter all have the public visibility
    this.O = { 
          m : function (x) { return x + "namespace counter : " + F(counter++) + "\tO counter: " + F(this.counter++) ; }
       ,  counter : -9  // scope of this is 'this.O'
    }
    return this ;
}

n1 = namespace() ;
n2 = namespace() ;
// n1 and n2 now share the same instance of namespace and also all the instances made inside it !
s = "Shared --------------------------------------------------------------\n\n" ;
for ( var j in [0,1,2,3,4] ){s += n1.O.m("\nn1\t") ;s += n2.O.m("\nn2\t") ;}
n1 = new namespace() ;
n2 = new namespace() ;
// n1 and n2 now DO NOT share the same instance of namespace and also NONE OF instances made inside it !
s += "\n\nUN-Shared --------------------------------------------------------------\n" ;
for ( var j in [0,1,2,3,4] ){s += n1.O.m("\nn1\t") ;s += n2.O.m("\nn2\t"); }
/*
Shared --------------------------------------------------------------


n1	namespace counter : +00	O counter: -09
n2	namespace counter : +01	O counter: -08
n1	namespace counter : +02	O counter: -07
n2	namespace counter : +03	O counter: -06
n1	namespace counter : +04	O counter: -05
n2	namespace counter : +05	O counter: -04
n1	namespace counter : +06	O counter: -03
n2	namespace counter : +07	O counter: -02
n1	namespace counter : +08	O counter: -01
n2	namespace counter : +09	O counter: +00

UN-Shared --------------------------------------------------------------

n1	namespace counter : +00	O counter: -09
n2	namespace counter : +00	O counter: -09
n1	namespace counter : +01	O counter: -08
n2	namespace counter : +01	O counter: -08
n1	namespace counter : +02	O counter: -07
n2	namespace counter : +02	O counter: -07
n1	namespace counter : +03	O counter: -06
n2	namespace counter : +03	O counter: -06
n1	namespace counter : +04	O counter: -05
n2	namespace counter : +04	O counter: -05
*/