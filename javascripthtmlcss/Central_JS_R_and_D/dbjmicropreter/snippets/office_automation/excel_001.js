var sretja = function ( life )
{
   life = life || {} ;
 var o = Math.abs(life.ocekivano) || 0, d =  Math.abs(life.dobijeno) || 0 ;

   if ( o === d ) return sretja.mid ; //ni tamo ni vamo
   if ( o === 0 && d > 0 ) return sretja.max ;
   if ( d === 0 && o > 0 ) return sretja.min ;
   
   if ( o > d ) return sretja.min ;
   return sretja.max ;
}
sretja.mid = "Ni tamo ni vamo" ;
sretja.max = "Sretjko" ;
sretja.min = "Tuzanko" ;

sretja({ ocekivano: 0, dobijeno: 20})

var state = { init : 0, closed : 1, error: 0xFF }

var XL = {
  app : (new ActiveXObject("excel.application")),
  sht : (new ActiveXObject("excel.sheet")),
  wbk : null , // current workbook
  state : null ,
  init : function (workbook_name) { XL.app.Visible = true; 
              if ( workbook_name ) 
                         XL.wbk = XL.app.Workbooks.Open(workbook_name,3) ;
              else
                         XL.wbk = XL.app.Workbooks.Add();
              XL.state = state.init ; return XL; 
         },
  cell : function (val, R, C ) {
        XL.sht.ActiveSheet.Cells(R || 1, C || 1).Value = val || ( R+":"+C ) ; return XL;
  },
  done : function () {
     XL.app.Quit();
     XL.app = XL.sht = null ;
     XL.state = state.closed ;
     return null ;
  }
} ;

XL.init().cell("Hello",1,1).done() ;
/*
TypeError 
Number : 5002
Description : Function expected
Stack : TypeError: Function expected
   at cell (eval code:34:9)
   at eval code (eval code:44:1)
   at dbj_eval (file:///D:/users/korisnik/documents/GitHub/JS/dbjmicropreter/dbjs.js:336:3)
   at Anonymous function (file:///D:/users/korisnik/documents/GitHub/JS/dbjmicropreter/dbjs.js:345:5)
   at dispatch (http://code.jquery.com/jquery-git.js:5107:6)
   at handle (http://code.jquery.com/jquery-git.js:4777:5)
*/