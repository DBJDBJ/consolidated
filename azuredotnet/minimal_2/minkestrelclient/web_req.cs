using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace minimal_api_client;

using static Program_context;

internal class Web_req
{
#pragma warning disable SYSLIB0014
    public static async Task<string> Post(string url_, string json_)
    {
        try
        {
            HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url_);
            req.Method = "POST";
            req.ContentType = "application/json";
            Stream stream = req.GetRequestStream();
            byte[] buffer = Encoding.UTF8.GetBytes(json_);
            stream.Write(buffer, 0, buffer.Length);
            HttpWebResponse? res = await req.GetResponseAsync() as HttpWebResponse;

            if (res is not null)
            {
                using System.IO.Stream strm = res.GetResponseStream();

                StreamReader reader = new(strm);
                return reader.ReadToEnd();
            }

        }
        catch (HttpRequestException x)
        {
            Writeln(Whoami() + ": " + x.Message);
        }
        catch (Exception x)
        {
            Writeln(Whoami() + ": " + x.Message);
        }


        return "";
    }
#pragma warning restore SYSLIB0014
}



