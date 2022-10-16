//
// $Revision: 2 $ $Date: 1/06/10 18:35 $
//
// DBJ*Core WMI plugin
//
// var nconfig = DBJWMI.Obj("Win32_NetworkAdapterConfiguration") ;
//
// on nconfig we can call methods 'directly' with 'dot notation'
// or we can call them like this, same as WMI does internally
//
// DBJWMI.Exec("Win32_NetworkAdapterConfiguration", "ReleaseDHCPLeaseAll");
// DBJWMI.Exec("Win32_NetworkAdapterConfiguration", "RenewDHCPLeaseAll");
//
(function() {
    // this is for Win32_Service only
    var return_value_2_message = { "Win32_Service": [
	    "OK",
		"The request is not supported.",
		"The user did not have the necessary access.",
		"The service cannot be started because it depends on other services that are not running.",
		"The requested control code is not valid, or it is unacceptable to the service.",
		"The requested control code cannot be sent to the service because the state of the service.",
		"The service has not been started.",
		"The service did not respond to the start request in a timely fashion.",
		"Unknown failure when starting the service.",
		"The directory path to the service executable was not found.",
		"The service is already running",
		"The database to add a new service is locked.",
		"A dependency for which this service relies on has been removed from the system.",
		"The service failed to find the service needed from a dependent service.",
		"The service has been disabled from the system.",
		"The service does not have the correct authentication to run on the system.",
		"This service is being removed from the system.",
		"There is no execution thread for the service.",
		"There are circular dependencies when starting the service.",
		"There is a service running under the same name.",
		"There are invalid characters in the name of the service.",
		"Invalid parameters have been passed to the service.",
		"The account, which this service is to run under is either invalid or lacks the permissions to run the service.",
		"The service exists in the database of services available from the system.",
		"The service is currently paused in the system."
	]
    };

    var DBJWMI = { toString : function() { return "DBJ*WMI Core Methods"; } };
    DBJWMI.Computer = "."
    DBJWMI.Allways_Show_Retvals = true;
    //
    DBJWMI.Service = function() { return GetObject("winmgmts:\\\\" + DBJWMI.Computer + "\\root\\CIMV2"); }
    // Obtain the instance of the class aka 'object'
    DBJWMI.Obj = function(class_name) { return DBJWMI.Service().Get(class_name); }
    // Execute the method and obtain the return status.
    DBJWMI.Exec = function(class_name, m_name) {

    if (!confirm( "DBJWMI.Exec(\nclass_name : "+class_name +",\nm_name:"+m_name +")\n)")) return;
        
        var objOutParams = DBJWMI.Service().ExecMethod(class_name, m_name);
        if (objOutParams.ReturnValue) {
            return {
                "call": class_name + "." + m_name + "(), returned: " + objOutParams.ReturnValue
            };
        }
    }
    // Execute the method with arguments and obtain the return status.
    DBJWMI.Exec_With_Params = function(class_name, m_name, params) {
        // Obtain the definition of the WMI class that defines the method you want to execute.
        var objShare = DBJWMI.Obj(class_name);
        // Obtain an InParameters object specific to the WMI class method you want to execute.
        var objInParam = objShare.Methods_(m_name).inParameters.SpawnInstance_();
        // assign all the params given ny the caller
        for (var P in params) { objInParam.Properties_.Item(P) = params[P]; }

        var objOutParams = objShare.ExecMethod_(m_name, objInParam)
        if (objOutParams.ReturnValue) {
            return {
                "call": class_name + "." + m_name + "(), returned: " + objOutParams.ReturnValue
            };
        }
    }
    // here we add summary to each method we want to expose to the host
    DBJWMI.Obj.summary = {
        title: "DBJ*WMI obtain instance from a class name",
        url: "url to the online help"
    }
    DBJWMI.Exec.summary = {
        title: "DBJ*WMI execute method",
        url: "url to the online help"
    }
    DBJWMI.Exec_With_Params.summary = {
        title: "DBJ*WMI execute method with parameters",
        url: "url to the online help"
    }

    //this is how plugin is made available by the micropreter
    if ("undefined" != typeof THIS)
        THIS.plugins.add("DBJWMI", DBJWMI);
    else
        window.DBJWMI = DBJWMI; // global
    //----------------------------------------------------------------- 

})();