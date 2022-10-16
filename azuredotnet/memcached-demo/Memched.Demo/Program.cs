using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.CommandLine;
// using Enyim.Caching.Configuration;

namespace Memched.Demo;

internal class Program
{
    readonly ICacheRepository memrepo;
    readonly ICacheProvider memprov;
    readonly ILogger<Program> simple_logger;

    // the trick is framework calls this constructor
    // as Program is registered as a transient service
    public Program(ICacheRepository reposit_, ICacheProvider provide_)
    {
        memrepo = reposit_;
        memprov = provide_;

        simple_logger = (ILogger<Program>)Program.logger ;

        using (simple_logger.BeginScope("Starting application"))
        {
            simple_logger.LogDebug($"Friendly name: {AppDomain.CurrentDomain.FriendlyName}");
        }
    }

    ~Program()
    {
        using (simple_logger.BeginScope("Ending application"))
        {
            simple_logger.LogDebug($"Friendly name: {AppDomain.CurrentDomain.FriendlyName}");
        }
    }

     public void run_get_set_demo( )
     {
        string key = "key", val = "hello";
        // using (prog_.simple_logger.BeginScope<Program>("not very usefull logging feature"))
        // {
            simple_logger.LogTrace($"About to set in memcached, key: {key}, value: {val}");
            memrepo.Set<string>(key, val);
            simple_logger.LogTrace("About to get from memcached");
            var value_ = memprov.GetCache<string>(key);

            simple_logger.LogInformation($"got: {value_}\n\nAll done, press Return\n\n");
            Console.Read(); // stop and wait, there are many background threads in dotnet
        // }
     }     
     
     public string run_get(string key)
     {
        // using (prog_.simple_logger.BeginScope<Program>("not very usefull logging feature"))
        // {
            // simple_logger.LogTrace("About to set in memcached");
            // memrepo.Set<string>("key", "hello");
            simple_logger.LogTrace($"About to get val by the key: {key}");
            return memprov.GetCache<string>(key);
        // }
     }

     public void run_set(string key, string val )
     {
            simple_logger.LogTrace($"About to set {val} by the key: {key}");
            memrepo.Set<string>( key, val);
     }

    public static async Task Main(string[] args)
    {
        // basicaly just initalising the service and the program is the service
        var prog_ =  program_ ; 
        // cli commands and arguments setup
        CLI.setup();

        await CLI.root_.InvokeAsync(args);
    }
    //
    
    static Lazy<Program> lazy_program = new Lazy<Program>(
    () =>
    {
        var serviceProvider = ContainerConfiguration.Configure();
        var prog_ = serviceProvider.GetRequiredService<Program>() ?? throw new ArgumentNullException("Program");
        return prog_ ;
    });

    public static Program program_ { get { return lazy_program.Value; }} 
    //
    // create ILogger implementation
    //
    static Lazy<ILogger> lazy_logger = new Lazy<ILogger>(
    () =>
    {
        using (var loggerFactory =
       LoggerFactory.Create(builder =>
       builder
       .SetMinimumLevel(LogLevel.Information)
       .AddSimpleConsole(options =>
       {
           options.IncludeScopes = true;
           options.SingleLine = true;
           options.TimestampFormat = "hh:mm:ss ";
           options.ColorBehavior = Microsoft.Extensions.Logging.Console.LoggerColorBehavior.Enabled;
       })))
        {
            return loggerFactory.CreateLogger<Program>();
        }
    }
    );

    public static ILogger<Program> logger { get { return (ILogger<Program>)lazy_logger.Value; }}

}
