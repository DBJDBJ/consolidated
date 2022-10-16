
s = [] ;

var preconditions = function ( selector, context ) 
{
    s.push("{0} precondtions() for selector: {1}, context {2}".format(arguments.caler, selector,context)) ;
},

postconditions = function ( result ) {
    s.push("{0} postcondtions() for result: {1}".format(arguments.caler, ""+result)) ;
return result ;
} ;


if ( window.my_jq_init_ === undefined  ) {

 var oldInit = jQuery.prototype.init;

 jQuery.prototype.init = function( selector, context ){

   preconditions.call( this, selector, context ) ;
       
   return postconditions.call( this, oldInit.call( this,  selector, context ) ) ;
 };

 jQuery.prototype.init.prototype = jQuery.prototype;

window.my_jq_init_ = true ;
}

jq = $()

s.join("\n") ;
/*
{0} precondtions() for selector: {1}, context {2}
{0} postcondtions() for result: [object Object]
*/