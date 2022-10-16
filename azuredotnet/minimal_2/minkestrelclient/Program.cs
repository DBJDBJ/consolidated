using System.Text.Json;
using System.Text.Json.Nodes;

namespace minimal_api_client;

using static Program_context;

class Program
{
    readonly static string url_ = "http://localhost:8000";

    public static string Articles_url_
    {
        get
        {
            return url_+ "/articles";
        }
    }

    // https://www.stevefenton.co.uk/2022/02/raw-string-literals-in-c/
    public static string Article_json_str_
    {
        get
        {
            return 
"""
"{ "title" : "web_request", "content": "some content", "publishedat" : "
""" 
+ System.DateTime.Now + 
"""
"}"
""";
        }
    }
    static async Task Main()
    {
        try
        {
            /*string rez_*/ _ = await Web_req.Post(Articles_url_, Article_json_str_);

            // Writeln($"Result {rez_}");


            /*HttpResponseMessage ? rm_*/_ = await Http_test_client.Post_jsonstring(Articles_url_, Article_json_str_);

            // Writeln($"HttpResponseMessage Content: {await rm_?.Content?.ReadAsStringAsync()}");

            print_json_string(
                await Http_test_client.Get_string(url_)
                );
        }
        catch (Exception x)
        {
            // using Program_context
            Name();
            Writeln(x.Message);
        }
        Writeln("\nDone...\n");
    }

    public static JsonSerializerOptions js_options
    {
        get { return new JsonSerializerOptions { WriteIndented = true }; }
    }

    static void print_json_string(string? json_)
    {
        if (string.IsNullOrEmpty(json_)) return;
        // Create a JsonNode DOM from a JSON string.
        JsonNode node_ = JsonNode.Parse(json_ ?? "{}")!;
        // Write JSON from a JsonNode
        // using Program_context
        Writeln(node_!.ToJsonString(js_options));
    }
}

/*
            IHost host = builder.Build();

            var config_ = host.Services.GetRequiredService<IConfiguration>();

            var svs = config_.GetRequiredSection("SupportedVersions");

            var v3_ = svs.GetValue<string>("v3");
*/

