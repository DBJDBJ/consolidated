using System;
using System.Threading;
using System.Threading.Tasks;
using distributed_caching_utilities;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Console;
using Microsoft.Extensions.Options;
// using NSubstitute;

namespace distributed_caching_utilities
{
    /// <inheritdoc />
    public class CommonCachingService : ICommonCachingService
    {
        IMemoryCache _memoryCache;
        IDistributedCache _distributedCache;

        private readonly ILogger<CommonCachingService> _logger;

        public ILogger<ICommonCachingService> logger() { return _logger; }
        

        private static Lazy<CommonCachingService> lazy_service_ = new(() =>
            {
                IMemoryCache memoryCache = new MemoryCache(new MemoryCacheOptions());
                var options = Options.Create(new MemoryDistributedCacheOptions());
                var just_distributed_Cache = new MemoryDistributedCache(options);
                ILoggerFactory loggerFactory = new LoggerFactory();
                var logger = loggerFactory.CreateLogger<CommonCachingService>();
                return new CommonCachingService(memoryCache, just_distributed_Cache, logger);
            });

        public static CommonCachingService default_service_
        {
            get => lazy_service_.Value;
        }


        public CommonCachingService(IMemoryCache memoryCache, IDistributedCache distributedCache, ILogger<CommonCachingService> logger)
        {
            _memoryCache = memoryCache ?? throw new ArgumentNullException(nameof(memoryCache));
            _distributedCache = distributedCache ?? throw new ArgumentNullException(nameof(distributedCache));
            _logger = logger;
        }

        public async Task<T> GetOrCreateAsync<T>(string key, Func<Task<T>> factory, TimeSpan memoryCacheExpiration, TimeSpan? distributedCacheExpiration) where T : class
        {
            if (typeof(T) == typeof(string))
            {
                throw new NotSupportedException("GetOrCreateAsync<T> does not support 'string' type. Please use GetOrCreateStringAsync method instead.");
            }
            return await GetOrCreateAsync(new JsonConverter<T>(), key, factory, memoryCacheExpiration, distributedCacheExpiration);
        }

        public async Task<string> GetOrCreateStringAsync(string key, Func<Task<string>> factory, TimeSpan memoryCacheExpiration, TimeSpan? distributedCacheExpiration = null)
        {
            return await GetOrCreateAsync(new StringConverter(), key, factory, memoryCacheExpiration, distributedCacheExpiration);
        }

        public async Task<T> GetOrCreateAsync<T>(IConverter<T> converter, string key, Func<Task<T>> factory, TimeSpan memoryCacheExpiration, TimeSpan? distributedCacheExpiration)
        {
            var local = await _memoryCache.GetOrCreateAsync(key, entry =>
            {
                TimeSpan calculatedDistributedCacheExpiration = distributedCacheExpiration ?? memoryCacheExpiration;

                entry.AbsoluteExpiration = DateTime.UtcNow.Add(memoryCacheExpiration);
                return GetFromDistributedCache(converter, key, factory, calculatedDistributedCacheExpiration);
            });

            return local;
        }

        private async Task<T> GetFromDistributedCache<T>(IConverter<T> converter, string generatedKey, Func<Task<T>> factory, TimeSpan calculatedDistributedCacheExpiration)
        {
            _logger.LogDebug($"Getting cached value from Distributed cache for key {generatedKey}");
            try
            {
                var cachedItem = await _distributedCache.GetStringAsync(generatedKey);
                if (cachedItem != null)
                {
                    _logger.LogDebug($"Read cached value from Distributed cache for key {generatedKey}");
                    var value = converter.Deserialize(cachedItem);
                    if (value is not null)
                        return value;

                    throw new ApplicationException($"Value not found for key: {generatedKey}");
                }
            }
            catch (Exception e)
            {
                _logger.LogWarning(e, "Exception getting cached item from Distributed cache.");
            }

            var item = await factory.Invoke();
            if (item != null)
            {
                try
                {
                    var cacheEntryOptions = new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = calculatedDistributedCacheExpiration };
                    var serializedValue = converter.Serialize(item);
                    await _distributedCache.SetStringAsync(generatedKey, serializedValue, cacheEntryOptions, CancellationToken.None);
                    _logger.LogDebug("Stored in Distributed cache for key {Key}", generatedKey);
                }
                catch (Exception e)
                {
                    _logger.LogWarning(e, "Exception storing cached item in Distributed cache.");
                }
            }
            return item;
        }
    }
}