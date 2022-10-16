<%@ Page Language="VB" AutoEventWireup="false" %>
<%@ Import Namespace="System.Data" %>
<%@ Import Namespace="System.Data.OleDb" %>
<script language="VB" runat="server">
  sub Page_Load(sender as Object, e as EventArgs)
    'Create a connection string
        Dim connString As String
        connString = "Provider=Search.CollatorDSO.1;Extended Properties='Application=Windows';"
        ' connString = "PROVIDER=Microsoft.Jet.OLEDB.4.0;DATA SOURCE=C:\Inetpub\wwwrot\Projects.mdb;"
    
    'Open a connection
    Dim objConnection as OleDbConnection
    objConnection = New OleDbConnection(connString)
    objConnection.Open()
    
    'Specify the SQL string
        Dim strSQL As String = "SELECT TOP 10 System.ItemPathDisplay FROM SYSTEMINDEX WHERE SCOPE='file:c:/dbj' AND (System.ItemPathDisplay LIKE '%js' OR System.ItemPathDisplay LIKE '%txt')"

        'Create a command object
    Dim objCommand as OleDbCommand
    objCommand = New OleDbCommand(strSQL, objConnection)

    'Get a datareader
    Dim objDataReader as OleDbDataReader
    objDataReader = objCommand.ExecuteReader(CommandBehavior.CloseConnection)

    'Do the DataBinding
    dgResults.DataSource = objDataReader
    dgResults.DataBind()    
    
    'Close the datareader/db connection
    objDataReader.Close()
  end sub
</script> 

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>DBJ*ADO*SEarch</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
<asp:DataGrid id="dgResults" runat="server" BorderStyle="Solid" BorderWidth="12px" Caption="Naslov" Font-Names="Verdana,Arial" />
    </div>
    </form>
</body>
</html>