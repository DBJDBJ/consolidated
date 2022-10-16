using System.Text.Json;

namespace distributed_caching_utilities
{
    public class JsonConverter<T> : IConverter<T>
    {
        public T ? Deserialize(string value)
        {
            T ? result = default;

            if (value is not null)
            {
                result = JsonSerializer.Deserialize<T>(value);
            }

            return result;
        }

        public string Serialize(object obj)
        {
            return JsonSerializer.Serialize(obj);
        }
    }
}