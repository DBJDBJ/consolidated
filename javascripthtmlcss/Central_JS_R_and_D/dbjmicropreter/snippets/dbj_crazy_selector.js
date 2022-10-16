// micro-engine for simpler AND faster page queries
// NOTE! this caches the results and thus works ONLY if you do not 
//       add or remove or change document nodes. 
//       Which makes it ideal for CHROME extensions
//       2009.OCT.27 dbjdbj@gmail.com  Created
(function () {
 // cache is array indexed by container objects
 var cache = [] ;
 // each cache element is: {  "_container_" : container , "selector" : staticNodeList, ... }
 function cached_selections ( cont )
 {
   // return saved selections for the cont(ainer) or make it if not in the cache
   return cache[cont] || (cache[cont] = { "_container_" : cont }) ;
 }
 // ss is individual cache [] element 
 function cached_result ( ss, sel )
 {
  // take the result or make it and store it if not made
  return ss[sel] = ss[sel] || (ss[sel] = ss._container_.querySelectorAll( sel ));
 }

Q = function ( selector, container )
{
  return cached_result( cached_selections ( container || document ), selector ) ;
}
})();


Q("#toolbar").length
/*
11
*/

/*
1
*/

/*
1
*/