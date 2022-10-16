var args = function ( ARG, reveal ) { 
    var arr = Array.prototype.slice.call(ARG); 
    if ( ! reveal ) return arr ;
    for( var l = 0; l < arr.length ; arr[l] = l + ":" + dbj.reveal(arr[l]), l++ ) ;
    return arr.join("\n-----------------------------------------------------------------\n") ;
}

dbjW = function ( imp_ )
{ return {preconditions  : function () { alert("preconditions:\n"  + args(arguments,1)) },
          postconditions : function () { alert("postconditions:\n" + args(arguments,1)) },
          implementation : function () { return imp_ ;}
} ;
}

function wrap( o ) {

var w = " {\n'imp' : wrapper.implementation(), " ;

for ( var f in o )
{
   if ( "function" !== typeof o[f] ) continue ;

   var src = " wrapper.preconditions(this, arguments ); return wrapper.postconditions(this, arguments, this.imp, '{0}') ; ".format(f) ;
   
   w += ("\n"+ f + ":" + new Function( src )).replace("anonymous", "" ) + "," ;
}

return new Function("wrapper", "return " + w + "\n\"null\" : true }") ;

}
//////////////////////////////////////////////////////////////////////
var E = { f1 : function (a,b){}, f2: function (c,d,e) {}};
W = wrap(E)(dbjW(E))
W.f1();