// https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/async/cancel-async-tasks-after-a-period-of-time
using System.Diagnostics;
using System.Data.SqlClient;
using Microsoft.Extensions.Logging;


class Program
{
    static readonly CancellationTokenSource timeout_cancelation_controler_ = new CancellationTokenSource();
    // obviously to be in the config or env var
    static readonly int time_out_miliseconds = 3500; 
    /* */
    static readonly string sql_statement = @"SELECT 
          [EmailAddress]
          ,[ShortName]
          ,[Role]
          ,[IsInactive]
      FROM [ArgosConv].[dbo].[User]";
    /*
      WHERE [EmailAddress] LIKE 'ian.w%';
    */
    static readonly string connection_string = "Server=ipan-test-db-vm.mm-corp.net; Database=ArgosConv;Integrated Security=True;";
    static async Task Main()
    {
        log.LogDebug($"Application {AppDomain.CurrentDomain.FriendlyName} started.");

        try
        {
            // milliseconds
            timeout_cancelation_controler_.CancelAfter(time_out_miliseconds);
            await argos_conv_qry(Program.sql_statement);
        }
        catch (OperationCanceledException)
        {
            log.LogCritical("\nTasks cancelled: timed out.\n");
        }
        catch (SqlException x_)
        {
            log.LogCritical(x_.Message);
        }
        catch (Exception x_)
        {
            log.LogCritical(x_.Message);
        }
        finally
        {
            timeout_cancelation_controler_.Dispose();
        }

        log.LogDebug($"Application {AppDomain.CurrentDomain.FriendlyName} finished.");
    }

    static async Task<int> argos_conv_qry(string statement_)
    {
        Console.WriteLine("Trying: " + connection_string);
        using (var conn = new SqlConnection(connection_string))
        {
            conn.Open();
            // conn status must be opened here
            using (var cmd = conn.CreateCommand())
            {
                cmd.CommandText = statement_;
                // cmd.Parameters.AddWithValue("@id", index);
                using (var reader = await cmd.ExecuteReaderAsync(System.Data.CommandBehavior.SequentialAccess))
                {
                    log.LogInformation("---------------------------------------------------");
                    log.LogInformation("Result of: " + statement_);
                    log.LogInformation("---------------------------------------------------");
                    int counter_ = 1 ;
                    while (await reader.ReadAsync())
                    {
                        var data = await reader.GetTextReader(0).ReadToEndAsync();
                        log.LogInformation("\t" + (counter_++) + ":\t" + data);
                    }
                }
            }
        }

        return 42;
    }

    static Lazy<ILogger<Program>> lazy_logger = new(() =>
    {
        using ILoggerFactory loggerFactory =
                    LoggerFactory.Create(builder =>
                        builder
                        .ClearProviders()
                        .SetMinimumLevel(LogLevel.Debug)
                        .AddSimpleConsole(options =>
                        {
                            options.ColorBehavior =
                            Microsoft.Extensions.Logging.Console.LoggerColorBehavior.Enabled;
                            options.IncludeScopes = true;
                            options.SingleLine = true;
                            options.TimestampFormat = "hh:mm:ss ";
                        }));
        /*ILogger<Program> logger =*/
        return loggerFactory.CreateLogger<Program>();
    }
    );

    internal static ILogger<Program> log { get { return lazy_logger.Value; } }

#if USE_HTTP_CLIENT

    static readonly HttpClient s_client = new HttpClient
    {
        MaxResponseContentBufferSize = 1_000_000
    };

    static async Task SumPageSizesAsync()
    {
        var stopwatch = Stopwatch.StartNew();

        int total = 0;
        foreach (string url in s_urlList)
        {
            int contentLength = await ProcessUrlAsync(url, s_client, timeout_cancelation_controler_.Token);
            total += contentLength;
        }

        stopwatch.Stop();

        Console.WriteLine($"\nTotal bytes returned:  {total:#,#}");
        Console.WriteLine($"Elapsed time:          {stopwatch.Elapsed}\n");
    }

    static async Task<int> ProcessUrlAsync(string url, HttpClient client, CancellationToken token)
    {
        HttpResponseMessage response = await client.GetAsync(url, token);
        byte[] content = await response.Content.ReadAsByteArrayAsync(token);
        Console.WriteLine($"{url,-60} {content.Length,10:#,#}");

        return content.Length;
    }
//    #ifdef USE_HTTP_CLIENT

#endif

}