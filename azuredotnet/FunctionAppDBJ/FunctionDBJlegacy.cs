using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

using static FunctionAppDBJ.notmacros;
/*

Please see the README.MD

 */
namespace FunctionAppDBJ
{
    // in case we are receiving a json payload in the HTTP request
    internal struct name_and_number { 
        public string name { get; set;  }
        public int number { get; set; }
    }
    public static class FunctionDBJlegacy
    {
        /// <summary>
        /// advice: always use your private naming schema such as 
        /// 'follow my names with unerscore'
        /// </summary>
        /// <param name="msg_">message to be logged</param>
        /// <param name="log">logger instance</param>
        public static void log_info_(ILogger log, string msg_)
        {
            log.LogInformation(msg_);
        }

        /// <summary>
        /// Scenario
        /// Trigger: HTTP
        /// Input Binding:
        /// Output Binding:
        /// </summary>
        /// <param name="req">HTTP request object</param>
        /// <param name="log">instance of the ILogger implementation</param>
        /// <returns>HTTP response object inside a Task object</returns>
        [FunctionName("FunctionDBJlegacy")]
        public static /*async* Task< */ IActionResult /* > */ Run(
            // attribute based trigger definition
            // Function.json is another mechanism
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log_info_(log,$"C# HTTP triggered function {whoami()} is about to process a request.");

            // try and obtain parameters hoping they are sent using the 
            // standard HTTP protocol (not using json)
            string name = req.Query["name"];
            string number = req.Query["number"];

            string responseMessage = $"\nHTTP triggered function {whoami()} executed  successfully.";
            responseMessage += string.IsNullOrEmpty(name)
                    ? "\nThere was no 'name' argument in the query string."
                    : $"\nname argument passed : {name}.";

            responseMessage += (string.IsNullOrEmpty(number)) 
            ? "\nThere was no 'number' argument in the query string."
            : $"\nNumber argument passed: {number}.";
            
            log_info_(log, $"{whoami()} is about to exit with OK result.");

            // notice we return HTTP code 200 but we are missing some (or all) arguments
            return new OkObjectResult(responseMessage);
        }
    }
}
