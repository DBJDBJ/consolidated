
/*
 set the shared property, made by another process 
 -------------------------------------------------------- 
 (c) 2001-2006 by DBJSystems Ltd (mailto:dbj@dbj.org)
*/
function set_shared_property ( grp_name, index, value_ )
{
var spm = new ActiveXObject("MTxSpm.SharedPropertyGroupManager");
var spg = spm.CreatePropertyGroup(grp_name,0,0,false);
// just to prove group is made and exists
spg = spm.Group(grp_name);
var spt = spg.CreatePropertyByPosition( index, true ) ;
spt.Value = value_ ;
return spt ;
}

set_shared_property("dbj",1,"shared property at index 1");