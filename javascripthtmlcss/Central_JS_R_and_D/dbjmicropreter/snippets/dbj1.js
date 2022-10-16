
/*
DBJ*MicroPreter(tm)  -- Lightweight JavaScript Interpreter 
 -------------------------------------------------------- 
 (c) 2001-2006 by DBJSystems Ltd (mailto:dbj@dbj.org)
*/
//---------------------------------------------------------------------
//
//---------------------------------------------------------------------
var DBJ = new Object() ;
//---------------------------------------------------------------------
//
//---------------------------------------------------------------------
DBJ.center = function(oNode){
   var oParent=oNode.parentElement;
   oNode.style.left = oParent.offsetWidth/2 - oNode.offsetWidth/2;
   oNode.style.top = oParent.offsetHeight/2 - oNode.offsetHeight/2;
}
//---------------------------------------------------------------------
//
//---------------------------------------------------------------------
DBJ.right = function (oNode){
   var oParent=oNode.parentElement;
   oNode.style.left = oParent.offsetWidth - oNode.offsetWidth ;
}
//---------------------------------------------------------------------
//
//---------------------------------------------------------------------
DBJ.left = function (oNode){
   var oParent=oNode.parentElement;
   oNode.style.left = 1 ;
}
//---------------------------------------------------------------------
//
//---------------------------------------------------------------------
DBJ.bottom = function (oNode){
   var oParent=oNode.parentElement;
   oNode.style.top = oParent.offsetHeight - oNode.offsetHeight - 1 ;
}
//---------------------------------------------------------------------
//
//---------------------------------------------------------------------
DBJ.top = function (oNode){
   var oParent=oNode.parentElement;
   oNode.style.top = 1 ;
}
//---------------------------------------------------------------------
//
//---------------------------------------------------------------------
DBJ.home = function ()
{
	
		var		the_root_ ;
		var		L = new String( window.location.href) ; 
				L = L.split("/") ;
		// gives an array like this : http:,,dbjnb,tipox_Local,Components,test_dbj.htm 
		the_root_ = L[0]+"//"+L[2]+"/"+L[3]+"/" ;
	
	return the_root_;
}
//---------------------------------------------------------------------
//
//---------------------------------------------------------------------
DBJ.IE = function () {
	return ((navigator.appVersion.indexOf("MSIE") > 0) && (parseInt(navigator.appVersion) >= 4)) ;
}
//---------------------------------------------------------------------
function test()
{
$("#dbjimg").remove() ;
$("<img id='dbjimg' src='http://dbj.org/a/a1/ibi.jpg'></img>").appendTo("body");
$("#dbjimg").css({position : "absolute", zindex : "99", top : 10, left : 10 }) ;
$("#dbjimg").bind("click", function(e){ // var str = "( " + e.pageX + ", " + e.pageY + " )";
      top.alert("DBJIMG readyState : " + this.readyState);
    });

DBJ.center($("#dbjimg").get(0));
}
//---------------------------------------------------------------------
// $("img").remove() ;
test() ;
//---------------------------------------------------------------------
/*
undefined
*/