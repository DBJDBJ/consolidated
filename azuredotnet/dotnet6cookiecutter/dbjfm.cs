/*

 dbj@dbj.org

 FM stands for Foundation Mechanisms
-------------------------------------------------------------------
$ dotnet add package Serilog
$ dotnet add package Serilog.Sinks.Console
$ dotnet add package Serilog.Sinks.File

if this is part of a xUnit project:

$ dotnet add package Xunit
$ dotnet add package Xunit.Abstractions
$ dotnet add package Serilog.Sinks.XUnit

$dotnet add package NUnit3TestAdapter --version 4.2.1
*/
global using Xunit;

using Serilog;

using System;
using System.Diagnostics;
using System.Runtime.CompilerServices;

using Xunit.Abstractions;


namespace dbj_cookie_cutter;

internal struct notmacro
{
    /// <summary>
    /// warning! using reflection is slow
    /// use stack trace if and when can
    /// usage:
    /// using static notmacro
    ///  somewhere  else
    /// var my_name = whoami();
    /// </summary>
    /// <param name="caller_name"></param>
    /// <returns>the caller name</returns>
    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static string
    whoami([CallerMemberName] string ? caller_name = null)
    {
        if (string.IsNullOrEmpty(caller_name))
            return "unknown";
        if (string.IsNullOrWhiteSpace(caller_name))
            return "unknown";
        return caller_name;
    }
}

    internal class log
{
    public readonly static string text_line = "-------------------------------------------------------------------------------";
    public readonly static string app_friendly_name = AppDomain.CurrentDomain.FriendlyName;

    static string app_name {
        get {
            return app_friendly_name; //  app_friendly_name.Substring(0, app_friendly_name.IndexOf('.'));
        }
    }

     readonly static string log_file_path_template_ = "{0}logs\\{1}.log";

     readonly static string log_file_path_ = string.Format(log_file_path_template_, AppContext.BaseDirectory, app_name);
    public log()
    {
        Log.Logger = new LoggerConfiguration()
       .MinimumLevel.Debug()
       .WriteTo.Console()
       // this path is obviously deeply wrong :P
       .WriteTo.File(log_file_path_, rollingInterval: RollingInterval.Day)
       .CreateLogger();

        log_header_info_();
    }

    // add the xunit test output sink to the serilog logger
    // https://github.com/trbenning/serilog-sinks-xunit#serilog-sinks-xunit
    // this is called from xUnit startup code
    // IF Serilog.Sinks.XUnit package is added
    public log(ITestOutputHelper output)
    {
        Log.Logger = new LoggerConfiguration()
       .MinimumLevel.Verbose()
       // this path is obviously deeply wrong :P
       .WriteTo.File(log_file_path_, rollingInterval: RollingInterval.Day)
        .WriteTo.TestOutput(output)
        .CreateLogger();

        log_header_info_();
    }

    // if xUnit then this will be shown in the log file only
    private static void log_header_info_()
    {
        Log.Information(text_line);
        Log.Information($"Starting {app_name}");
        Log.Information(text_line);
        Log.Information($"Launched from {Environment.CurrentDirectory}");
        Log.Information($"Physical location {AppDomain.CurrentDomain.BaseDirectory}");
        Log.Information($"AppContext.BaseDir {AppContext.BaseDirectory}");
        ProcessModule? pm_ = Process.GetCurrentProcess().MainModule;
        if (pm_ != null)
        {
            Log.Information($"Runtime Call {Path.GetDirectoryName(pm_.FileName)}");
        }
        Log.Information(text_line);
        Log.Information($"Log file location:{log_file_path_}");
        Log.Information(text_line);
    }

    ~log()
    {
        Log.CloseAndFlush();
    }

    internal void debug_(string msg_) { Log.Debug(msg_); }
    internal void info_(string msg_) { Log.Information(msg_); }
    internal void error_(string msg_) { Log.Error(msg_); }
    internal void fatal_(string msg_) { Log.Fatal(msg_); }

    static Lazy<log> lazy_log = new Lazy<log>(() => new log());

    static public log logger { get { return lazy_log.Value ; } }

    public static void debug(string msg_) { logger.debug_(msg_); }
    public static void info(string msg_) {  logger.info_(msg_); }
    public static void error(string msg_) { logger.error_(msg_); }
    public static void fatal(string msg_) { logger.fatal_(msg_); }

}

