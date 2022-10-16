
// window.jQuery = window.$ = function () {};

$.extend( {
    head : function ( selector ) {

         if ( ! $.$head ) { 
               var head_  = document.getElementsByTagName("head")[0] ;
                $.$head = $( head_ ) ;
                $.$head.dc( head_ ) ; // inital default context
         }

         return selector ? $.$head.find( selector, $.$head.dc() ) : $.$head ;
    },
    body : function ( selector ) {

         if ( ! $.$body ) { 
                $.$body = $( document.body ) ;
                $.$.body.dc( document.body ) ;  // initial default context
         }
                return selector ? $.$body.find( selector, $.$body.dc() ) : $.$body ;
    }
}) ;

$.fn.extend({
   dc : function () {
       var dcn = "default_context" ;
       if ( arguments.length < 1 ) return this[dcn] ;

       this.context = this[dcn] =  jQuery.find( arguments[0])[0] ;

       return this ;
   }
})

jQuery.fn.$
/*
function(E,H){E=E||document;if(E.nodeType){this[0]=E;this.length=1;this.context=E;return this}if(typeof E==="string"){var G=D.exec(E);if(G&&(G[1]||!H)){if(G[1]){E=o.clean([G[1]],H)}else{var I=document.getElementById(G[3]);if(I&&I.id!=G[3]){return o().find(E)}var F=o(I||[]);F.context=document;F.selector=E;return F}}else{return o(H).find(E)}}else{if(o.isFunction(E)){return o(document).ready(E)}}if(E.selector&&E.context){this.selector=E.selector;this.context=E.context}return this.setArray(o.isArray(E)?E:o.makeArray(E))}
*/

/*
undefined
*/