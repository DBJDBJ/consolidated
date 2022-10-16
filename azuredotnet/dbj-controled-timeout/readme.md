
![](https://industrialsafetyguide.com/wp-content/uploads/2021/11/Construction-work-in-progress.jpg)

# Resilient A-AF

## Control the Timeout

Primitive example of using `CancellationTokenSource`.  It will timeout after given number of milliseconds , if  not finished. Please make sure every AF has a time out controlled execution time.

AzureFunctions are very "timeout sensitive". [Here is the info](https://docs.microsoft.com/en-us/azure/azure-functions/functions-scale) on how this can be controled in a limited fashion when AF are concerned.

## Move all static data to configuration 

https://docs.microsoft.com/en-us/dotnet/core/extensions/configuration

Use Azure Vault. Make your AF completely stateless. And in the process increase the maintability of your AF's
