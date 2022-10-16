using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("Caching.Tests")]
namespace distributed_caching_utilities
{
    public interface IConverter<T>
    {
        string Serialize(object obj);

        T ? Deserialize(string value);
    }
}