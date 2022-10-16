
/*
DBJ*MicroPreter(tm)  -- Lightweight JavaScript Interpreter 
 -------------------------------------------------------- 
 (c) 2001-2006 by DBJSystems Ltd (mailto:dbj@dbj.org)
*/
var spm = new ActiveXObject("MTxSpm.SharedPropertyGroupManager");
var spg = spm.CreatePropertyGroup("dbj",0,0,false);
// just to prove it exists
spg = spm.Group("dbj");
var spt = spg.CreatePropertyByPosition( 1, false ) ;
spt.Value = "Hello world!"
// get it again
spt = spg.PropertyByPosition(1);
spt.Value
/*
Hello world!
*/