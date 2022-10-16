# FunctionAppDBJ

## DBJ Azure Function Template & KB

# Must reads 

## [Organize functions by privilege](https://docs.microsoft.com/en-us/azure/azure-functions/performance-reliability#organize-functions-by-privilege)
Connection strings and other credentials stored in application settings gives all of the functions in the function app the same set of permissions in the associated resource. Consider minimizing the number of functions with access to specific credentials by moving functions that don't use those credentials to a separate function app. You can always use techniques such as function chaining to pass data between functions in different function apps.

## The key KB location: 
https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings?tabs=csharp

## Best practices for reliable Azure Functions:
https://docs.microsoft.com/en-us/azure/azure-functions/functions-best-practices?tabs=csharp

# Monitoring is the key for resilient and feasible production code

## [Monitor effectively](https://docs.microsoft.com/en-us/azure/azure-functions/functions-best-practices?tabs=csharp#monitor-effectively)

Azure Functions offers built-in integration with Azure Application Insights to monitor your function execution and traces written from your code. To learn more, see Monitor Azure Functions. Azure Monitor also provides facilities for monitoring the health of the function app itself. To learn more, see Using Azure Monitor Metric with Azure Functions.

You should be aware of the following considerations when using Application Insights integration to monitor your functions:

Make sure that the AzureWebJobsDashboard application setting is removed. This setting was supported in older version of Functions. If it exists, removing AzureWebJobsDashboard improves performance of your functions.

Review the Application Insights logs. If data you expect to find is missing, consider adjusting the sampling settings to better capture your monitoring scenario. You can use the excludedTypes setting to exclude certain types from sampling, such as Request or Exception. To learn more, see Configure sampling.

Azure Functions also allows you to send system-generated and user-generated logs to Azure Monitor Logs. Integration with Azure Monitor Logs is currently in preview.

## Minimize (or never) use of Reflection!

[Use Stack trace (if possible)](https://stackoverflow.com/a/1348853)

## You Tube candidates:
Triggers & Bindings: https://www.youtube.com/watch?v=5PQ4jhov8rw