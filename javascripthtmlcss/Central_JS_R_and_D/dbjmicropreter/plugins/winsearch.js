(function (global, undefined) {
    //--------------------------------------------------------------------------------------------
    var constr = [
             'Provider=Search.CollatorDSO.1;Extended Properties="Application=Windows";'
             ],
sql = [
"SELECT TOP 10 System.ItemPathDisplay FROM SYSTEMINDEX WHERE SCOPE='file:c:/dbj' AND (System.ItemPathDisplay LIKE '%js' OR System.ItemPathDisplay LIKE '%txt')"
],
scope = ["c:/dbj"];
    //
    var statement_builder = {
        single: function(propname, scope, top) {
            return (function() {
                return "SELECT TOP {0}  System.{1} FROM SYSTEMINDEX WHERE SCOPE='file:{2}'"
                .format(top || 10, propname, scope || "c:");
            })();
        },
        multi: function(props, scope, top) {
            return (function() {
                return "SELECT TOP {0}  System.{1} FROM SYSTEMINDEX WHERE SCOPE='file:{2}'"
                .format(
                top || 10,
                props.map(function(x) { return "System." + x; }),
                scope || "c:");
            })();
        }
    }

    //
    function ado_vbs_user(con_str, sql_str) {
        var RS = ADOVBS(con_str, sql_str)
        RS = new VBArray(RS);
        return RS.toArray();
        // for 2d array where w is width, and h is height
        // columns : RS[0] ... RS[w-1]
        // rows for col[x] : RS[x][0] ... RS[x][h-1]
    }
    // DEVELOPMENT IN PROGRESS !
    global.srchsql = function() {
        debugger;
        var arr = [], props = Array.prototype.slice.call(arguments);
        arr = ado_vbs_user(constr[0], statement_builder.multi(props, scope[0]));
        return arr.join("\n");
    }

    // exposure as a plugin
    // one plugin should be implemented as one object
    //this is how plugin is made available by the micropreter
    // when it is ready to be released, not before !
    /*
    var SRCH = {
    toString: function() { return "DBJ*Windows Search plugin"; }
    };
    SRCH.QRY = function() {
    return fsql("ItemNameDisplay", "FileName", "FileExtension");
    }
    SRCH.QRY.summary = {
    title: "General purpose Search SQL query",
    url: "Work in progress"
    }

    if ("undefined" != typeof THIS)
    THIS.plugins.add("SRCH", SRCH);
    else
    global.SRCH = SRCH; // make it globaly visible
    */

    //--------------------------------------------------------------------------------------------

} (this));
/*
TypeError 
Number : 5007
Description : Unable to get value of the property 'safari': object is null or undefined
*/