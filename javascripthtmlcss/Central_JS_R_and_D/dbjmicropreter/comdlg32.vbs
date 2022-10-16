'-------------------------------------------------------------------------
' A script to demonstrate some of the features available in COMDLG32.OCX
' Written/Googled/assembled by Rob van der Woude
' http://www.robvanderwoude.com

Option Explicit

Dim blnBold, blnItal, blnStrk, blnUndl
Dim intColor, intSize
Dim objDialog, wshShell
Dim strAttrib, strFile, strFont, strPrint

Const OFN_HIDEREADONLY = &H4
Const OFN_CREATEPROMPT = &H2000
Const OFN_EXPLORER = &H80000
Const OFN_LONGNAMES = &H200000

On Error Resume Next
Set objDialog = CreateObject( "MSComDlg.CommonDialog" )
If Err Then
	MsgBox Err.Description & vbCrLf & vbCrLf & "This script requires COMDLG32.OCX." & vbCrLf & vbCrLf & "Please make sure it is installed and registered.", , "COMDLG32 not registered"
End If

' COMDLG32 About box
objDialog.AboutBox

' Color Picker dialog
objDialog.ShowColor
intColor = objDialog.Color
If Err Then
	WScript.Echo "Selected color   : -- " & Err.Description & " --"
Else
	WScript.Echo "Selected color   : " & CStr( intColor )
End If


' Font Select dialog
objDialog.ShowFont
strFont = objDialog.FontName
intSize = objDialog.FontSize
blnBold = objDialog.FontBold
blnItal = objDialog.FontItalic
blnStrk = objDialog.FontStrikeThru
blnUndl = objDialog.FontUnderLine

strAttrib = ""
If blnBold Then strAttrib = " bold"
If blnItal Then strAttrib = strAttrib & " italic"
If blnStrk Then strAttrib = strAttrib & " strikethrough"
If blnUndl Then strAttrib = strAttrib & " underlined"

If strFont = "" Then
	If Err Then
		WScript.Echo "Selected font    : -- " & Err.Description & " --"
	Else
		WScript.Echo "Selected font    : -- None selected --"
	End If
Else
	WScript.Echo "Selected font    : " & strFont & " " & intSize & "pt" & strAttrib
End If

' Help dialog
' Handles .HLP files only
' May require downloading/installing WinHlp32.exe on Vista and later Windows versions
' http://support.microsoft.com/kb/917607
' The help file, path and keyword used in this sample may not be available on your computer
objDialog.HelpFile = "C:\Program Files (x86)\Common Files\Borland Shared\BDE\BDEADMIN.HLP"
objDialog.HelpKey = "ODBC"
objDialog.HelpCommand = 3
objDialog.ShowHelp

' Open File dialog
Set wshShell = WScript.CreateObject( "Wscript.Shell" )
strFile = String( 260, Chr(0) )
objDialog.MaxFileSize = 260
objDialog.Flags = OFN_EXPLORER Or OFN_LONGNAMES Or OFN_CREATEPROMPT Or OFN_HIDEREADONLY
objDialog.InitDir = wshShell.CurrentDirectory
objDialog.DefaultExt = "vbs"
objDialog.Filter = "VBScript files|*.vbs"
objDialog.ShowOpen
strFile = objDialog.FileName
If strFile = "" Then
	If Err Then
		WScript.Echo "Selected file    : -- " & Err.Description & " --"
	Else
		WScript.Echo "Selected file    : -- None selected --"
	End If
Else
	WScript.Echo "Selected file    : " & strFile
End If
Set wshShell = Nothing

' Print dialog
' There aren't many properties we can read this way
objDialog.ShowPrinter
If objDialog.Orientation = 0 Then
	WScript.Echo "Page orientation : Landscape"
Else
	WScript.Echo "Page orientation : Portrait"
End If

' File Save dialog
objDialog.ShowSave
strFile = objDialog.FileName
If strFile = "" Then
	If Err Then
		WScript.Echo "File saved as    : -- " & Err.Description & " --"
	Else
		WScript.Echo "File saved as    : -- Cancelled --"
	End If
Else
	WScript.Echo "File saved as    : " & strFile
End If

' Done
Set objDialog = Nothing
