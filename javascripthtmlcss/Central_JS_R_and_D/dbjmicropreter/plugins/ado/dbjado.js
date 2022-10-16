

(function(global, undefined) {
    //--------------------------------------------------------------------------------------------

    global.ADODB = {
        adPromptAlways: 1, adPromptComplete: 2, adPromptCompleteRequired: 3, adPromptNever: 4,
        adStateClosed: 0, // 	The object is closed
        adStateOpen: 1, //	The object is open
        adStateConnecting: 2, // 	The object is connecting
        adStateExecuting: 4, // 	The object is executing a command
        adStateFetching: 8, // 	The rows of the object are being retrieved

        adXactUnspecified: -1, //  	Cannot use the provided isolation level and cannot determine the isolation level
        adXactChaos: 16, // 	Cannot overwrite higher level transactions
        adXactBrowse: 256, // 	Allows you to view uncommitted changes in other transactions
        adXactReadUncommitted: 256, // 	Same as adXactBrowse
        adXactCursorStability: 4096, // 	Allows you to view changes in other transactions only after they are committed
        adXactReadCommitted: 4096, // 	Same as adXactCursorStability
        adXactRepeatableRead: 65536, // 	Cannot see changes made in other transactions, but allows you to requery
        adXactIsolated: 1048576, // 	Your transactions are completely isolated from all other transactions
        adXactSerializable: 1048576, // 	Same as adXactIsolated

        adModeUnknown: 0, //  	Permissions have not been set or cannot be determined.
        adModeRead: 1, // 	Read-only.
        adModeWrite: 2, // 	Write-only.
        adModeReadWrite: 3, //	Read/write.
        adModeShareDenyRead: 4, //	Prevents others from opening a connection with read permissions.
        adModeShareDenyWrite: 8, // 	Prevents others from opening a connection with write permissions.
        adModeShareExclusive: 12, // 	Prevents others from opening a connection.
        adModeShareDenyNone: 16, // 	Allows others to open a connection with any permissions.
        adModeRecursive: 0x400000, // 	Used with adModeShareDenyNone, adModeShareDenyWrite, or adModeShareDenyRead to set permissions on all sub-records of the current Record.

        /*
        ADODB does caching on the local machine level , new-eing ADODB
        objects takes them from the pool, so do not avoid it!
        */
        Connection: function(conn_string, prompt) {
            var object_ = null;
            try {
                object_ = new ActiveXObject("ADODB.Connection");
                object_.IsolationLevel = ADODB.adXactUnspecified;
                object_.Mode = ADODB.adModeRead;
                object_.ConnectionTimeout = 0; // undefinite
                // http://support.microsoft.com/kb/195982
                object_.Properties("Prompt") = prompt || ADODB.adPromptNever;

                switch (typeof conn_string) {
                    case "string":
                        object_.Open(conn_string);
                        break;
                    case "object":
                        /* 
                        conn_provider argument has to be an object
                        { provider : "....", "string" : "...", properties = [["x",1],["y",2]] }
                        where properties is optional member
                        */
                        object_.Provider = conn_string.provider;
                        object_.ConnectionString = conn_string.string;
                        if (conn_string["properties"]) {
                            conn_string["properties"].forEach(function(v, k) {
                                object_.Properties(v[0]) = v[1];
                            });
                        }
                        object_.Open();
                        break;
                    default: throw " ADODB.Connection() , bad argument conn_string ?";
                }
                return object_;
            } catch (x) {
                if (object_) {
                    x += x.message + "\n" + ADODB.get_error_msg(object_);
                    ADODB.Close(object_, true);
                } else {
                    x = x.message;
                }
                throw "\n\tADODB Connection failed: " + x;
            }
        },
        Recordset: function() {
            /* var object_ = new ActiveXObject("ADODB.Recordset"); */
            return (function() { return new ActiveXObject("ADODB.Recordset"); ; })();
        },
        Close: function(adobj, force) {
            // brute force closing
            try {
                if (!force && adobj.State) {
                    if (adobj.State != ADODB.adStateClosed) adobj.Close();
                } else {
                    adobj.Close();
                }
            } finally {
                return adobj;
            }
        },
        get_error_msg: function(objConn) {
            var r = [];
            for (objErr in objConn.Errors) {
                r.push("Description: ");
                r.push(objErr.Description);
                r.push("Help context: ");
                r.push(objErr.HelpContext);
                r.push("Help file: ");
                r.push(objErr.HelpFile);
                r.push("Native error: ");
                r.push(objErr.NativeError);
                r.push("Error number: ");
                r.push(objErr.Number);
                r.push("Error source: ");
                r.push(objErr.Source);
                r.push("SQL state: ");
                r.push(objErr.SQLState);
            }
            return r.join("\n");
        },
        row2array: function(RecordSet, colnames) {
            var r = [];
            colnames.forEach(function(name, k) {
                try {
                    r.push(RecordSet.Fields.Item(name).Value);
                } catch (x) {
                    r.push(name + " : " + x.message);
                }
            });
            return r;
        }
    }

    //--------------------------------------------------------------------------------------------
    ADODB.TST = [
             [
             'Provider=Search.CollatorDSO.1;Extended Properties="Application=Windows";',
             "File Name=E:\\sqlce\\search.udl"
             ],
             function(con) {
                 con = con || ADODB.TST[0][0],
              msg = ["Testing with connection string: " + con];
                 try {
                     global.ADODB.Connection(con);
                     msg.push("OK!");
                 } catch (x) {
                     throw x.message;
                 }
                 return msg.join("\n");
             }
             ];
    //--------------------------------------------------------------------------------------------
} (this));
//--------------------------------------------------------------------------------------------
if ("undefined" != typeof this.WScript) {
    var WSH = WScript.CreateObject("WScript.Shell"), title = "DBJ ADO LIB", sec_to_wait = 60;
    try {
        WSH.Popup(this.ADODB.TST[1]( "File Name=E:\\sqlce\\sqlce.udl" ), sec_to_wait, title);
    } catch (X) {
        if (6 === WSH.Popup("" + X.toString() + "\n\nBreak into Debugger ?", sec_to_wait, title, 4 + 16)) debugger;
    }
}
