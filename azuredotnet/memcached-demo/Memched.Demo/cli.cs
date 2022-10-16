using System.CommandLine;
using Microsoft.Extensions.Logging;

namespace Memched.Demo;

internal sealed class CLI
{

    internal readonly static string version = "0.1.0";

    internal static RootCommand root_ = new RootCommand(AppDomain.CurrentDomain.FriendlyName);
    internal static void setup()
    {
        root_.SetHandler(() =>
        {
            Console.WriteLine("memcached cli, version: " + version);
        });

        var getCommand = new Command("get", "get value by given key");
        root_.Add(getCommand);
        var setCommand = new Command("set", "set value by given key");
        root_.Add(setCommand);

        // An argument that is defined without a default value, is treated as a required argument.
        var keyArgument = new Argument<string>
        (name: "key", description: "key string" /*,  getDefaultValue: () => "key"*/ );

        var valArgument = new Argument<string>
            ("val", "value string.");

        getCommand.Add( keyArgument );
        setCommand.Add( keyArgument );
        setCommand.Add( valArgument );

        ILogger<Program> logger_ = Program.logger;

        getCommand.SetHandler( (keyArgumentValue) => {
          logger_.LogDebug($"<key> argument == {keyArgumentValue}" );
            Console.WriteLine($"\nFor the key: {keyArgumentValue}, Value is: {Program.program_.run_get(keyArgumentValue)}\n");
         }, 
         keyArgument);

        setCommand.SetHandler( (keyArgumentValue, valArgumentValue) => {
         logger_.LogDebug($"<key> argument == {keyArgumentValue}" );
         logger_.LogDebug($"<val> argument == {valArgumentValue}" );
         Program.program_.run_set(keyArgumentValue, valArgumentValue);
          Console.WriteLine($"\nSet with the key: {keyArgumentValue}, and the value: {valArgumentValue}\n");
         }, 
         keyArgument, valArgument);

    }
}