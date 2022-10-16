//-------------------------------------------------------------------------------------------
function main ()
{
var line = "\n__________________________________" ;
var ad_path = "WinNT://localhost" ;
var global_prop_counter = 0
var adOBJ = GetObject(ad_path);
 print( "Examination of : " + ad_path ) ;
 print( line + "\nProperties:" + line ) ;
 show_props( adOBJ.Class ) ;
 var ad_sema = GetObject(adOBJ.Schema);
 show_props( ad_sema ) ;
 print( line + "\nMandatory attributes:" + line ) ;
 show_props( ad_sema.MandatoryProperties ) ;
 foreach ( adOBJ.MandatoryProperties, enumProperties )
 print( line + "\nOptional attributes:" + line );
 foreach ( adOBJ.OptionalProperties, enumProperties )
 print_buffer_flush() ;
}
//-------------------------------------------------------------------------------------------
function enumProperties ( strAttribute )
{
 global_prop_counter += 1
 print( global_prop_counter + "\t" + strAttribute );
 var objAttribute = ad_sema.GetObject("Property", strAttribute)
 print( " (Syntax: " + objAttribute.Syntax + ")")
 if( objAttribute.MultiValued )
 print(" Multivalued");
 else
 print(" Single-valued");
}
//-------------------------------------------------------------------------------------------
function show_props ( ad_object, x )
{
try {
 if ( ! ad_object) return ;
print( "Name\t:\t" + ad_object.Name + 
"\t, Class\t:\t" + ad_object.Class + 
"\t, AD Path\t:\t" + ad_object.AdsPath
 ) ;
} catch ( x) {
 print( "EXCEPTION\n" + x.message ) ;
}
}
//-------------------------------------------------------------------------------------------
function foreach ( collection, FP, x )
{
 try {
 if ( ! collection ) return ;
 for ( var E = new Enumerator(collection) ; ! E.atEnd() ; E.moveNext() )
 {
 FP( E.item() ) ;
 }
 } catch ( x) {
 print( "EXCEPTION\n" + x.message ) ;
 try {
 if ( (collection != null) && (typeof(collection.constructor) != "undefined" ))
 print( "\nCollection argument is\t:\t" + collection.constructor ) ;
 else 
print( "\nCollection argument is\t:\tNULL") ;
 }catch (x) {}
 }
}
//-------------------------------------------------------------------------------------------
var print_buffer_ = new String() ;
function print_buffer_flush(){ WScript.Echo( print_buffer_ ) ;}
function print( msg_ ) { print_buffer_ += "\n" + msg_ ; }
// 
main() ; // do it

