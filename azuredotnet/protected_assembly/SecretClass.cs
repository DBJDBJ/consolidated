using System;
using System.Reflection;
using System.Runtime.CompilerServices;

// if bellow assembly attribute does not exist compiler will error:
// 2 > C:\Users\User\source\repos\testing_protected_assembly\Program.cs(9, 55, 9, 66): error CS0122: 'SecretClass' is inaccessible due to its protection level
// 2>Done building project "testing_protected_assembly.csproj" -- FAILED.

[assembly: InternalsVisibleTo("testing_protected_assembly")]

namespace protected_assembly
{
    internal sealed class SecretClass
    {
        public string name()
        {
            return "protected_assembly.SecretClass.name()";
        }
    }
}
