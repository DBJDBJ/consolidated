/*
navigator.userAgent :
Mozilla/4.0 (
compatible; 
MSIE 7.0; 
Windows NT 6.1; 
WOW64; 
Trident/4.0; 
SLCC2; 
.NET CLR 2.0.50727; 
.NET CLR 3.5.30729; 
.NET CLR 3.0.30729; 
Media Center PC 6.0
)
*/
  // overwrite document.createElement
  var _createElement = document.createElement;
  document.createElement = function(tag) {
    var element = _createElement(tag);
    element.innerHTML = '<h1>Hello!</h1>';
    return element;
  };

document.createElement("DIV").outerHTML
/*
<DIV></DIV>
*/
document.createElement.constructor + ""
/*

function Function() {
    [native code]
}

*/