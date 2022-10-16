using System;
using System.Net;
using System.Net.Http;

using Xunit;


namespace dbj_cookie_cutter;

using static notmacro;

public sealed class cookies_the_six_way
{
    [Theory]
    [InlineData("https://google.com")]
    public static async Task run(params string[] args)
    {
        if (args == null || args.Length < 1)
        {
            throw new ArgumentException($"{notmacro.whoami()}, needs one argument: the url to be used");
        }
        log.info($"Begin: {whoami()}");
        log.info(log.text_line);

        List<Cookie> cookie_list = await GetCookies(args[0]);
        // Print the properties of each cookie.
        foreach (Cookie cook in cookie_list)
        {
            cookie_cutter_program.log_cookie(cook);
        }
    }
    // https://stackoverflow.com/a/51787175/10870835
    private static async Task<List<Cookie>> GetCookies(string url/*, string cookieName*/)
    {
        var cookieContainer = new CookieContainer();
        var uri = new Uri(url);
        // how is this better vs using finalizers?
        using (var httpClientHandler = new HttpClientHandler
        {
            // how is this better vs constructor arguments?
            CookieContainer = cookieContainer
        })
        {
            using (var httpClient = new HttpClient(httpClientHandler))
            {
                await httpClient.GetAsync(uri);
                List<Cookie> cookies = cookieContainer.GetCookies(uri).Cast<Cookie>().ToList();
                return cookies;
            }
        }
    }
} // eof cookies_the_six_way

/*
httpClient is long-lived and comes from a IHttpClientFactory
HttpClient client = new HttpClient();
HttpResponseMessage response = await client.GetAsync(args[0]);

ovo je low level i ovo uvek radi sa HTTP header
IEnumerable<string> cookies =
response.Headers.SingleOrDefault(header => header.Key == "Set-Cookie").Value;
foreach (string cookie_str in cookies)
{
    log.logger.info(cookie_str);
    log.logger.info(log.text_line);
}
 pitanje je kako napraviti Cookie instancu od string cookie prezentacije


 ovo je LINQ nachin za koji mi je trebalo jedan sat da se setim
 da "mora" da radi, osim sto ne radi
 tako da ne idem u tom pravcu
 IEnumerable<Cookie> cookies_enum = response.Headers.Cast<Cookie>();

*/