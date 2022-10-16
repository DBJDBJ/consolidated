
function maximize()
{
window.resizeTo(window.screen.availWidth, window.screen.availHeight) ;
window.moveTo(0,0);
}
//------------------------------------------------------------------------------
function anima( what, speed, color )
{
function FF ( color_ ){$(this).css("backgroundColor", color_ ) ;}
if ( speed == null ) speed = 1000 ;
if ( color == null ) color = "gold" ;
$(what).each( function () {
$(this).fadeTo(speed ,0.25, FF(color) ).fadeTo(speed ,1 ) ;
}) ;
}
//------------------------------------------------------------------------------
function show_toggle( what_ )
{
$(what_).each( function () {
$(this).hide(5000);
$(this).show(5000);
}) ;
}
//------------------------------------------------------------------------------
show_toggle("#toolbar");