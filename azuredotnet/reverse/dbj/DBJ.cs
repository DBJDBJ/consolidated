/*
 * MIT (c) 2010 by DBJ.ORG
 */
namespace tdd
{
using System;
using System.Collections.Generic;
using System.Text;

    class DBJ
    {
        public delegate T Func<T>(); // since we are using .NET 2.0
        // generic repeater declaration
        delegate T [] Repeater<T>( T seed_, int count_ );

        /// <summary>
        /// repeat seed string N times
        /// </summary>
        /// <param name="seed_">string to be repated</param>
        /// <param name="N_">Optional. If not given default N is 0xFF</param>
        /// <returns></returns>
        public static string Repeat( string seed_, params int [] N_ ) {

            Repeater<string> repeater_ = (s, c) => { 
                string [] sb = new string[c] ;
                while ( 0 != c--) { sb[c] = s ; } return sb;
            };
            return  string.Join("", repeater_(seed_, N_.Length > 0 ? N_[0] : 0xFF )) ; 
        }
/*
    This implementations does not handle UTF-16 correctly
    (which is how .NET strings are encoded), UTF-16 characters are represented as two C# chars, 
    When the string is reversed, the order of these two chars has to be preserved.
    There are solutions which are free and which support UTF-16 string reversing
 
    NOTE: this is also *much* faster than LINQ solution, *especially* for a short(er) strings
    // LINQ
    public string Reverse(string text)
    {
        return new string(text.ToCharArray().Reverse().ToArray());
    }
 */
        public static string Reverse(string in_)
        {
            char[] chars = in_.ToCharArray();
            System.Array.Reverse(chars);
            return new string(chars);
        }

        /// <summary>
        /// (probably ) The quickest way to create output file by reversing the content of the input file.
        /// IMPORTANT! This version works by default on ASCII files 
        /// </summary>
        /// <param name="fileToBeReversed">path top the input</param>
        /// <param name="newFileToBeCreated">path to the output</param>
        public static void ReverseSmallFileContents(string fileToBeReversed, string newFileToBeCreated)
        {
            Encoding encoder = Encoding.ASCII;
            string text = System.IO.File.ReadAllText(fileToBeReversed, encoder);
            char[] chars = text.ToCharArray();
            Array.Reverse(chars);
            System.IO.File.WriteAllText(newFileToBeCreated, new string(chars), encoder);
        }
        /*
        All sort of Exceptions,may be thrown from here :
        Exception                   Condition 
        ------------------------------------------------------------------------------------------
        ArgumentException           path is a zero-length string, contains only white space, or contains one or more invalid characters as defined by InvalidPathChars.  
        ArgumentNullException       path is null  
        PathTooLongException        The specified path, file name, or both exceed the system-defined maximum length. For example, on Windows-based platforms, paths must be less than 248 characters, and file names must be less than 260 characters. 
        DirectoryNotFoundException  The specified path is invalid (for example, it is on an unmapped drive). 
        IOException                 An I/O error occurred while opening the file. 
        UnauthorizedAccessException path specified a file that is read-only.
                                    -or- This operation is not supported on the current platform.
                                    -or- path specified a directory.
                                    -or- The caller does not have the required permission. 
        FileNotFoundException       The file specified in path was not found. 
        NotSupportedException       path is in an invalid format. 
        SecurityException           The caller does not have the required permission. 
        ------------------------------------------------------------------------------------------
         For testing the above use RAM disk. 
         There are few free implementations available 
         For example:
         http://memory.dataram.com/products-and-services/software/ramdisk/download-ramdisk
         Appears to be the fastest, is free and stable.
         */

        /// <summary>
        /// Reverse text file into new one
        /// </summary>
        /// <param name="input">path of the input</param>
        /// <param name="output">path of the output</param>
        /// <param name="non_ascii_encoding">optionaly request non ascii encoding</param>
        static public void ReverseTextFile(string input, string output, params Encoding [] non_ascii_encoding )
        {
            Encoding encoder = non_ascii_encoding.Length > 1 ? non_ascii_encoding[0] : Encoding.ASCII;
            using ( System.IO.StreamReader in_ = new System.IO.StreamReader(
                System.IO.Path.GetFullPath(input), encoder) )
            using (System.IO.StreamWriter out_ = new System.IO.StreamWriter(
                System.IO.Path.GetFullPath(output), false, encoder))
            {
                ReverseText(() => in_, () => out_);
            }
        }
        /// <summary>
        /// Compare two text file contents
        /// </summary>
        /// <param name="input">file path</param>
        /// <param name="output">file path</param>
        /// <param name="non_ascii_encoding">optionaly request non ascii encoding</param>
        static public bool CompareTextFiles(string input, string output, params Encoding[] non_ascii_encoding)
        {
            Encoding encoder = non_ascii_encoding.Length > 1 ? non_ascii_encoding[0] : Encoding.ASCII;
            using (System.IO.StreamReader in_ = new System.IO.StreamReader(
                System.IO.Path.GetFullPath(input), encoder))
            using (System.IO.StreamReader out_ = new System.IO.StreamReader(
                System.IO.Path.GetFullPath(output), encoder))
            {
                return CompareText(() => in_, () => out_);
            }
        }

        /// <summary>
        /// generic reverser-copier from a TextReader to TextWriter, derived implementation
        /// calling example :  
        /// ReverseTextFile(() => new StringReader(text), () => new StringWriter(stringBuilder));
        /// </summary>
        /// <param name="input">generic delegate argument</param>
        /// <param name="output">generic delegate argument</param>
        static public void ReverseText(Func<System.IO.TextReader> input, Func<System.IO.TextWriter> output)
        {
            System.IO.TextReader reader = input();
            System.IO.TextWriter writer = output();

            // NOTE: qualify static methods with classes they belong to
            // this improves code readability! (C++ : DBJ::Reverse() ;)
            writer.Write(DBJ.Reverse(reader.ReadToEnd()));
        }

        /// <summary>
        /// generic comparer of two TextReader derived implementations
        /// calling example :  
        /// CompareTextFile(() => new StringReader(text), () => new StringReader(text));
        /// </summary>
        /// <param name="input">generic delegate argument</param>
        /// <param name="output">generic delegate argument</param>
        /// <param name="ignore_case_option">optionaly request case to be ignored</param>
        static public bool CompareText(
            Func<System.IO.TextReader> input, 
            Func<System.IO.TextReader> output,
            params bool [] ignore_case_option )
        {
            bool ignore_case = ignore_case_option.Length > 0 ? ignore_case_option[0] : false;
            System.IO.TextReader reader1 = input();
            System.IO.TextReader reader2 = output();
            return 0 == String.Compare(reader1.ReadToEnd(),reader2.ReadToEnd(), ignore_case ) ;
        }

        
    }
}
