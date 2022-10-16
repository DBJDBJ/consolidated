using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
// using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using distributed_caching_utilities;
using System;
using System.Linq;
using System.Threading.Tasks;

using Xunit;

namespace Caching.Tests
{
     public class CommonCacheServiceUnitTests
    {
        private const string test_string_value_ = "test";

        private sealed class TestClass
        {
            public string MyProperty { get; set; }
        }

        [Fact]
        public async Task GetOrCreateStringAsync_EmptyCache()
        {
            var result = await cacheService.GetOrCreateStringAsync(generatedKey, () => Task.FromResult(test_string_value_), TimeSpan.FromSeconds(30), TimeSpan.FromMinutes(5));

            Assert.Equal(test_string_value_, result);

            logger.Received(1).Log(LogLevel.Debug, $"Getting cached value from Distributed cache for key {generatedKey}");
            logger.Received(0).Log(LogLevel.Debug, $"Read cached value from Distributed cache for key {generatedKey}");
            logger.Received(1).Log(LogLevel.Debug, $"Stored in Distributed cache for key {generatedKey}");
        }

        [Fact]
        public async Task GetOrCreateStringAsync_MemoryEmpty_just_distributed_Contains()
        {
            var result = await cacheService.GetOrCreateStringAsync(generatedKey, () => Task.FromResult(test_string_value_), TimeSpan.FromSeconds(30), TimeSpan.FromMinutes(5));

            Assert.Equal(test_string_value_, result);

            logger.Received(1).Log(LogLevel.Debug, $"Getting cached value from Distributed cache for key {generatedKey}");
            logger.Received(1).Log(LogLevel.Debug, $"Read cached value from Distributed cache for key {generatedKey}");
            logger.Received(0).Log(LogLevel.Debug, $"Stored in Distributed cache for key {generatedKey}");
        }

        [Fact]
        public async Task GetOrCreateStringAsync_MemoryEmpty_just_distributed_Contains_CallTwice()
        {
            var result = await cacheService.GetOrCreateStringAsync(generatedKey, () => Task.FromResult(test_string_value_), TimeSpan.FromSeconds(30), TimeSpan.FromMinutes(5));
            Assert.Equal(test_string_value_, result);

            result = await cacheService.GetOrCreateStringAsync(generatedKey, () => Task.FromResult(test_string_value_), TimeSpan.FromSeconds(30), TimeSpan.FromMinutes(5));
            Assert.Equal(test_string_value_, result);

            logger.Received(1).Log(LogLevel.Debug, $"Getting cached value from Distributed cache for key {generatedKey}");
            logger.Received(1).Log(LogLevel.Debug, $"Read cached value from Distributed cache for key {generatedKey}");
            logger.Received(0).Log(LogLevel.Debug, $"Stored in Distributed cache for key {generatedKey}");
        }

        [Fact]
        public async Task GetOrCreateStringAsync_MemoryContains()
        {
            var result = await cacheService.GetOrCreateStringAsync(generatedKey, () => Task.FromResult(test_string_value_), TimeSpan.FromSeconds(30), TimeSpan.FromMinutes(5));

            Assert.Equal(test_string_value_, result);

            logger.Received(0).Log(LogLevel.Debug, $"Getting cached value from Distributed cache for key {generatedKey}");
            logger.Received(0).Log(LogLevel.Debug, $"Read cached value from Distributed cache for key {generatedKey}");
            logger.Received(0).Log(LogLevel.Debug, $"Stored in Distributed cache for key {generatedKey}");
        }

        [Fact]
        public async Task GetOrCreateAsync_EmptyCache()
        {
            var testObject = new TestClass { MyProperty = test_string_value_ };
            var result = await cacheService.GetOrCreateAsync(generatedKey, () => Task.FromResult(testObject), TimeSpan.FromSeconds(30), TimeSpan.FromMinutes(5));

            Assert.Equal(test_string_value_, result.MyProperty);
            
            logger.Received(1).Log(LogLevel.Debug, $"Getting cached value from Distributed cache for key {generatedKey}");
            logger.Received(0).Log(LogLevel.Debug, $"Read cached value from Distributed cache for key {generatedKey}");
            logger.Received(1).Log(LogLevel.Debug, $"Stored in Distributed cache for key {generatedKey}");
        }

        [Fact]
        public async Task GetOrCreateAsync_MemoryEmpty_just_distributed_Contains()
        {
            var testObject = new TestClass { MyProperty = test_string_value_ };
            var result = await cacheService.GetOrCreateAsync(generatedKey, () => Task.FromResult(testObject), TimeSpan.FromSeconds(30), TimeSpan.FromMinutes(5));

            Assert.Equal(test_string_value_, result.MyProperty);

            logger.Received(1).Log(LogLevel.Debug, $"Getting cached value from Distributed cache for key {generatedKey}");
            logger.Received(1).Log(LogLevel.Debug, $"Read cached value from Distributed cache for key {generatedKey}");
            logger.Received(0).Log(LogLevel.Debug, $"Stored in Distributed cache for key {generatedKey}");
        }

        [Fact]
        public async Task GetOrCreateAsync_MemoryContains()
        {
            var testObject = new TestClass { MyProperty = test_string_value_ };
            await cacheService.GetOrCreateAsync(generatedKey, () => Task.FromResult(testObject), TimeSpan.FromSeconds(30), TimeSpan.FromMinutes(5));

            var result = await cacheService.GetOrCreateAsync(generatedKey, () => Task.FromResult(testObject), TimeSpan.FromSeconds(30), TimeSpan.FromMinutes(5));

            Assert.Equal(test_string_value_, result.MyProperty);

            logger.Received(0).Log(LogLevel.Debug, $"Getting cached value from Distributed cache for key {generatedKey}");
            logger.Received(0).Log(LogLevel.Debug, $"Read cached value from Distributed cache for key {generatedKey}");
            logger.Received(0).Log(LogLevel.Debug, $"Stored in Distributed cache for key {generatedKey}");
        }

        [Fact]
        public async Task GetOrCreateAsync_NotSupportedType()
        {
            var result = await cacheService.GetOrCreateAsync(generatedKey, () => Task.FromResult(test_string_value_), TimeSpan.FromSeconds(30), TimeSpan.FromMinutes(5));
        }

        private IMemoryCache memoryCache { get => new MemoryCache(new MemoryCacheOptions()); }
        private string generatedKey { get => "2DF9629A-E7B3-4678-8F5C-2DBFB70BB43B"; }
        private CommonCachingService cacheService { get => CommonCachingService.default_service_; }
        private ILogger<CommonCachingService> logger { get => Substitute.For<LoggerMock<CommonCachingService>>(); }
    }
}
