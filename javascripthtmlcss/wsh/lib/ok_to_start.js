//---------------------------------------------------------------------------
function ok_to_start( main_q , exit_msg )
{
var WshShell = WScript.CreateObject("WScript.Shell") ; 
var yes = 6 ;
var no = 7 ;
var title = "Starting " + WScript.ScriptName  ;
//
// set defaults if no args given
if ( null == main_q ) main_q = "Is it OK to proceed?" ;
if ( null == exit_msg ) exit_msg = "Answer was 'NO'\nExiting " + WScript.ScriptName + " in 5 seconds..." ;
//
	// wait 60 seconds for the user to notice this dialogue
	if ( no == WshShell.Popup( main_q, 60, title, 32 + 4 ) ) 
	{
	WshShell.Popup( exit_msg, 5, title, 48 + 0 ) ;
	WScript.Quit() ;
	}
}