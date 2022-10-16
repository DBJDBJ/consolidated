
// selector works
$("dbj\\:root").remove();
// selector works
$("head").prepend(
"<?XML:NAMESPACE PREFIX = dbj /><dbj:root xmlns=dbj:'dbj.org.schema' ></dbj:root>"
);
// selector does not work, this.length == 0 
$("dbj:\\root").append("<dbj:data>Hello world!</dbj:data>");
// works too
$("dbj\\:root").each( function () { alert(this.outerHTML); } );