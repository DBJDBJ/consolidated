using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Console;

namespace ConsoleDI.Example;
using static System.Guid;

public interface IOperation
{
    string OperationId { get; }
}

public interface ITransientOperation : IOperation
{
}
public interface IScopedOperation : IOperation
{
}
public interface ISingletonOperation : IOperation
{
}

/*
The DefaultOperation implements all of the named marker interfaces 
and initializes the OperationId property to the last four characters
 of a new globally unique identifier (GUID).
*/
public class DefaultOperation :
    ITransientOperation,
    IScopedOperation,
    ISingletonOperation
{
    public string OperationId { get; } = NewGuid().ToString()[^4..];
}

/*
Fun starts here. This is "transient service" this is sort-of-a "meta service"
aka "service of services". this is indeed registered but without a interface
because interface is not required
*/
public class OperationLogger
{
    private readonly ITransientOperation _transientOperation;
    private readonly IScopedOperation _scopedOperation;
    private readonly ISingletonOperation _singletonOperation;

/*
The core of the core of the trick os that DI framework calls this constructor
'automagically'

a constructor that requires each of the declared marker interfaces,
*/    public OperationLogger(
        ITransientOperation transientOperation,
        IScopedOperation scopedOperation,
        ISingletonOperation singletonOperation) =>
        (_transientOperation, _scopedOperation, _singletonOperation) =
            (transientOperation, scopedOperation, singletonOperation);

/*
A single method that allows the consumer to log the operations with a given scope descriptor
*/    public void LogOperations(string scope)
    {
        LogOperation(_transientOperation, scope, "Always different");
        LogOperation(_scopedOperation, scope, "Changes only with scope");
        LogOperation(_singletonOperation, scope, "Always the same");
    }

/*
T must be IOperation offspring which is one of the three interfaces declared above
*/
    private static void LogOperation<T>(T operation, string scope, string message)
        where T : IOperation =>
        /* Console.WriteLine */ OperationLogger.log.LogInformation(
            $"{scope}: {typeof(T).Name,-19} [ {operation.OperationId}...{message,-23} ]");

    static Lazy<ILogger> lazy_logger = new(() =>  
    {
    using var loggerFactory = LoggerFactory.Create(builder =>
               builder.AddSimpleConsole(options =>
                {
                    options.IncludeScopes = true;
                    options.SingleLine = true;
                    options.TimestampFormat = "hh:mm:ss ";
                    options.ColorBehavior = LoggerColorBehavior.Enabled;
                }));

    /* var logger = */ return loggerFactory.CreateLogger<Program>();
   });

   static public ILogger log {
     get {
        // return lazy_logger?.Value ?? throw new ArgumentNullException("lazy_logger");
        return lazy_logger.Value ;
     }
   }

}