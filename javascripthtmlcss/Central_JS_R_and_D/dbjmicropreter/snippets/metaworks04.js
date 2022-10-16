
var st = new String();
$("#dbj_meta").remove();
$("head").prepend("<?XML:NAMESPACE PREFIX = dbj /><dbj:root xmlns=dbj:'dbj.org.schema' ></dbj:root>")
$("head").each( 
function () { 
  st = (this.outerHTML); 
} 
)
st