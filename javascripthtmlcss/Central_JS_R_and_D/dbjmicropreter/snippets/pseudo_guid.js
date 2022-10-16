

function Guid() {  }  
Guid.empty = "00000000-0000-0000-0000-000000000000";    
Guid.make = function() {        
     return (Guid.four() + 
             Guid.four() + "-" + 
             Guid.four() + "-" + 
             Guid.four() + "-" + 
             Guid.four() + "-" + 
             Guid.four() + 
             Guid.four() + 
             Guid.four());
    };

Guid.four = function () 
{
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).toUpperCase();
}

Guid.make()
/*
3368F1CC-73DC-90CA-347F-A0284F0F676D
*/