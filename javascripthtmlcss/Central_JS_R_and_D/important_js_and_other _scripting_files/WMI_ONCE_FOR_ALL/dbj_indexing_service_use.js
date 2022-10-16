ISAdmin = new ActiveXObject("Microsoft.ISAdm")
if ( ! ISAdmin.IsRunning() ) ISAdmin.Start();
// var CatAdm = new ISAdmin.GetCatalog( );
// var ScopeAdm = ISAdmin.GetScope( );
var objQuery = new ActiveXObject("IXSSO.Query");
var objUtility = new ActiveXObject("IXSSO.Util");
// Create a sequential recordset
var SrchStr = "ISAAC";
objQuery.Catalog = "system"
objQuery.Query = "$contents '" + SrchStr + "'";
objQuery.Columns = "DocTitle, VPath, Characterization, HitCount" ;
var objRs = objQuery.CreateRecordset("sequential") ;
// "Indexing Service on the machine: " + ISAdmin.MachineName + ( ISAdmin.IsRunning() ? ", is running" : ", is not running") 

var R = new String();

objRs.MoveFirst();

  while (objRs.EOF != true) 
  {
   R += "\n" + (objRs(0) + "\t" + objRs(1) + "\t" + objRs(2) + "\t" + objRs(3) );
    objRs.MoveNext();
  }

  objRs.Close
  objRs = null;
// output
R
/*

null	null	null	1
Proposal	null	null	34
Proposal	null	null	34
Proposal	null	null	13
null	null	null	1
null	null	null	1
S5Q7	null	null	4
DFID Tech Spec	null	null	5
Memo	null	null	4
null	null	null	2
*/