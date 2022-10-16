
(function () {
jquery = window.jquery = function (a,b){
 return new jquery.fn.init(a,b);
};

jquery.fn = jquery.prototype = {
 init: function(a,b){

    if ( ! a ) return this ;
  
    if ( ! b ) return this[this.length++] = a ;

    return jquery(a+b) ;
 },
  length : 0
};

jquery.fn.init.prototype = jquery.fn;

})() ;

jquery(1,2)[0]
/*
3
*/