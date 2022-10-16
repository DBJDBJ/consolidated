// Heres where the Javascript starts
(function() {

    // Converting date difference from seconds to actual time
    function convert_to_time(secs) {
        secs = parseInt(secs);
        hh = secs / 3600;
        hh = parseInt(hh);
        mmt = secs - (hh * 3600);
        mm = mmt / 60;
        mm = parseInt(mm);
        ss = mmt - (mm * 60);

        if (hh > 23) {
            dd = hh / 24;
            dd = parseInt(dd);
            hh = hh - (dd * 24);
        } else { dd = 0; }

        if (ss < 10) { ss = "0" + ss; }
        if (mm < 10) { mm = "0" + mm; }
        if (hh < 10) { hh = "0" + hh; }
        if (dd == 0) { return (hh + ":" + mm + ":" + ss); }
        else {
            if (dd > 1) { return (dd + " days " + hh + ":" + mm + ":" + ss); }
            else { return (dd + " day " + hh + ":" + mm + ":" + ss); }
        }
    }

    var tid = window.setInterval(function() {
        window.document.getElementById('cd').innerHTML = (new Date).toLocaleTimeString();
    }, 1000);

    window.onunload = function() { window.clearInterval(tid);  }

    document.write("<style media='all' type='text/css' >" +
"#cd {" +
"   border: 1px dotted #cccccc;" +
"	margin: 3px;" +
"	padding: 3px;" +
"	height: 30px;" +
"	font: 28px/1.0 monospace, verdana, arial, helvetica, sans-serif;" +
"	color: #CC0000;" +
"	text-align: center;" +
"	vertical-align: middle;" +
"	background-repeat:no-repeat;" +
"	background-position:center;" +
"}" +
"</style>");

    document.write("<div id='cd'></div>\n");

} ());