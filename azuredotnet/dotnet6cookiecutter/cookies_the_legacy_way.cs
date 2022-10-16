using System;
using System.Net;

using Xunit;

namespace dbj_cookie_cutter
{
    using static notmacro;
    public sealed class cookies_the_legacy_way
    {
        [Theory]
        [InlineData("https://google.com")]
        public static void run_legacy(params string[] args)
        {
            log.info($"Begin: {whoami()}");

            if (args == null || args.Length < 1)
            {
                throw new ArgumentException($"{notmacro.whoami()}, needs one argument: the url to be used");
            }
            // https://docs.microsoft.com/en-us/dotnet/api/system.net.httpwebrequest.cookiecontainer?view=net-6.0
            // https://docs.microsoft.com/en-gb/dotnet/fundamentals/syslib-diagnostics/syslib0014
            // Disable the warning.
#pragma warning disable SYSLIB0014
            var request = (HttpWebRequest)WebRequest.Create(args[0]);
            // Re-enable the warning.
#pragma warning restore SYSLIB0014
            request.CookieContainer = new CookieContainer();

            using (var response = (HttpWebResponse)request.GetResponse())
            {
                // Print the properties of each cookie.
                foreach (Cookie cook in response.Cookies)
                {
                    cookie_cutter_program.log_cookie(cook);
                }
            }
        }

    }
}
// Output from this example will be vary depending on the host name specified,
// but will be similar to the following.
/*
Cookie:
CustomerID = 13xyz
Domain: .contoso.com
Path: /
Port:
Secure: False
When issued: 1/14/2003 3:20:57 PM
Expires: 1/17/2013 11:14:07 AM (expired? False)
Don't save: False
Comment:
Uri for comments:
Version: RFC 2965
String: CustomerID = 13xyz
*/