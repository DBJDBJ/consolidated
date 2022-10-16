/*
 use the shared property, made by another process
 -------------------------------------------------------- 
 (c) 2001-2006 by DBJSystems Ltd (mailto:dbj@dbj.org)
*/
function get_shared_property( grp_name, index )
{
var created = new Array( true ) ;
var spm = new ActiveXObject("MTxSpm.SharedPropertyGroupManager");
spg = spm.CreatePropertyGroup(grp_name,0,0,created );
alert( "Created = " + created[0] + "\nspg = " + (! spg ? "NULL" : spg ) )
spt = spg.PropertyByPosition( index );
return spt.Value
}

var prop_val = get_shared_property("dbj",1) ;

alert( "Shared property from group 'dbj' stored by index '1':\n\n" + prop_val ) ;