                
var ADODB = {
    Connection : function () {
       var object_ = new ActiveXObject("ADODB.Connection") ;
       return (function () { return object_ ; })();
    },
    Recordset: function () {
       var object_ = new ActiveXObject("ADODB.Recordset") ;
       return (function () { return object_ ; })();
    }
} 
//
var statement_builder = {
    single : function ( propname , scope, top ) {
        return (function () {
           return "SELECT TOP {0}  System.{1} FROM SYSTEMINDEX WHERE SCOPE='file:{2}'".format(top||10, propname, scope || "c:" ) ;
        })();
    }
}
//
function fsql ( objConnection,objRecordSet ) 
{
var sql = "SELECT TOP 10 System.ItemPathDisplay FROM SYSTEMINDEX WHERE SCOPE='file:c:/dbj' AND (System.ItemPathDisplay LIKE '%js' OR System.ItemPathDisplay LIKE '%txt')" ;
var arr = [], propname = ["ItemPathDisplay", "FileName", "FileExtension" ], scope="c:/dbj"  ;
try {
objConnection.Open("Provider=Search.CollatorDSO;Extended Properties='Application=Windows';");
objRecordSet.Open( statement_builder.single(propname[1],scope) , objConnection );
objRecordSet.MoveFirst() ;
  do  { 
        arr.push(objRecordSet.Fields.Item("System.{0}".format(propname[1])).Value);
        objRecordSet.MoveNext();
  } while ( false === objRecordSet.EOF ) ;  
} catch (x) {
   arr.push(""+x) ;
} finally {
objRecordSet.Close() ; objRecordSet = null ;
objConnection.Close(); objConnection = null;
}
 return arr.join("\n");
}

fsql(ADODB.Connection(), ADODB.Recordset());