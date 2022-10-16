
var st = new String();
$("#dbj_meta").remove();
$("head").prepend("<?dbjmeta id=\"dbj_meta\" date='$Date: 22/12/09 17:10 $' />")
$("head").each( 
function () { 
  st = (this.outerHTML); 
} 
)
st