namespace dbjsharp;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

using static System.Net.Mime.MediaTypeNames;

// use like this:
// using static Program_context;
// after which you can just use the method names from here
// without a class name and dot in front

class Program_context
{
    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static string Whoami([CallerMemberName] string ? caller_name = null)
    {
        if (string.IsNullOrEmpty(caller_name))
            return "unknown";
        if (string.IsNullOrWhiteSpace(caller_name))
            return "unknown";
        return caller_name;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static void Assert( bool condition_)
    {
        System.Diagnostics.Debug.Assert(condition_);
    }


    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static string Name()
    {
        return Assembly.GetExecutingAssembly().GetName().FullName;
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static void Writeln(string? payload = null)
    {
        Console.WriteLine(payload);
    }
    
/*
 * string test = "Testing 1-2-3";

// convert string to stream
byte[] byteArray = Encoding.ASCII.GetBytes(test);
MemoryStream stream = new MemoryStream(byteArray);

// convert stream to string
StreamReader reader = new StreamReader(stream);
string text = reader.ReadToEnd();
 */
    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static System.IO.Stream ToStream ( string sval_ )
    {
        byte[] byteArray = Encoding.ASCII.GetBytes(sval_);
        return new MemoryStream(byteArray);
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static string ToString(System.IO.Stream sval_)
    {
        StreamReader reader = new StreamReader(sval_);
        return reader.ReadToEnd();
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static string ToUTF8(string sval_)
    {
        byte[] bytes = Encoding.Default.GetBytes(sval_);
        return Encoding.UTF8.GetString(bytes);
    }

} // Program_context

