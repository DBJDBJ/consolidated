//
(function(){
var oPopup = window.createPopup();
var $display = $("#display") ;
var popy_win = null ;
window.popy = function(content) {
    var oPopBody = oPopup.document.body;
    oPopBody.style.backgroundColor = "lightyellow";
    oPopBody.style.border = "solid black 1px";
    oPopBody.style.overflow = "auto";
    oPopBody.innerHTML = content ;
    oPopup.show(0, 0, 8+$display.width(), 8+$display.height(), $display[0]);
}
})();
//
function d2h(d) {return d.toString(16);}
function h2d(h) {return parseInt(h,16);}
//
function h2c(d) { try { return "\\u" + (""+d).lpad(4,"0"); } catch(x) { return "!"; } }
// 
function n2u(num) { 
num = num.toString(16); 
while(num.length < 3) num = '0' + num; 
return ( "&#" + num + ";" ); 
} 
function unitable() {
var s="<table border='1' width='100%'><tr>";
for ( var j = 0xF ; j < 0xFFFF; j++ )
{
 if ( j % 10 == 0 ) s += "</tr><tr>" ;
 s += "<td>" + d2h(j) + " : " + n2u(j) + "</td>" ;
}
return (s+"</tr></table>");
}

s = d2c(2964) ;