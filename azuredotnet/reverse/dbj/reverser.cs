/*
MIT (c) 2010 by DBJ.ORG

$Revision: 10 $
$Author: Admin $

 * After first battery of tests is developed and used
 * this code will form an separate assembly in an implementation
 * to be released
 */
namespace dbj
{
    using System;
    using System.IO;

    /// <summary>
    /// Utilities for streams 
    /// </summary>
    class StreamUtil {

        static object padlock = new object() ;
        /// <summary>
        /// legacy stream in this context, is the one which does not implement
        /// Length and position properties
        /// </summary>
        /// <param name="stream_">the stream</param>
        /// <returns>true if it is legacy stream</returns>
        public static bool isLegacy(Stream stream_)
        {
            try
            {
                // this will throw exception if property is not implemented or stream is disposed of
                long size = stream_.Length;
                // assumption is that no stream has implemented Length but not Position
                // stream_.Position = 0 ;
                // TO DO: double check this assumption !
                return false ; // not a legacy stream
            }
            catch (Exception) { }
            return true;
        }
        /// <summary>
        /// In this context valid stream is the one arround which 
        /// we can seek, write and read.
        /// </summary>
        /// <param name="stream_">the stream to be checked</param>
        /// <returns>true if valid, false otherwise</returns>
        public static bool isValid(Stream stream_)
        {
            try
            {
                return stream_.CanSeek && stream_.CanRead && stream_.CanWrite;
            }
            catch (Exception) { }
            return false;
        }

        /// <summary>
        /// Delegate for generating methods for stream  poistioning or length 
        /// Legacy streams do not have postion or length implemented. they have to be seek-ed for that.  Implementations of this delegate encapsulate that detail.
        /// </summary>
        /// <remarks>
        /// For positioning :
        /// position/seek on the stream
        /// if no argument given return current position
        /// For length :
        /// return the length
        /// </remarks>
        /// <typeparam name="T">stream</typeparam>
        /// <param name="pos">
        /// optional argument
        /// if given it is new stream internal pointer position
        /// </param>
        /// <returns>long</returns>
        public delegate long Position_or_length<T> ( params long [] pos)  ;
        /// <summary>
        /// there are 2 kinds: for legacy and contemporary streams
        /// </summary>
        /// <param name="strm">the stream on which poistioning will be done</param>
        /// <returns>positioner method</returns>
        static public Position_or_length<Stream>  positioning_method ( System.IO.Stream strm ) {

            if (!strm.CanSeek) throw new ArgumentException("San not seek on this stream?", "strm");

            if ( StreamUtil.isLegacy(strm))
            {
                return pos => { if (pos.Length < 1) return strm.Seek(0, SeekOrigin.Current); return strm.Seek(pos[0], SeekOrigin.Begin); };
            }
            return pos => { if (pos.Length < 1) return strm.Position; return strm.Position = pos[0]; };
        }
        /// <summary>
        /// appropriate length method for legacy or modern stream
        /// </summary>
        /// <param name="strm">the stream</param>
        /// <returns>length method</returns>
        static public Position_or_length<Stream> length_method(Stream strm) {
            if (!strm.CanSeek) throw new ArgumentException("San not seek on this stream?", "strm");
            if (StreamUtil.isLegacy(strm))
            {
                return pos => { return strm.Seek( 0, SeekOrigin.End ); };
            }
            return pos => { return strm.Length ; };
        }

        /// <summary>
        /// "plain" stream copy
        /// </summary>
        /// <param name="input">An stream</param>
        /// <param name="output">An stream</param>
        public static void copy_in_memory ( Stream input, Stream output )
        {
            lock (input)
            {
                lock (output)
                {
                    if (!isValid(input)) throw new ArgumentException("stream given can not be used?", "input");
                    if (!isValid(output)) throw new ArgumentException("stream given can not be used?", "output");
                    const int size = 4096;
                    byte[] bytes = new byte[4096];
                    int numBytes;
                    while ((numBytes = input.Read(bytes, 0, size)) > 0)
                        output.Write(bytes, 0, numBytes);

                    positioning_method(input)(0); // reset steam pointers to 0
                    positioning_method(output)(0); // reset steam pointers to 0
                }
            }
        }

        /// <summary>
        /// copy stream as the reverse of the original
        /// NOTE: stream of the length up to 0xFFFF (65535) is copied
        /// </summary>
        /// <param name="output_flush">optionaly DO NOT flush the output</param>
        /// <param name="input">input stream</param>
        /// <param name="output">output stream</param>
        public static void copy_reverse_in_memory (Stream input, Stream output, params bool [] output_no_flush )
        {
            lock (input)
            {
                lock (output)
                {
                    if (!isValid(input)) throw new ArgumentException("stream given can not be used?", "input");
                    if (!isValid(output)) throw new ArgumentException("stream given can not be used?", "output");

                    if (length_method(input)() > 0xFFFF) throw new ArgumentException("Streams over length 65535, are not handled by this method", "input");

                    byte[] bytes = toByteArray(input);
                    Array.Reverse(bytes);
                    // by default flush the output
                    if (output_no_flush.Length < 1) output.Flush();
                    output.Write(bytes, 0, bytes.Length);
                    positioning_method(input)(0); // reset steam pointers to 0
                    positioning_method(output)(0); // reset steam pointers to 0
                }
            }
        }

        /// <summary>
        /// dump the whole of the stream into the byte array
        /// NOTE: thread safe
        /// </summary>
        /// <param name="s">the stream</param>
        /// <returns>array of bytes</returns>
        public static byte[] toByteArray(Stream s)
        {
            lock (s)
            {
                if (!isValid(s)) throw new ArgumentException("stream given can not be used?", "s");
                positioning_method(s)(0); // reset 
                int stream_length = (int)length_method(s)();
                byte[] bytes = new byte[stream_length];
                int numBytesToRead = stream_length;
                int numBytesRead = 0;
                while (numBytesToRead > 0)
                {
                    // Read may return anything from 0 to numBytesToRead.
                    int n = s.Read(bytes, numBytesRead, numBytesToRead);
                    // The end of the file is reached.
                    if (n == 0) break;
                    numBytesRead += n;
                    numBytesToRead -= n;
                }
                return bytes;
            }
        }

        /// <summary>
        /// Are two streams having the same content ?
        /// </summary>
        /// <param name="fs1">stream</param>
        /// <param name="fs2">stream</param>
        /// <returns>true id they do</returns>
        static public bool compare(System.IO.Stream fs1, System.IO.Stream fs2)
        {
            lock (fs1)
            {
                lock (fs2)
                {
                    Position_or_length<Stream> pos1 = positioning_method(fs1),
                                       pos2 = positioning_method(fs2);
                    Position_or_length<Stream> len1 = length_method(fs1),
                                       len2 = length_method(fs2);

                    int file1byte, file2byte;
                    // Check the file sizes. If they are not the same, the files 
                    // are not the same.
                    if (len1() != len2())
                        return false;

                    // reset seek pointer on both streams
                    pos1(0); pos2(0);

                    // Read and compare a byte from each file until either a
                    // non-matching set of bytes is found or until the end of
                    // file1 is reached.
                    do
                    {
                        // Read one byte from each file.
                        file1byte = fs1.ReadByte();
                        file2byte = fs2.ReadByte();
                    }
                    while ((file1byte == file2byte) && (file1byte != -1));

                    // reset seek pointer on both streams
                    pos1(0); pos2(0);

                    // Return the success of the comparison. "file1byte" is 
                    // equal to "file2byte" at this point only if the files are 
                    // the same.
                    return ((file1byte - file2byte) == 0);
                }
            }
        }

    }

    /// <summary>
    /// Provide access to a large stream, as if it were an arrays (of bytes).
    /// NOTE: This is good ONLY for LARGE disc based streams. Slow and safe approach.
    /// For files which can be kept whole in the RAM, this is very un-efficient approach.
    /// Even if using MemoryStreams.
    /// </summary>
    class StreamVector
    {
        #region decoupled implementation 
        /// <summary>
        /// We decouple implementation and interface of the StreamVector
        /// The motivation is that we have two distinct implementation of 
        /// stream seeking amd thus providing indexing like interface to streams
        /// our implementation will point to concrete class implementing this interface
        /// This solution has attributes of several patterns: bridge, facade etc ...
        /// 
        /// We can handle streams and legacy streams
        /// For that we have two engines in here
        /// 
        /// </summary>
        protected interface IStreamHandler
        {
            /// <summary>
            /// access to the underlying stream 
            /// </summary>
            Stream stream { get; }
            /// <summary>
            /// read only property for a stream content length
            /// </summary>
            long Length { get; }
            /// <summary>
            /// Actually reset the seek to the begining of the stream
            /// </summary>
            void Reset();
            /// <summary>
            /// array like (aka indexing) acces to each byte in the underlying stream
            /// </summary>
            /// <param name="index"></param>
            /// <returns></returns>
            byte this[long index] { get; set; }
        }
        /// <summary>
        /// StreamHanlder handles streams which have Position and Length properties implemented
        /// This is much better than using Seek-ing
        /// </summary>
        class StreamHadler : IStreamHandler 
        {
            Stream stream_ ;

            public StreamHadler(Stream stm ) { this.stream_ = stm ; }
            #region IStreamHandler Members

            public Stream stream
            {
                get { return this.stream_; }
            }

            public long Length
            {
                get { return this.stream_.Length ; }
            }

            public void Reset()
            {
                this.stream_.Position = 0;
            }

            public byte this[long index]
            {
                get
                {
                    // Read one byte at offset index and return it.
                    byte[] buffer = new byte[1];
                    stream_.Position = index ;
                    stream_.Read(buffer, 0, 1);
                    return buffer[0];
                }
                set
                {
                    // Write one byte at offset index and return it.
                    byte[] buffer = new byte[1] { value };
                    stream_.Position = index ;
                    stream_.Write(buffer, 0, 1);
                }
            }

            #endregion
        }
        class LegacyStreamHandler : IStreamHandler
        {
           Stream stream_ ;
           public LegacyStreamHandler(Stream stm) { this.stream_ = stm; }

            #region IStreamHandler Members

            public Stream stream
            {
                get { return this.stream_; }
            }

            public long Length
            {
                get { return stream.Seek(0, SeekOrigin.End); }
            }

            public void Reset()
            {
                stream.Seek(0, System.IO.SeekOrigin.Begin);
            }

            public byte this[long index]
            {
                get
                {
                    // Read one byte at offset index and return it.
                    byte[] buffer = new byte[1];
                    stream_.Seek(index, SeekOrigin.Begin);
                    stream_.Read(buffer, 0, 1);
                    return buffer[0];
                }
                set
                {
                    // Write one byte at offset index and return it.
                    byte[] buffer = new byte[1] { value };
                    stream_.Seek(index, SeekOrigin.Begin);
                    stream_.Write(buffer, 0, 1);
                }
            }

            #endregion
        }
        #endregion

        // Holds the underlying stream and provides implementation that matches
        // stream capabilities
        protected IStreamHandler engine_ ;      
        // NOTE: protected , so that inheritors can reach it

        /// <summary>
        /// Construct with a stream given.
        /// IMPORTANT : of stream is not valid we will throw an exception from a constructor!
        /// <seealso cref="isValid()"/>
        /// NOTE: this class is (just) kind-of-a stream handler, so operations like
        /// closing a stream are not performed here
        /// </summary>
        /// <param name="stream_"></param>
        public StreamVector(Stream stream_) {

            if (!StreamUtil.isValid(stream_)) 
                throw new ArgumentException("Stream given is not valid? It can not be seek-ed or read from or written to.", "stream_");

            if ( ! StreamUtil.isLegacy( stream_ )) {
                engine_ = new StreamHadler( stream_ ) ;
            } else {
                engine_ = new LegacyStreamHandler( stream_ ) ;
            }
        }
        #region utilities 
        /// <summary>
        /// Factory method for creating instance of this class,
        ///from a string  
        /// NOTE: Since this is not C#4 we do not use default parameter for encoding
        /// </summary>
        /// <param name="p">The content to be content of the stream</param>
        /// <param name="E">optionaly callers can use different ancoder. Default is ASCII</param>
        /// <returns>new instance of StreamVector class</returns>
        public static StreamVector MakeFromString(String p, 
            params System.Text.Encoding [] E )
        {
            Byte[] bytes =  E.Length > 0 ? E[0].GetBytes(p) : System.Text.ASCIIEncoding.ASCII.GetBytes(p);
            MemoryStream strm = new MemoryStream();
            strm.Write(bytes, 0, bytes.Length);
            return  new StreamVector(strm);
        }
        #endregion // utilities

        /// <summary>
        ///Indexer to provide read/write access to the file. 
        /// NOTE: if users want to use stream which is handled by this class
        /// they must seek manually to the first byte
        /// otherwise normal stream operations might not work
        /// as expected!
        /// </summary>
        /// <param name="index">64-bit integer for a position in a underlying stream.</param>
        /// <returns>for a get, a single byte form an exact position</returns>
        public byte this[long index]   // long is a 64-bit integer
        {
            get
            {
                return engine_[index];
            }
            set
            {
                engine_[index] = value;
            }
        }

        /// <summary>
        ///  Get the total length of the file. 
        ///  NOTE:
        ///  System.NotSupportedException or System.DisposedObject exceptions
        ///  can be thrown from here.
        ///  Perhpas this could be used as a method to check the validity of the 
        ///  stream to be handled by this class ?
        /// </summary>
        public long Length
        {
            get
            {
                return engine_.Length;
            }
        }
        /// <summary>
        /// Reverse the contents of this stream 'in place', bit-by-bit 
        /// NOTE: the whole of this stream handler exists for handling LARGE streams.
        /// LARGE streams are disc based. V.s. streams which are RAM based.
        /// NOTE:
        /// this method is thread safe. But! be carefull not to hit it form many threads because 
        /// we can spend a LOT of time in this method.
        /// </summary>
        public void reverse()
        {
            lock (engine_)
            {
                try
                {
                    long len = engine_.Length;
                    byte t;
                    // Swap bytes in the file to reverse it.
                    for (long i = 0, j = len - 1; i < j; j--, i++)
                    {
                        t = engine_[i];
                        engine_[i] = engine_[j];
                        engine_[j] = t;
                    }
                }
                finally
                {
                    // NOTE: must seek manually to the first byte
                    // otherwise normal stream operations will not work
                    // as expected!
                    engine_.Reset();
                }
            }
        }
    }

    /// <summary>
    /// Handle FileStream's
    /// </summary>
    /// <remarks>
    /// This means it will close the file when 
    /// it goes out of scope as defined by IDisposable behaviour which it implements.
    /// Laways use using() method when dealing with System.IO top-level classes.
    /// </remarks>
    class FileVector : StreamVector, IDisposable   
    {
        /// <summary>
        /// Create a new StreamVector encapsulating a particular file.
        /// FileStream security attributes are all default ones
        /// </summary>
        /// <param name="fileName">file path</param>
        public FileVector(string fileName)
            : base (new FileStream(fileName, FileMode.Open))
        {
        }

        #region IDisposable Members

        public void Dispose()
        {
            // NOTE: robust programing: things can always go wrong when closing a stream 
            //  and exceptions thrown from garbage collected or od disposable objects
            // can be very hard to catch. Especially in non-debug builds
            // or server side components with no gui...
            try
            {
                this.engine_.stream.Close();
            }
            catch (Exception x) {
                Console.Error.WriteLine(x.ToString());
                // NOTE: Of course, a proper logging infrastructure should be used
                // even better would be an instrumentation mechanism
                // MSFT AppFabric is all about enforcing this kind of coding
                // and providing mechanisms for it. So that components can be easily hosted
                // "on the Cloud"
            }
        }

        #endregion
    }

    /// <summary>
    /// Front to the disk based reversals
    /// </summary>
    /// <remarks>
    /// Care is taken that it works on both legacy (minimal  implementation) stream and "proper" streams.
    /// "Minimal" streams are usualy found in mobile device environments. And as user developed "in-house" streams.
    /// </remarks>
    class Reverser
    {
        /// <summary>
        /// Create output file which is reversed image of the input file.
        /// </summary>
        /// <remarks>
        /// Does not use in memory reversal.
        /// Works on XXL files.
        /// Output file attributes will be stripped of. It will not be hidden, read only or system file.
        /// </remarks>
        /// <param name="input">file name or path</param>
        /// <param name="output">file name or path</param>
        public static void reverse( string input, string output )
        {
            input = Path.GetFullPath(input);
            output = Path.GetFullPath(output);
            if (!File.Exists(input)) throw new ArgumentException(string.Format("Input file {0}, not found?", input), input);

            // use if having this problem :
            // Exception:  System.UnauthorizedAccessException: Access to the path { output path here }is denied..	
            System.Security.Permissions.FileIOPermission filePermission =
                new System.Security.Permissions.FileIOPermission(
                    System.Security.Permissions.FileIOPermissionAccess.AllAccess, output);
            filePermission.AllLocalFiles = System.Security.Permissions.FileIOPermissionAccess.AllAccess;
            filePermission.Assert();
            // Exception:  System.UnauthorizedAccessException: Access to the path { output path here }is denied..	
            File.Copy(input, output, true);
            // clear all file attributes
            File.SetAttributes(output, FileAttributes.Normal);
            // Open the output for read and write
            using (FileStream fileStream = new FileStream(output, FileMode.Open))
            {
                Reverser.reverse(fileStream);
            }
        }
        /// <summary>
        /// Reverse the content of a file.
        /// </summary>
        /// <remarks>
        /// File will be reversed "in-place". 
        /// No memory reversal.
        /// </remarks>
        /// <param name="args">file path</param>
        /// <param name="file_path">File name or path</param>
        public static void reverse (string file_path)
        {
            file_path = Path.GetFullPath(file_path);
            // Robust solution: Be sure the absolute path is used and check it too!
            if ( false == File.Exists( Path.GetFullPath(file_path)))
            {
                throw new ArgumentException(
                    string.Format("File {0} not found using the path argument given?",file_path), "file_path");
            }
            // Open the output for read and write
            using (FileStream fileStream = new FileStream(file_path, FileMode.Open))
            {
                Reverser.reverse(fileStream);
            }
        }

        /// <summary>
        /// Reverse the content of a stream.
        /// </summary>
        /// <remarks>
        /// This method declaration allows the caller to use MemoryStreams or StringStreams
        /// Or any other kind-of-a stream. The only requirement is that stream can be seek-ed and write()/read()
        /// </remarks>
        /// <param name="args">file path</param>
        /// <param name="stream_">
        /// Stream instance 
        /// Legacy streams are taken care of.
        /// </param>
        public static void reverse (Stream stream_)
        {
                new StreamVector(stream_).reverse();
        }

        /// <summary>
        /// Compare two files
        /// </summary>
        /// <remarks>
        /// Algorithm uses stream bit-by-bit comparison so it
        /// is suitable for large disk based files.
        /// NOTE: this can be a very long operation if applied on XXL files.
        /// </remarks>
        /// <param name="file1">file path</param>
        /// <param name="file2">file path</param>
        /// <returns>true if file content is same</returns>
        public static bool compare_files(string file1, string file2)
        {
            System.IO.FileStream fs1, fs2;
            // Determine if the same file was referenced two times.
            if (file1 == file2)
                return true;
            // Open the two files and compare their streams
            using (fs1 = new FileStream(file1, FileMode.Open, FileAccess.Read ))
            using (fs2 = new FileStream(file2, FileMode.Open, FileAccess.Read ))
            {
                return dbj.StreamUtil.compare(fs1, fs2);
            }
        }

        /// <summary>
        /// Instantiate if admin impersonation is required.
        /// </summary>
        /// <remarks>
        /// Impersonate as admin upon creating 
        /// Undo the impersonation when disposing
        /// Of course caller needs to know admin user name and password.
        /// </remarks>
        class AutomagicAdmin : IDisposable 
        {
            System.Security.Principal.WindowsImpersonationContext context = null;

            /// <summary>
            /// public constructor
            /// </summary>
            /// <param name="upn_uname">UPN user name example : admin@WS01 , where 'WS01' is a domain name </param>
            /// <param name="password"> password </param>
            public AutomagicAdmin( string upn_uname, string password )
            {
                try
                {
                    AppDomain.CurrentDomain.SetPrincipalPolicy(System.Security.Principal.PrincipalPolicy.WindowsPrincipal);
                    System.Security.Principal.WindowsIdentity idnt =
                        new System.Security.Principal.WindowsIdentity(upn_uname, password );
                    context = idnt.Impersonate();
                }
                catch (Exception)
                {
                    context = null;
                }

            }
            // undo admin magic when leaving
            /// <summary>
            /// impersonation context is undone upon disposal
            /// </summary>
            public void Dispose()
            {
                if (context != null) context.Undo();
                context = null;
            }
        }
    }
} // dbj.sample