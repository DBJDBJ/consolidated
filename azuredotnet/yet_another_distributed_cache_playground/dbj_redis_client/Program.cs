// using Microsoft.Extensions.Caching.Redis;
using StackExchange.Redis;
using System.Configuration;
using Microsoft.Extensions.Logging;


// Here is the pattern recommended by the Azure Redis Cache team:
internal sealed class dbj_redis
{
    public sealed class AsyncLazy<T> : Lazy<Task<T>>
    {
        public AsyncLazy(Func<T> valueFactory) :
            base(() => Task.Factory.StartNew(valueFactory))
        { }

        public AsyncLazy(Func<Task<T>> taskFactory) :
            base(() => Task.Factory.StartNew(() => taskFactory()).Unwrap())
        { }

        // public TaskAwaiter<T> GetAwaiter() { return Value.GetAwaiter(); }
    }
    // To allow this multiplexer to continue retrying until it's able to connect,
    // use abortConnect=false in your connection 
    // Note : For Azure Redis, the cloud instance property
    // is already set with abortConnect=false  as the default behavior.
    // azure: "mycache.redis.cache.windows.net,abortConnect=false,ssl=true,password=..."
    public static readonly string redis_cs = "redis://default:redispw@localhost:49153,abortConnect=false,name='dbj',connectTimeout=10000,connectRetry=33";

    private static Lazy<ConnectionMultiplexer> lazyConnection = new(() =>
    {
        return ConnectionMultiplexer.Connect(redis_cs);
    });

    public static ConnectionMultiplexer connection
    {
        get
        {
            // return ConnectionMultiplexer.Connect(redis_cs);
            return lazyConnection.Value;
        }
    }

    private static AsyncLazy<ConnectionMultiplexer> lazyConnectionAsync = new(() =>
    {
        return ConnectionMultiplexer.ConnectAsync(redis_cs);
    });

    public static Task<ConnectionMultiplexer> connection_lazy
    {
        get
        {
            // return ConnectionMultiplexer.Connect(redis_cs);
            return lazyConnectionAsync.Value;
        }
    }
    // See https://aka.ms/new-logger-template for more information

    internal sealed class program
    {
        private static Lazy<ILogger> lazy_logger = new(() =>
        {
            return new LoggerFactory().CreateLogger("Microsoft");
        });

        public static ILogger logger
        {
            get
            {
                return lazy_logger.Value;
            }
        }

        static public async Task run()
        {
            var redis = await dbj_redis.connection_lazy;

            logger.LogInformation($"Hello, {dbj_redis.redis_cs}");

            IDatabase db = redis.GetDatabase();

            /*
            redis allows raw binary data for both keys and values - the usage is identical:
            */
            // byte[] key = Encoding.ASCII.GetBytes("my_key"), value = Encoding.ASCII.GetBytes("my_value") ;
            // db.StringSet(key, value);
            
            // byte[] value = db.StringGet(Encoding.ASCII.GetString(key));
            /* */
 
            string value = "abcdefg";
            _ = await db.StringSetAsync("mykey", value);
            //
            string? stored_value = await db.StringGetAsync("mykey");
            logger.LogInformation(stored_value); // writes: "abcdefg"
        }
        static async Task Main()
        {
            try
            {
                // ah dot net little beauties
                int workerThreads, ioCompletionThreads;
                ThreadPool.GetMaxThreads(out workerThreads, out ioCompletionThreads);
                ThreadPool.SetMaxThreads(Math.Max(10000, workerThreads), Math.Max(10000, ioCompletionThreads));
                ThreadPool.SetMinThreads(10000, 10000);

                await run();
            }
            catch (Exception x_)
            {
                logger.LogError($"Exception: {x_.Message}");
            }
        }
    }
}
/*
redis allows raw binary data for both keys and values - the usage is identical:

byte[] key = ..., value = ...;
db.StringSet(key, value);
...
byte[] value = db.StringGet(key);
*/
