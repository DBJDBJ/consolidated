
var st = new String();
$("#dbj_meta").remove();
$("head").prepend("<meta id='dbj_meta' ></meta>")
$("#dbj_meta").each( 
function () { 
  st = (this.outerHTML); 
} 
)
st
/*

<META id=dbj_meta>
*/