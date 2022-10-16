// Copyright (c) 2009 by DBJ.ORG
// messages aka literal strings
// depends on string.prototype.format()
//
(function() {

    dbj || (dbj = {});
    // {0} place holders in strings follow the .NET format rules
    var store = {
        en: {
            log: "DBJ*Log [{0}] ", // standard message for the log entry
            _msg_err: "dbj.str ({0}), failed."
} // eof 'en' messages
        };
        var dflt_lang_ = "en", // "en", "de" ...etc
            dflt_store_ = store[dflt_lang_];

        dbj.str = function(mid_) {
            ///<summary>
            /// mid_ : message id -- string
            /// arguments : whatever is required by the message
            ///</summary>
            try {
                lang_ = lang_ || "en";
                var a = Array.prototype.slice.call(arguments); a.shift(); // all but first argument
                return String.prototype.format.apply(dflt_store_[mid_], a);
            } catch (x) {
                throw store.en._msg_err.format(mid_);
            }
        }; // eof dbj.str


        dbj.str.load = function(f_name, lang_id_) {
        ///<summary>
        /// load strings from a json file, for a particular language id
        /// f_name : json file name
        /// lang_id_ : "en","de" ...
        /// JSON format required : { en : { }, de : {} }
        /// or whicever language id is used
        ///</summary>
        try {
                $.getJSON(f_name, null, function(data) {
                        store[lang_id_] = data[lang_id_];
                    });
            } catch (x) {
                throw new Error("dbj.str.load()" + x );
            }
        };

    })();