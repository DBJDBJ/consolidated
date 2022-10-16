//----------------------------------------------------------------------
function harvest ( selector )
{
var EX = /\[\s*(\W*(?:[\w\u00c0-\uFFFF_-]|\.|\\.)+)\s*(?:(\S?[=<>])\s*(['"]*)(.*?)\3|)\s*\](?![^\[]*\])(?![^\(]*\))/;
var rez = [] ;
    function analyse ( last_match ) {
          var RX = /\[(.+)\]/ig ;
          var match = EX.exec(last_match) , nme = match[1], pfx = nme.match(/(^\W+)(.*)/) ;

          return { 'selector' : last_match ,
                   'prefix' : ( pfx ? pfx[1] : "" ) ,
                   'name' : nme, 
                   'operator' : match[2], 
                   'operand' : match[4]
                 } ;
    }

   while ( EX.test(selector) )
   {
       selector = RegExp.rightContext;
       rez.push(analyse( RegExp.lastMatch )) ;
   }
       return rez;
}
//----------------------------------------------------------------------
var rez = harvest("#balazs[ att1 >= 2 ][~top!=auto]") ;


var s_ = "" ;
for (o in rez) 
{
    for (var n in rez[o]) { s_ += "\n[" + n + "] = '" + rez[o][n] + "'"; };
    s_ += "\n" ;
}
alert(s_) ;
/*
undefined
*/