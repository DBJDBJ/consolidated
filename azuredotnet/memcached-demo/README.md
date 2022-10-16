# memcached-demo

1. docker image pull memcached
2. docker container run -d -p 11211:11211 memcached

Unlike REDDIS, MEMCACHED is simple and fast. It serves min 90% of your use-cases.

## Why have I given up in Redis?

There is a well known [reddis dotnet6 client timeout problem](https://github.com/StackExchange/StackExchange.Redis/issues/1905), which is debated by REDDIS as a feature, which stoped me trying.

I assume [StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis/tree/main/src/StackExchange.Redis) is not in what is official Redis container. StackExchange.Redis is written in C#.

But they, it seems, both do exibit this same problem.

For an very good comparions [please see here](https://linuxhint.com/memcached-vs-redis-compared/).

# DotNet Client

There is only one. And author seems to have given up on dotnet 6 version. DI and all that. I do not blame him.

Good news is [libmemcached-awesome](https://github.com/awesomized/libmemcached). That is a resurrection of the original work from Brian Aker at [libmemcached.org](https://libmemcached.org/libMemcached.html). Bad news is C++ has crept into it. Although in a very beningn form. Still.

I might (might) provide a very thin layer of C# over it. Definitely no DI.

dbj@dbj.org