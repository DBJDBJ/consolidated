namespace tdd
{
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using IO = System.IO;
    using ST = System.Text;

    class dbjContextHolder {

        private TestContext context_ = null;

        public dbjContextHolder(TestContext official_context)
        {
            this.context_ = official_context;
        }
        public TestContext context { get { return this.context_; } }
    }

    /// <summary>
    /// Front to in-memory reversing methods
    /// </summary>
    /// <remarks>
    /// Use this for smaller files.
    /// Some methods here are developed for testing.
    /// </remarks>
    [TestClass()]
    public class DBJReversingTest
    {
        private TestContext testContextInstance;
        #region DBJ test context solution
        // context holder that can be used to store own properties
        // must be initalized in class initialization method
        static dbjContextHolder my_context = null;
        #endregion
        /// <summary>
        ///Gets or sets the test context which provides
        ///information about and functionality for the current test run.
        ///</summary>
        public TestContext TestContext
        {
            get
            {
                return testContextInstance;
            }
            set
            {
                testContextInstance = value;
            }
        }

        #region Additional test attributes

        // prepare and hold: input, reversed and reveresed back file names
        // for large, medium and small file names
        sealed class Names
        {
            public static readonly string max_file = "max_file" ;
            public static readonly string mid_file = "mid_file";
            public static readonly string min_file = "min_file";
            public static readonly string root ;

            public readonly string input , reversed, reversed_back ;

            static Names () {
                Names.root = tdd.Properties.Settings.Default.operation_folder;
            }

            public Names( string seed ) {
                input = IO.Path.GetFullPath(seed);
                reversed =  input  + ".reversed" ;
                reversed_back = IO.Path.ChangeExtension(input , ".reversed_back." + IO.Path.GetExtension(input));
            }

            static Names max_ = null ;
            public static Names max
            {
                get {
                    if (max_ == null) max_ = new Names(Names.root + tdd.Properties.Settings.Default.max_file);
                    return max_ ;
                }
            }
            static Names mid_ = null;
            public static Names mid
            {
                get
                {
                    if (mid_ == null) mid_ = new Names(Names.root + tdd.Properties.Settings.Default.mid_file);
                    return mid_ ;
                }
            }
            static Names min_ = null;
            public static Names min
            {
                get
                {
                    if (min_ == null) min_ = new Names(Names.root + tdd.Properties.Settings.Default.min_file);
                    return min_ ;
                }
            }
        }

        //Use ClassInitialize to run code before running the first test in the class
        // NOTE! This is called *BEFORE* this class is instantiated 
        [ClassInitialize()]
        public static void DBJReversingTestInitialize(TestContext testContext)
        {
             // Any user defined testContext.Properties
             // added to the argument will be erased 
             // afer this method exits
            // testContext.Properties.Add("This is lost", 1);

            // use  dbjContextHolder to preserve your TestContext 
            DBJReversingTest.my_context = new dbjContextHolder(testContext);
            my_context.context.Properties.Add("KEY", 13);
        }
        //
        //Use ClassCleanup to run code after all tests in a class have run
        //[ClassCleanup()] public static void MyClassCleanup() { }
        //
        //Use TestInitialize to run code before running each test
        /*[TestInitialize()]public void MyTestInitialize(){ }*/
        //
        //Use TestCleanup to run code after each test has run
        //[TestCleanup()] public void MyTestCleanup() { }
        //
        #endregion


        [ Ignore, Description("Test String  utilities : DBJ.Repeat and DBJ.Reverse"), TestMethod]
        public void string_repeating_reversing ()
        {
            string input = DBJ.Repeat("1234567890",3);
            string output = DBJ.Reverse(input);
            Assert.AreEqual(input, DBJ.Reverse(output));
        }

        [ Ignore, Description("Test ReverseTextFile without hitting file system. Using StringReader and StringWriter"), TestMethod]
        public void string_reader_writer_reversing() {
            string input = DBJ.Repeat("1234567890",1);
            ST.StringBuilder output = new ST.StringBuilder();
            DBJ.ReverseText(
                () => new IO.StringReader(input),
                () => new IO.StringWriter(output)
             );
            // in this case we can (and will) test separately underlying strings and 
            // using wraping IO structures
            Assert.AreEqual(input, DBJ.Reverse(output.ToString()));
            // output is here reversed input so it must be different
            Assert.AreEqual( false , DBJ.CompareText(
                () => new IO.StringReader(input),
                () => new IO.StringReader(output.ToString())
             )
             );
            // now reverse the output again
            ST.StringBuilder output2 = new ST.StringBuilder();
            DBJ.ReverseText(
                () => new IO.StringReader(output.ToString()),
                () => new IO.StringWriter(output2)
             );
            // this time input and output2 must be same
            Assert.AreEqual(true, DBJ.CompareText(
                () => new IO.StringReader(input),
                () => new IO.StringReader(output2.ToString())
             )
             );
        }

        [ Ignore, Description("Test Reversing disk based TextFiles. This test is hiting the file system."),TestMethod]
        public void text_file_reversing()
        {
            string input = "e:\\readme.txt", output1 = "e:\\readme.rvr.txt", output2 = "e:\\readme.org.txt";

            DBJ.ReverseTextFile(input  , output1);
            DBJ.ReverseTextFile(output1, output2);
            // this time input and output2 must be the same
            Assert.AreEqual(true, DBJ.CompareTextFiles( input, output2 ));
        }

        [
        Description("Test Reversing disk based, potentialy very large, files. This test might be hiting the file system."), 
        TestMethod]
        public void disk_file_reversing()
        {
            Names name = Names.max;

            TestContext.BeginTimer(Names.max_file);
            dbj.Reverser.reverse( name.input    , name.reversed );
            dbj.Reverser.reverse( name.reversed , name.reversed_back );
            TestContext.EndTimer(Names.max_file);
            TestContext.WriteLine("How do I write timing result?");
            // at this time input1 and output2 must be the same
            Assert.AreEqual(true, dbj.Reverser.compare_files(name.input , name.reversed_back ));
        }

        [
        Ignore,
        Description("Test copy+reverse+copy an mid sized file.Reversing+copying streams in memory."),
        TestMethod
        ]
        public void copy_mid_size_file_over_memory()
        {
            Names name = Names.mid;

            using (
            IO.FileStream
                input = new IO.FileStream( name.input      , IO.FileMode.Open),
                output1 = new IO.FileStream( name.reversed , IO.FileMode.Create),
                output2 = new IO.FileStream( name.reversed_back , IO.FileMode.Create)
                )
            {

                dbj.StreamUtil.copy_reverse_in_memory(input, output1);
                dbj.StreamUtil.copy_reverse_in_memory(output1, output2);
                // at this time input1 and output2 must be the same
                Assert.AreEqual(true, dbj.StreamUtil.compare(input, output2));
            }
        }


        [
        Ignore,
        Description("Test copy+reverse+copy a string based stream .Reversing+copying streams in memory."),
        TestMethod
        ]
        public void copy_string_over_memory()
        {

            string input_string = DBJ.Repeat("1234567890",1);

            byte [] bytes0 = ST.Encoding.Default.GetBytes( input_string ),
                bytes1 = new byte[bytes0.Length],
                bytes2 = new byte[bytes1.Length];

            IO.MemoryStream
                input   = new IO.MemoryStream( bytes0 ),
                output1 = new IO.MemoryStream( bytes1 ),
                output2 = new IO.MemoryStream( bytes2 );

            dbj.StreamUtil.copy_reverse_in_memory(input, output1);
            dbj.StreamUtil.copy_reverse_in_memory(output1, output2);
#if DEBUG
            string result0 = ST.Encoding.Default.GetString(bytes0);
            string result1 = ST.Encoding.Default.GetString(bytes1);
            string result2 = ST.Encoding.Default.GetString(bytes2);
#endif
            // at this time input1 and output2 must be the same
            Assert.AreEqual(true, dbj.StreamUtil.compare(input, output2));
        }

    }
}
