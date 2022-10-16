' -----------------------------------------------------------------------
Function DisplayCustomError(strMessage)
	'Display custom message and information from VBScript Err object.
	dim strError : strError = VbCrLf & strMessage & VbCrLf & _
	  "Number (dec) : " & Err.Number & VbCrLf & _
	  "Number (hex) : &H" & Hex(Err.Number) & VbCrLf & _
	  "Description  : " & Err.Description & VbCrLf & _
	  "Source       : " & Err.Source
	Err.Clear
	DisplayCustomError = MsgBox(strError,16,"DBJ VBScript Error Box")
End Function
' ------------------------------------------------------------------------
Function mBox(m_,n,t_)
	On Error Resume Next
			dim x : x=MsgBox(m_,n, t_)
			If Err = 0 Then
					mBox = x
			Else
					dim  strMessage : strMessage = "VBS ERROR: Inside mBox()"
					mBox = DisplayCustomError(strMessage)
			End If
End Function
