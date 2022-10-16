using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using distributed_caching_utilities;
using System;
using System.Threading.Tasks;

namespace basic_caching_examples
{
    class Program
    {
        static async Task Main(string[] args)
        {
            // var cachingService = caching_service ;
            var cachingService = CommonCachingService.default_service_ ;

            string testKey = "TestKey";
            string testKey2 = "TestKey_2";

            var log_ = cachingService.logger() ;

            log_.LogInformation("Starting with cache calls...");

            log_.LogInformation($"Key {testKey}, take 1");
            await cachingService.GetOrCreateStringAsync(testKey, FunctionThatCreatesTaskOfT(), TimeSpan.FromMinutes(1), TimeSpan.FromMinutes(5));

            log_.LogInformation($"Key {testKey}, take 2");            
            await cachingService.GetOrCreateStringAsync(testKey, FunctionThatCreatesTaskOfT(), TimeSpan.FromMinutes(1), TimeSpan.FromMinutes(5));

            log_.LogInformation($"Key {testKey}, take 3");            
            await cachingService.GetOrCreateStringAsync(testKey, FunctionThatCreatesTaskOfT(), TimeSpan.FromMinutes(1), TimeSpan.FromMinutes(5));

            // It is a new Key, it will not be able to get value from cache.
            log_.LogInformation($"Key {testKey2}, take 1");            
            await cachingService.GetOrCreateStringAsync(testKey2, FunctionThatCreatesTaskOfT(), TimeSpan.FromMinutes(1), TimeSpan.FromMinutes(5));

            log_.LogInformation("...Cache calls finished.");

            Console.ReadKey();
        }
        
        /// <summary>
        /// Creates a Function that will create Task of T value.
        /// This Function will not be executed if there is a cached vale in either Memory Cache or Distributed Cache.
        /// </summary>
        /// <returns>Function for Task of T value.</returns>
        private static Func<Task<string>> FunctionThatCreatesTaskOfT()
        {            
            return () =>
            {
                // This part will not execute if there is a key match in cache in either Memory or Distributed cache
                // We are executing method, not getting from cache.
                return Task.FromResult("TestValue");
            };
        }

        /// <summary>
        /// lazy build using DI
        /// </summary>
        private static Lazy<ICommonCachingService> LazyBuildCachingService = new (() =>
        {
            var services = new ServiceCollection();

            services.AddLogging(configure => configure.AddConsole());

            services.AddMemoryCache();
            services.AddDistributedMemoryCache();

            services.AddTransient<ICommonCachingService, distributed_caching_utilities.CommonCachingService>();

            var provider = services.BuildServiceProvider();

            return provider.GetRequiredService<ICommonCachingService>();

        });

        public static ICommonCachingService caching_service
        {
            get => LazyBuildCachingService.Value;
        }

    }
}
