using System;
// fast
using System.Diagnostics;
// slow
using System.Runtime.CompilerServices;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

namespace FunctionAppDBJ
{
    /// <summary>
    /// not macros but as close as we can get from C#
    /// </summary>
    internal struct notmacros
    {
        /// <summary>
        /// warning! using reflection is slow
        /// use stack trace if and when can
        /// usage:
        /// using static notmacros
        ///  somewhere  else
        /// var my_name = whoami();
        /// </summary>
        /// <param name="caller_name"></param>
        /// <returns>the caller name</returns>
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static string
        whoami([CallerMemberName] string caller_name = null)
        {
            if (string.IsNullOrEmpty(caller_name))
                return "unknown";
            if (string.IsNullOrWhiteSpace(caller_name))
                return "unknown";
            return caller_name;
        }


        [MethodImpl(MethodImplOptions.NoInlining)]
        public static string current_method_name()
        {
            var st = new StackTrace();
            var sf = st.GetFrame(0);
            return sf.GetMethod().Name;
        }
    } // eof notmacros struct
}

