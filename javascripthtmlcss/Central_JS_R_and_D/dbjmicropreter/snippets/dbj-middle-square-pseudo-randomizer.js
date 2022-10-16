/* http://en.wikipedia.org/wiki/Middle-square_method */
var MSM = (function () { 

    var cache = { for_key : function (k) { return cache[k] || (cache[k] = []); } } ;
   
    function F(s,l) {
        var r = "" + 1*s*s;
        return parseInt( r.substr((r.length - l) / 2, l) );
    }

    return function (s, L ) {
    var rez = cache.for_key(""+s) , l = (""+s).length ;

    //if ( rez.length >= L ) return rez ;

    while(L--) {
        s = F(s, l);
        rez.push(s);
    }
       return rez ;
    }
}());

MSM(8653,13)
/*
8744,4575,9306,6016,1922,6940,1636,6764,7516,4902
*/

/*
8744,4575,9306,6016,1922,6940,1636,6764,7516,4902,2,4,16
*/

/*
8744,4575,9306,6016,1922,6940,1636,6764,7516,4902,2,4,16
*/

/*
8744,4575,9306,6016,1922,6940,1636,6764,7516,4902,2,4,16
*/