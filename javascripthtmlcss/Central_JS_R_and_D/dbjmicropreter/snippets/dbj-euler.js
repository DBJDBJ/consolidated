// Solution to euler no 1 : sum_n(1000,3)+sum_n(1000,5)-sum_n(1000,3*5)
function sum_n ( max, div ) {
  var rez = [max,div,0] ;
   while ( max-- > div) if ( max % div == 0 )  rez[2] += max ;
    return rez ;
}
// final callback to compute the current result of computations finished by sum_n()
function sum_n_final ( R ) {
if ( R.length < 1 ) return -1 ; 
var max = R[0][0], final = 0, L = R.length, final_divisor = 1 ; 
// sum of computations until now and also final_divisor 
while ( L-- ) { final += R[L][2]; final_divisor *= R[L][1]; }
// deduct from final the result of sum_n(max,final_divisor)
     return final - sum_n( max, final_divisor )[2] ;
}
//
function show ( r ) { alert(r.join("\n")+ "\n\nFinal:\t" + sum_n_final(r) );}
//
function clear (r,n) {  window[n] = []; }
//------------------------------------------------------------------------------------------
// eulerian call stream
 function euler ( name, max ) {
    if ("string" !== typeof name ) throw "euler requires argument 1 that is a name  of the solution required" ;
    if ("number" !== typeof max  ) throw "euler requires argument 2 that is a input to the solution required" ;

  var rez = window[name] = [], worker = eval(name) ;

  return function cs ()
  {
    var ARG = arguments ;
    if ( typeof ARG[0] === "number" )
         rez.push(worker( max,ARG[0]));

    if ( typeof ARG[0] === "function" )
         ARG[0](rez,name); 

    return cs ;
  }
 }

var dumsy = euler("sum_n",1000)(3)(5)(show)(clear)(7)(show);