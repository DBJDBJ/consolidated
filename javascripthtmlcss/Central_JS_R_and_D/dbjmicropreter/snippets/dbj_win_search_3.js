
function qry2 ()
{
var sql = "SELECT TOP 10 System.Title, System.ItemNameDisplay FROM SYSTEMINDEX WHERE SCOPE='file:m:/audio' AND (System.ItemPathDisplay LIKE '%mp3' OR System.ItemPathDisplay LIKE '%mp4')" ,
RS, arr = [] ;
RS = ADOVBS( "File Name=e:/sqlce/search.udl", sql )
RS = new VBArray(RS);
 return RS.toArray().join("\n");
}
qry2()