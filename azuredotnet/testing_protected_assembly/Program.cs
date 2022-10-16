using System;

namespace testing_protected_assembly
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine( new protected_assembly.SecretClass().name() );
        }
    }
}
