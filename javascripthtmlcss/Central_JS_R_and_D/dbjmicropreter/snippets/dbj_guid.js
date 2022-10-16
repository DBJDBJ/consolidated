
(function () {
var Guid = {  
empty : "00000000-0000-0000-0000-000000000000",
make : function() {        
     return (Guid.four() + 
             Guid.four() + "-" + 
             Guid.four() + "-" + 
             Guid.four() + "-" + 
             Guid.four() + "-" + 
             Guid.four() + 
             Guid.four() + 
             Guid.four());
    },
four : function () {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).toUpperCase();
}
} ;

GUID = function () { return Guid.make(); }
})() ;
/*@cc_on @if ( @_win32 )
GUID = function () 
{
    try
    {
        var x = new ActiveXObject("Scriptlet.TypeLib");
    return (x.GUID);
    }
    catch (e)
    {
    return ("error creating GUID");
    }
}
@end @*/
GUID