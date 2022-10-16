
function test ( cnt, obj )
{
var s = [], t = new Date ;
jQuery.each140( obj, function(n,v) { s.push("n:" + n + " v:" + v ) ; } );
var t_new = (new Date) - t ;
t = new Date ; s = [] ;
jQuery.each( obj, function(n,v) { s.push("n:" + n + " v:" + v ) ; } );
var t_132 = (new Date) - t ;
t = new Date ; s = [] ;
jQuery.each126( obj, function(n,v) { s.push("n:" + n + " v:" + v ) ; } );
var t_126 = (new Date) - t ;
return "[{0}]\t\t{1}\t\t{2}\t\t{3}".format( cnt,t_new,t_132, t_126 );
}
//-----------------------------------------------------------------------
var s = ["[{0}]\t{1}\t{2}".format( "Test num", "new time", "old time")], 
j = 10 , SIZE = 1e5, obj = new Array(SIZE);

while(j--) {
  s.push( test(j, obj ) ) ;
}

s.join("\n");
/*
[Test num]	new time	old time
[9]		499		421
[8]		655		422
[7]		655		405
[6]		765		515
[5]		577		515
[4]		577		499
[3]		562		2554
[2]		593		515
[1]		577		515
[{0}]		561		499
*/