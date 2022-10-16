

function must_new (n) { throw new Error(0xFF, "Do not call "+ n +"(), new it as: new " + n + "()" ) ; }
//
function X () 
{ 
     this.p = "property";
     this.f = function () {};
     return must_new("X") ;
}
x = X();