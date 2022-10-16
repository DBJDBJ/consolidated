using Microsoft.EntityFrameworkCore;
using Serilog;
using MinKestrel;
// using System.Text.Json;
// using System.Diagnostics.Metrics;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

Log.Debug("dbj -- minkestrel -- Starting up");

try
{
    WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

    builder.Services.AddDbContext<ApiContext>(opt => opt.UseInMemoryDatabase(AppDomain.CurrentDomain.FriendlyName));
    builder.Services.AddScoped<IArticleService, ArticleService>();

    builder.Host.UseSerilog((context, config) =>
    {
        config.WriteTo.Console().ReadFrom.Configuration(context.Configuration);
    });

    //builder.Logging.AddSystemdConsole(options =>
    //{
    //    options.IncludeScopes = true;
    //    options.TimestampFormat = "hh:mm:ss ";
    //});

    WebApplication app = builder.Build();

        app.UseSerilogRequestLogging();

    var log = app.Logger;



#if ZERO
    #region log_levels_check
if (!log.IsEnabled(LogLevel.Trace)) {
    Console.WriteLine("LogLevel.Trace is not enabled...");
}
if (!log.IsEnabled(LogLevel.Information))
{
    Console.WriteLine("LogLevel.Information is not enabled...");
}
if (!log.IsEnabled(LogLevel.Debug))
{
    Console.WriteLine("LogLevel.Debug  is not enabled...");
}
if (!log.IsEnabled(LogLevel.Warning))
{
    Console.WriteLine("LogLevel.Warning is not enabled...");
}
if (!log.IsEnabled(LogLevel.Error))
{
    Console.WriteLine("LogLevel.Error is not enabled...");
}
if (!log.IsEnabled(LogLevel.Critical))
{
    Console.WriteLine("LogLevel.Critical  is not enabled...");
}
    #endregion log_levels_check
#endif

    app.MapGet("/", () => "Should not call the root url, just like that; use <url>/articles/ with json payload in the body.");

    app.MapGet("/articles",
        async (IArticleService articleService)
        =>
        {
            log.LogDebug("dbj -- minkestrel -- Going to deliver all articles");
            return await articleService.all_articles();
        }
        );

    // HTTP GET 
    // <url>/articles/1
    app.MapGet("/articles/{id}", async (int id, IArticleService articleService)
        =>
    {
        log.LogDebug("dbj -- minkestrel -- Going to deliver article id:{id}", id );
        await articleService.get_article_by_id(id);
    });

    // HTTP POST
    app.MapPost("/articles", async (ArticleRequest articleRequest, IArticleService articleService)
        =>
    {
        log.LogDebug("dbj -- minkestrel -- Going to create article:{articleRequest.ToString()}",articleRequest.ToString());
        await articleService.create_article(articleRequest);
    });

    // HTTP PUT
    app.MapPut("/articles", async (int id, ArticleRequest articleRequest, IArticleService articleService)
        =>
    {
        log.LogDebug("dbj -- minkestrel -- Going to update article id:{id}",id);
        await articleService.update_article(id, articleRequest);
    });

    // HTTP DELETE
    app.MapDelete("/articles", async (int id, IArticleService articleService)
        =>
    {
        log.LogDebug("dbj -- minkestrel -- Going to delete article id:{id}",id);
        await articleService.delete_article(id);
    });

#if DEBUG
    using (log.BeginScope(app.Environment.ApplicationName))
    {
        log.LogDebug(
            "dbj -- minkestrel -- Going to run the web application {ApplicationName}", app.Environment.ApplicationName
            );
#if TRUE
        foreach (var address in app.Urls)
        {
            log.LogDebug("dbj -- minkestrel -- Kestrel is listening on address: {address} ", address);
        }
#endif
    }
#endif

    app.Run();

}
catch (Exception ex)
{
    Log.Fatal(ex, "dbj -- minkestrel -- Unhandled exception");
}
finally
{
    Log.Information("dbj -- minkestrel -- Shut down is complete");
    Log.CloseAndFlush();
}
