
function qry2 ()
{
var sql = "SELECT TOP 10 System.ItemPathDisplay FROM SYSTEMINDEX WHERE SCOPE='file:c:/dbj' AND (System.ItemPathDisplay LIKE '%js' OR System.ItemPathDisplay LIKE '%txt')" ,
RS, arr = [] ;
RS = ADOVBS( "File Name=e:/sqlce/search.udl", sql )
RS = new VBArray(RS);
 return RS.toArray().join("\n");
}
qry2()
/*
C:\dbj\My_Projects\JS\dbjmicropreter\snippets\streaming_pattern.js
C:\dbj\My_Projects\JS\dbjmicropreter\snippets\dbj-jquery-primer.js
C:\dbj\My_Projects\JS\dbjmicropreter\snippets\dbj_selector_ie.js
C:\dbj\My_Projects\JS\dbjmicropreter\snippets\dbj-jq-override.js
C:\dbj\My_Projects\JS\dbjmicropreter\ado\dbj2.js
C:\dbj\My_Projects\JS\dbjmicropreter\ado\winsearch.js
C:\dbj\My_Projects\JS\dbjmicropreter\ado\dbj.ado.js
C:\dbj\My_Projects\JS\dbjmicropreter\snippets\dbj_win_search_2.js
C:\dbj\BOOKS\How Linux Works - What Every Super-User Should Know (2004) - allbooksfree.tk\Read Me.txt
C:\dbj\x\projects\fm#\source\dbjt\obj\Release\dbj_ept.csproj.FileListAbsolute.txt
*/