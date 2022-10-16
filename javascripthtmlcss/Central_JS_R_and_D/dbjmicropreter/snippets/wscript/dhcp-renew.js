
try {
strComputer = "." 
var objWMIService = GetObject("winmgmts:\\\\" + strComputer + "\\root\\CIMV2") 
// Obtain the definition of the class.
var objShare = objWMIService.Get("Win32_NetworkAdapterConfiguration")

// Execute the method and obtain the return status.
// The OutParameters object in objOutParams
// is created by the provider.
var objOutParams = objWMIService.ExecMethod("Win32_NetworkAdapterConfiguration", "ReleaseDHCPLeaseAll")
var objOutParams = objWMIService.ExecMethod("Win32_NetworkAdapterConfiguration", "RenewDHCPLeaseAll")

// List OutParams
var s = "Out Parameters: " ;
s += "ReturnValue: " + objOutParams.ReturnValue
  WScript.echo("DBJ*DHCP Renewal finsihed OK. \n\nStatus:\n" + s ) ;
} catch (x) {
   WScript.echo("ERROR!\n"+x);
}
/*
TypeError 
Number : 5009
Description : 'WScript' is undefined
*/