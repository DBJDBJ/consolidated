/// <reference path="../../lib/dbj/dbj.lib.js" />
//-----------------------------------------------------------------
(function(global,undefined) {
    // one plugin should be implemented as one object
var TEST = {
        // should have this method
        toString: function() { return "DBJ*MicroPreter TEST plugin"; }
    };
    // plugin method, to be relevant has to have 'summary' sub-object
    // otherwise will be ignopred by the plugin usage mechanism
    TEST.method = function() { return "TEST.method"; }
    TEST.method.summary = {
        title : "title of the plugin method",
        url   : "url to the online help"
    }
    
    //this is how plugin is made available by the micropreter
    if ("undefined" != typeof THIS)
        THIS.plugins.add("TEST", TEST);
    else
    // otherwise it will be a global object
    // IF! there is no already one with the same name
    global.TEST = TEST; // make it globaly visible
    //----------------------------------------------------------------- 
})(this);
