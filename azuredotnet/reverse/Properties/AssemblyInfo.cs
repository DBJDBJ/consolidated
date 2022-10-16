using System.Reflection;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
//The request is placed at the assembly level.
using System.Security.Permissions;
[assembly: System.Security.AllowPartiallyTrustedCallers()]
[assembly: FileIOPermission(SecurityAction.RequestMinimum, Unrestricted = true)]

// General Information about an assembly is controlled through the following 
// set of attributes. Change these attribute values to modify the information
// associated with an assembly.
[assembly: AssemblyTitle("dbj*Reverser")]
[assembly: AssemblyDescription("DBJ's text file Reversing Test Unit and iteration 0 of a solution")]
[assembly: AssemblyConfiguration("")]
[assembly: AssemblyCompany("DBJ.ORG")]
[assembly: AssemblyProduct("dbj*Reverser")]
[assembly: AssemblyCopyright("Copyright © DBJ.ORG 2010")]
[assembly: AssemblyTrademark("")]
[assembly: AssemblyCulture("")]

// Setting ComVisible to false makes the types in this assembly not visible 
// to COM componenets.  If you need to access a type in this assembly from 
// COM, set the ComVisible attribute to true on that type.
[assembly: ComVisible(false)]

// The following GUID is for the ID of the typelib if this project is exposed to COM
[assembly: Guid("7ec92c8e-2e16-447d-94f5-07a0ac07ad9d")]

// Version information for an assembly consists of the following four values:
//
//      Major Version
//      Minor Version 
//      Build Number
//      Revision
//
// You can specify all the values or you can default the Revision and Build Numbers 
// by using the '*' as shown below:
[assembly: AssemblyVersion("1.2.0.0")]
[assembly: AssemblyFileVersion("1.2.0.0")]

[assembly: AssemblyKeyFileAttribute(@"..\..\dbj_org.snk")]

