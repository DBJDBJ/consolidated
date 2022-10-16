// http://matt.might.net/articles/implementation-of-recursive-fixed-point-y-combinator-in-javascript-for-memoization/

// Ymem takes a functional and an (optional)
// cache of answers.

// It returns the fixed point of the functional
// that caches intermediate results.
  
function Ymem(F, cache) {
 if (!cache)
  cache = {} ; // Create a new cache.
 return function(arg) {
  if (cache[arg])
   return cache[arg] ; // Answer in cache.
  var answer = (F(function(n){
   return (Ymem(F,cache))(n);
  }))(arg) ; // Compute the answer.
  cache[arg] = answer ; // Cache the answer.
  return answer ;
 } ;
}

var fib = Ymem(function (g) { return (function (n) {
 if (n == 0) return 0 ;
 if (n == 1) return 1 ;
 return g(n-1) + g(n-2) ;
}) ; }) ;

alert( 
"Memoizing fixed-point combinator: \n" + 
"An Y-like combinator that caches the results of intermediate function calls.\n" +
"The end result is that the 100th Fibonacci number is computed instantly,\n" + 
"whereas the naive version (or the version using the ordinary Y combinator)\n" + 
"would take well beyond the estimated lifetime of the universe.\n" +
"\nfib(100) = " + fib(100)
);