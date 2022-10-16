using distributed_caching_utilities;

namespace distributed_caching_utilities
{
    internal class StringConverter : IConverter<string>
    {
        public string Deserialize(string value)
        {
            return value;
        }

        public string Serialize(object obj)
        {
            if (obj is not null)
            {
                return obj.ToString() ?? "" ;
            }
            return "";
        }
    }
}