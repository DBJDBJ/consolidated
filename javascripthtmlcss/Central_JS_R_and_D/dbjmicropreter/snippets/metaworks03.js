
var st = new String();
$("#dbj_meta").remove();
$("head").prepend("<dbj:root xmlns=dbj:'dbj.org.schema' ></root>")
$("head").each( 
function () { 
  st = (this.outerHTML); 
} 
)
st