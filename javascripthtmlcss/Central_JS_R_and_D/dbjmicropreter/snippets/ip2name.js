var locator = new ActiveXObject("WbemScripting.SWbemLocator");
var service = locator.ConnectServer(
"127.0.0.1", "root\\cimv2", "", "", "", ""
);

var items = service.ExecQuery("Select * from Win32_ComputerSystem");

var e = new Enumerator(items);
e.moveFirst();
while (e.atEnd() == false)
{
  var cmp = e.item(); alert(cmp.Name);
}
/*
Error 
Number : 16388
Description : 
*/