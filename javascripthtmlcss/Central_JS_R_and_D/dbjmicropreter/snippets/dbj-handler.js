 var handler = (function(global,undefined) {

        var M$FT = /*@cc_on!@*/false, NL = M$FT ? "\n\r" : "\n";

        global.alert || ( global.alert = WScript.Echo ) ;

            function who_called(F, x) {
                try {
                    var who = F.caller.toString().match(/\w+/g);
                    return who[0] + " " + who[1];
                } catch (x) {
                    return " GLOBAL namespace ";
                }
            }
            function errshow(errobj) {
                return NL + "EXCEPTION: " + errobj.name + " " + ", number : " + (errobj.number & 0xFFFF) +
               ", description : " + errobj.description + (errobj.stack ? NL + errobj.stack : NL)
                + ", from: " + who_called(handler);
            }

            return function(x) {
                var error ;
                if ("boolean" === typeof x && x === false) {
                    error = x =  errshow( new Error("Assertion Failed!") );
                }
                if (Object.prototype.toString.call(x) === "[object Error]") {
                    error = x = errshow(x);
                }
                if (global.console) {
                    if (error)
                        global.console(x);
                    else
                        global.console.err(x);
                } else {
                    if (M$FT && error) {
                        if (confirm(x + NL + "OK to Debug?"))
                            debugger;
                    } else {
                        alert(x);
                    }
                }
            }
        } (this));

handler(3==1) ;