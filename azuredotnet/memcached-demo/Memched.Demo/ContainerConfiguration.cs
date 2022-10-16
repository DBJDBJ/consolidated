using Enyim.Caching.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
// using Microsoft.Extensions.Logging.Console;

namespace Memched.Demo
{
    internal static class ContainerConfiguration
    {
        public static IServiceProvider Configure()
        {
            /*
            make sure of this be executed beforehand:
            docker run -d -p 11211:11211 --name dbjcache memcached
            */
            return new ServiceCollection()
            .AddLogging(builder =>
            {
                builder.ClearProviders();
                // see the lazy logger inside program
                // builder.AddConsole();
                // builder.AddDebug();
                // builder.SetMinimumLevel(LogLevel.Debug);
                builder.SetMinimumLevel(LogLevel.Information);
                builder.AddSimpleConsole(options =>
       {
           options.IncludeScopes = true;
           options.SingleLine = true;
           options.TimestampFormat = "hh:mm:ss ";
           options.ColorBehavior = Microsoft.Extensions.Logging.Console.LoggerColorBehavior.Enabled;
       });
            })
            .AddEnyimMemcached(o =>
            o.Servers = new List<Server> { new Server { Address = "localhost", Port = 11211 } }
            )
            .AddSingleton<ICacheProvider, CacheProvider>()
            .AddSingleton<ICacheRepository, CacheRepository>()
            .AddTransient<Program>()
            .BuildServiceProvider();

#if DEBUG
            //             show_service_collection((ServiceCollection)(service_collection_));
#endif
        }

        // note: this is casted to interface, NOT the type Microsoft has implemented
        static void show_service_collection(ServiceCollection service_collection_)
        {
            foreach (ServiceDescriptor descriptor in service_collection_)
            {
                var impstr = descriptor.ImplementationType?.ToString();

                if ((impstr != null) && (false == impstr.Contains("Microsoft")))
                {
                    Console.WriteLine("==================================\nService:" +
                    $"\ntype: {descriptor.ServiceType.ToString()}");
                    if (descriptor.ImplementationType is null)
                    {
                        Console.WriteLine($"Not registerd implementation for : {descriptor.ServiceType.ToString()} ");
                    }
                    else
                    {
                        Console.WriteLine($"implementation type: {descriptor.ImplementationType?.ToString()}" +
                                          $"\nlifetime: {descriptor.Lifetime.ToString()}");
                    }
                }
            }
        }
    }
}
