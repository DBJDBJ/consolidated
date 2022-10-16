/// <reference path="../jq132-vsdoc.js" />
//---------------------------------------------------------------------
if ( typeof(DBJ) == 'undefined' ) {
//---------------------------------------------------------------------
//
var DBJ = new Object() ;
//
// parentNode is browser universal, not parentElement
// knowing this we will not use jQuery here and thus 
// cut the dependancy on yet another external library.
//
DBJ.center = function(oNode){   var oParent=oNode.parentNode;
   oNode.style.left = oParent.offsetWidth/2 - oNode.offsetWidth/2;
   oNode.style.top = oParent.offsetHeight/2 - oNode.offsetHeight/2;
}
//
DBJ.right = function (oNode){   var oParent=oNode.parentNode;
   oNode.style.left = oParent.offsetWidth - oNode.offsetWidth ;
}
//
DBJ.left = function (oNode){   oNode.style.left = 0 ;}
//
DBJ.top = function (oNode){   oNode.style.top = 0 ;}
//
DBJ.bottom = function (oNode){
   var oParent=oNode.parentNode;
   oNode.style.top = oParent.offsetHeight - oNode.offsetHeight ;
}
//---------------------------------------------------------------------
DBJ.home = function ()
{
var		L = new String(window.location.href) ; 
		L = L.split("/") ;
// gives an array like this : http:,,dbjnb,tipox_Local,Components,test_dbj.htm 
		return L[0]+"//"+L[2]+"/"+L[3]+"/" ;
}
//---------------------------------------------------------------------
DBJ.page_args = function ()
{
var		L = new String(window.location.href) ; 
		L = L.split("?") ;
		if ( L.length < 2 ) return null ;
		return L[1].split("&");
}
//---------------------------------------------------------------------
DBJ.timers = new Array() ;
// clearing every second
DBJ.interval_timer = window.setInterval( 
function ( O ) {  while ( O = DBJ.timers.pop()) { if ( typeof(O) == 'undefined' ) return ; window.clearTimeout( O ) ; } } 
, 1000
);
// spawn delay is 1 microsecond
DBJ.spawn = function ( FUN ) 
{
    DBJ.timers.push( window.setTimeout(FUN,1) );
}
DBJ.toString = function() { return "DBJ*MicroPreter"; };
DBJ.print_= function(s_) {
        var rez = "";
        // is this a run-time Error from the script engine
        if (s_ instanceof Error) {
            rez = "<br/>" + s_.name + " "
            + "<br/>Number : " + (s_.number & 0xFFFF)
            + "<br/>Description : " + s_.description;
        } else
            rez = s_;
        document.getElementsByTagName("body").insertAdjacentHTML("afterbegin", "<li>" + rez + "</li>") ; 
    };
DBJ.print2 = function(s) { var tid = setTimeout(function() { clearTimeout(tid); DBJ.print_(s); }, 1); }
//---------------------------------------------------------------------
} // if 
//---------------------------------------------------------------------
/// <reference path="dbjorg.js" />
