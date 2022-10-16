

// WebReflection knows if we are in ES5 era!
window.ES5 = (function(){"use strict";try{return !arguments.callee}catch(e){return true}})();

// arguments.callee is apparently horenuously slow 
// Another WebReflection Silly Idea
function F (callee){ return eval( "("+"callee="+callee+")" ); };

// create the function via F
fun = F(function(i){
    // we got arguments, and callee
    return callee ;
});

fun()