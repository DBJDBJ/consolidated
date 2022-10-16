
/*

DBJ*Micropreter(tm) 2001-2010	 V:02/11/2010 17:42:07
DBJ*JSLib(tm) 1.17 $Date: 12/02/10 18:58 $
jQuery: 1.3.2
host: IE8
-------------------------------------------------------------------------- 
(c)2010, by DBJ.ORG (mailto:dbj@dbj.org)

*/
String.prototype.trim = function ()
{
 return this.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1");
}

"[" + "         1234    ".trim() + "]"