using Microsoft.Net.Http.Headers;
using Minimal_API;
// using System;
// using System.Diagnostics.CodeAnalysis;
//using System.Collections.Generic;
//using System.Linq;
// using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
//using System.Text;
// using System.Threading.Tasks;

using static Minimal_API.Article;

namespace minimal_api_client;

using static Program_context;

internal class Http_test_client
{
    public static async Task<HttpResponseMessage?> Post_jsonstring(string base_url_, string json_)
    {
        Writeln( base_url_);
        HttpResponseMessage retval_ = new() ;
        try
        {
            retval_ = await SendJsonContent(
                base_url_,
                HttpMethod.Post,
                // JsonContent.Create(new ArticleRequest(Whoami() + " Title", Whoami() + " Content", DateTime.Now))
                // string to UTF8 
                JsonContent.Create( ToStream(json_) )
                ); 
        }
        catch (HttpRequestException x)
        {
            Writeln( Whoami() + ": " +  x.Message);
        }
        catch (Exception x)
        {
            Writeln(Whoami() + ": " + x.Message);
        }
        return retval_;
    }
        // List<Article>
        public static async Task<string?> Get_string(string base_url_)
    {
        string response = "";
        try
        {
            using var client_ = new HttpClient();
          
                response = await client_.GetStringAsync(base_url_ + "/articles");
          
        }
        catch (HttpRequestException x)
        {
            Console.WriteLine(x.Message);
        }
        return response;
    }
   
    private static async Task<HttpResponseMessage> SendJsonContent(
        string uri, 
        HttpMethod http_method_,
        JsonContent content_
        )
    {
        Writeln(Whoami());
        using var client_ = new HttpClient();
        using var postRequest = new HttpRequestMessage(http_method_ /*HttpMethod.Post*/, uri)
        {
            Content =  content_            
        };

        // Assert( postRequest.Content?.Headers?.ContentType?.ToString() == "application/json" ) ;

        //Writeln("About to send HttpRequestMessage");
        //Writeln(postRequest.ToString());
        //Writeln($"Content as string: { await postRequest.Content.ReadAsStringAsync()}") ; 

        var postResponse = await client_.SendAsync(postRequest);

        // return HttpResponseMessage or throw HttpRequestException
        return postResponse.EnsureSuccessStatusCode();
    }
}

// this requires object to which json can be transformed to from
//private static async Task<Article?> GetJsonFromContent(
//    string uri, 
//    HttpClient httpClient
//    )
//{
//    var request = new HttpRequestMessage(HttpMethod.Get, uri);
//    request.Headers.TryAddWithoutValidation("some-header", "some-value");

//    using var response = await httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead);

//    if (response.IsSuccessStatusCode)
//    {
//        // perhaps check some headers before deserialising

//        try
//        {
//            return await response.Content.ReadFromJsonAsync<Article>();
//        }
//        catch (NotSupportedException) // When content type is not valid
//        {
//            Console.WriteLine("The content type is not supported.");
//        }
//        catch (System.Text.Json.JsonException) // Invalid JSON
//        {
//            Console.WriteLine("Invalid JSON.");
//        }
//    }

//    return null;
//}

//public static JsonSerializerOptions Json_srz_ops => new JsonSerializerOptions() ;
//public static MediaTypeHeaderValue Json_m_type => MediaTypeHeaderValue.Parse("application/json") ;