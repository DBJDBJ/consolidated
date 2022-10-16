
using System.Net;
using System;

namespace dbj_cookie_cutter;

using static notmacro;

internal sealed class cookie_cutter_program
{
    static string the_default_url_ = "https://google.com";

    public static async Task Main(string[] args)
    {
        try
        {
            await cookies_the_six_way.run(the_default_url_);
            cookies_the_legacy_way.run_legacy(the_default_url_);
        }
        catch (Exception x_)
        {
            log.fatal(x_.Message);
        }
    }

    public static void log_cookie(Cookie cook)
    {
        log.info("Cookie:");
        log.info($"{cook.Name} = {cook.Value}");
        log.info($"Domain: {cook.Domain}");
        log.info($"Path: {cook.Path}");
        log.info($"Port: {cook.Port}");
        log.info($"Secure: {cook.Secure}");

        log.info($"When issued: {cook.TimeStamp}");
        log.info($"Expires: {cook.Expires} (expired? {cook.Expired})");
        log.info($"Don't save: {cook.Discard}");
        log.info($"Comment: {cook.Comment}");
        log.info($"Uri for comments: {cook.CommentUri}");
        log.info($"Version: RFC {(cook.Version == 1 ? 2109 : 2965)}");

        // Show the string representation of the cookie.
        log.info($"String: {cook}");
        log.info(log.text_line);
    }
}

