
function f1 (a,b,c ) {

   alert("a: "+ a + "\nb: " + b + "\nc: " + c );
}

function callback_user (cb)
{
   var e = function() { throw new Error(0xFF,"callback argument is not a function");},
       a = Array.prototype.slice.call(arguments).slice(1);

   cb = cb || e ;
   cb = "string"   == typeof cb ? eval(cb) : cb ;
   cb =  "function" == typeof cb ? cb : e ;

   cb.apply(window || this,a)
}

callback_user ("f1",1,2,3)
/*
undefined
*/