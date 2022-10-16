
Function ADOVBS ( con_str, qry_str )
	'Open the database connection
	Set objConn = CreateObject("ADODB.Connection")
	objConn.Open con_str
	'Create the recordset object
	Set objRS = CreateObject("ADODB.Recordset")
	'Open the recordset
	objRS.Open qry_str, objConn ' , adOpenForwardOnly, adLockReadOnly
	'Output the data
	ADOVBS = objRS.GetRows()
	'Tidy up the objects
	objRS.Close
	objConn.Close
	Set objConn = Nothing
	Set objRS = Nothing
End Function