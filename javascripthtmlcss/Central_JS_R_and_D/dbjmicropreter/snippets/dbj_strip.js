
var x = " DBJ*Micropreter(tm) 2001-2009	 V:10/20/2009 09:39:20 DBJ*JSLib(tm) 1.40 $Date: 22/12/09 17:10 $ jQuery: 1.3.2 host: IE8 (c)2009, by DBJ.ORG (mailto:dbj@dbj.org)" ;

function strip(original, of_what )
{
 return (original.split( of_what || " ")).join("");
}

strip(x, /\W+/g )
/*
DBJMicropretertm20012009V10202009093920DBJJSLibtm140Date2610091621jQuery132hostIE8c2009byDBJORGmailtodbjdbjorg
*/