
(function (window, undefined) {
    window.M$FT = /*@cc_on!@*/false, window.NL = M$FT ? "\r\n" : "\n";

    window.handler = (function () {
        "use strict"
        function errshow(errobj) {
            return NL + "EXCEPTION: " + errobj.name + " " + ", number : " + (errobj.number & 0xFFFF) +
               ", description : " + errobj.description + (errobj.stack ? NL + errobj.stack : NL);
        }

        var just_return = function (x) { return x; },
            use_and_return = (function (callback) {
                return function (x) { callback(x); return x; };
            }),
            show = {
                err: use_and_return(window.console ? window.console.error.bind(window.console) : just_return),
                inf: use_and_return(window.console ? window.console.info.bind(window.console) : just_return),
                wrn: use_and_return(window.console ? window.console.warn.bind(window.console) : just_return)
            };

        return function (x) {
            var error = false;
            if ("boolean" === typeof x && x === false) {
                x = show.err(errshow(new Error("Assertion Failed!")));
            }
            else if (Object.prototype.toString.call(x) === "[object Error]") {
                x = show.err(errshow(x));
            } else
                x = show.inf("" + x);
            return x;
        }
    }());

    var delimiters = /\s*([=\?:\+,;\[\]\{\}\(\)])\s*/mg;
    window.prepare_and_eval = function (src) {
        var rezult = null, x, txt = "";
        try {
            src = src.replace(/\s+/g, " ");
            /* remove prettyprint markup */
            src = src.replace(/<span.*?>/gi, "").replace(/<\/span>/mig, "")
            .replace(/\&lt;/g, "<").replace(/\&gt;/g, ">").replace(/\&amp;/g, "&");
            /* remove comments */
            src = src.replace(/\/\*.*?\*\//mig, "").replace(/\/\/*/mig, "");
            /* micro compressor */
            src = src.replace(delimiters, "\$1");
            rezult = eval(
                src
            );
        } catch (x) {
            rezult = handler(x);
        }
        return rezult;
    };


    jQuery(function(undefined) {

        var container_ = document.getElementById("container"),
            $toolbar = $("#toolbar", container_)[0],
            $rezult = $("#rezult"),
            $display = $("#display", container_);

        //---------------------------------------------------------------------------------

        $("#eval").click(function(event) {
            $rezult.val(prepare_and_eval($display.html().trim()));
        })

        $("#highlight").click(function (E) {
            $("#display").focus().show();
        });

        // Title
        $rezult.val(
           NL +
           "DVJ Enhanced Attribute Selectors Version: 2.0.0" + NL +
           "jQuery : " + $().jquery + NL +
           "-----------------------------------" + NL
        );

    });

}(this || {}));
