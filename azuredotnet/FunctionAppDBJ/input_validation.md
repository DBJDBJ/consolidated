
Standard (legacy) HTTP protocol allows for passing arguments. Example:

```
https://argos.io/create_case?description=Phillips&casenumber=42
```

JSON formatted string used as HTTP payload allows for much more structured and controlled parameters passing.

## JSON Input is the key to evaluated function arguments

> A request payload is data that clients send to the server in the body of an HTTP POST, PUT, or PATCH message. 
> 
> [To send the JSON with payload to the REST API endpoint, you need to enclose the JSON data in the body of the HTTP request and indicate the data type of the request body with the "Content-Type: application/json" request header. If the client expects a response from the server in JSON format, it also needs to send the "Accept: application/json" header to the server.](https://reqbin.com/req/2xhbguy8/json-payload-example#:~:text=To%20send%20the%20JSON%20with,application%2Fjson%22%20request%20header.)

## Azure Function 

Azure Functions runtime, (version 3.x and above), will automatically parse a JSON request body and pass the result in as an argument to the registered method.

In the c# code we declare the JSON object as in this example: 

```c#
public class CreateCaseInput
{
  public string Description { get; set; }
  public string CaseNumber { get; set; }
}
```

For the following Azure Function definition synopsis, The Azure Function framework will automatically parse the incoming request body into a `CreateCaseInput` instance.

```c#
[FunctionName("CreateCase")]
public async Task CreateEntryAsync(
  [HttpTrigger(AuthorizationLevel.Function, "post", Route = null )]
  HttpRequest req,
  // parsed from HTTP payload by runtime
  CreateCaseInput input 
  )
{
  ... code here ...
}
```
## Testing

With testing the Azure functions properly and extensively and repeatedly, one can be sure that the incoming JSON will be converted into the expected object correctly.

Writing unit tests for Azure Functions is not trivial because it requires HTTP post/get mockup insrastructure. Azure Function xUNIT example: https://www.serverlessnotes.com/docs/testing-c-functions-with-xunit.

Much easier method is to break debug your function code and use the ['Postman' CLI](https://www.postman.com/downloads/), to call the localhost URI's required.

![](media/postman-test.png)



# Road Map: API publication and documentation

## Expose serverless APIs from HTTP endpoints using Azure API Management

> [Azure Functions integrates with Azure API Management in the portal to let you expose your HTTP trigger function endpoints as REST APIs. These APIs are described using an OpenAPI definition. ](https://docs.microsoft.com/en-us/azure/azure-functions/functions-openapi-definition)

[This is costing money](https://azure.microsoft.com/en-gb/pricing/details/api-management/) and is primarily inteded for companies publishin API's as products.

## OpenAPI (preview, just FYI)

[REST APIs are often described using an OpenAPI definition. This file contains information about operations in an API and how the request and response data for the API should be structured.](https://docs.microsoft.com/en-us/azure/azure-functions/openapi-apim-integrate-visual-studio)