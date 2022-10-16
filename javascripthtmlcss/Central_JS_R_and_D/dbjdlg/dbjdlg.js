///<reference path="../jq132-vsdoc.js" />
// ------------------------------------------------------------------------
// A thin layer on top of jQuery UI to manage different kinds of dialogues
// (c) 2009 by DBJ.ORG
//
// $Revision: 2 $
// $Date: 7/07/11 9:30 $
// ------------------------------------------------------------------------
(function () {
    // ------------------------------------------------------------------------
    if ("undefined" == typeof DBJ) DBJ = { toString: function () { return "http://dbj.org"; } }
    ///<summary>
    //Common implementation
    //(hidden in the closure)
    ///</summary>
    function DBJ_DLG(opts) {
        this.div_id = DBJ_DLG.uid("dbj_dlg_div");
        var $dlg = null, nullfun = function () { return true; };
        ///<summary>
        ///pop-up a dialogue 
        ///options format:
        // {h:600, w:800, title:"string", onclose:function(){}, onopen:function(){}}
        ///</summary>
        this.show = function (options) {

            $dlg.dialog(
            {   "title": options.title || "DBJ*DialogueFrame",
                "height": options.h || 480,
                "width": options.w || 640,
                "buttons": {
                    "Close": function () {
                        options.onclose($dlg) || nullfun(); $(this).dialog('close');
                    },
                    "Open": function () {
                        options.onopen($dlg) || nullfun(); $(this).dialog('open');
                    }
                }
            })
            .dialog("open")
            .ready(function () {
                options.onopen($dlg) || nullfun();
            });
        }

        // constructor code
        // make  elements for this dialog only once
        $dlg = $("#" + this.div_id); // hold it
        if ($dlg.length == 0) {
            $("body").append(
            /*
            this makes jqUI to throw an exception on every but first dialogue open
            '<div id="' + this.div_id + '" class="ui-dialog" ></div>'
            bellow there is no class and all is fine
            */
     		'<div id="' + this.div_id + '" ></div>'
     		);
            $dlg = $("#" + this.div_id); // re-select
            $dlg.html(opts.html || "");
            $dlg.dialog({
                autoOpen: false,
                position: 'centre',
                modal: true,
                overlay: { opacity: 0.4, background: '#000' }
            });
            $dlg.dialog(); // dlg init as requested by the doc's
        }
    }

    DBJ_DLG.uid = function (base) { return base ? base + (+new Date()) : (+new Date()); }

    ///<summary>
    // generic html content dialogue
    ///</summary>
    DBJ.dlg_html = function (opts) {
        var div_id = DBJ_DLG.uid("dbj_container");
        var DLG = new DBJ_DLG({ html: "<div id='" + div_id + "' style='border:3px solid red; margin:3px; padding:3px; width:100%; height:100%;' >" + +"</div>" });
        // after this we should be able to get to our container div
        var $div = $("#" + div_id);
        //
        this.show = function (options) {
            DLG.show({
                h: options.h || 480,
                w: options.w || 640, 
                title:  options.title || "DBJ*GenericHTML Dialogue",
                onclose: function () {
                    $div.prepend(options.closing_html || "<h2>Closing ...</h2>"); alert("onclose() called"); 
                },
                onopen: function () {
                    $div.html(options.html || "<h1>DBJ Generic HTML dialogue</h1>"); 
                }
            });
        }
    }

    ///<summary>
    /// An dialogue with iframe inside.
    /// constructed with an array of url's to be used
    /// dialogue div and iframe inside it are created dynamicaly
    /// options argument format :
    /// { urls : [] , w: 800, h: 600 }
    //
    // usage 
    // var dbjdlg = new DBJ.dlg_url(
    // { urls: [
    // "spin.htm",
    //'http://spreadsheets.google.com/viewform?key=pWYxJKmfpyNX_J7AgTYLPKQ',
    //'http://www.google.com/calendar/embed?title=Arhitekta%201978&amp;height=600&amp;wkst=1&amp;hl=en_GB&amp;bgcolor=%23999900&amp;src=arhitektura1978%40gmail.com&amp;color=%238B0000&amp;ctz=Europe%2FBudapest'
    //   ]
    // }
    //);
    //     dbjdlg.show(1, "Title");
    ///</summary>
    DBJ.dlg_url = function (opts) {
        var default_url = "spin.htm",
                urls = jQuery.isArray(opts.urls) ? opts.urls : [default_url];
        var frm_id = DBJ_DLG.uid("dbj_ifrm_");
        var DLG = new DBJ_DLG({ html:
    "<iframe id='" + frm_id + "' style='margin:0;width:100%;height:100%;' frameborder='0' scrolling='yes' src='"
                   + default_url + "' ></iframe>"
        });
        // after this we should be able to get to our container iframe
        var $frm = $("#" + frm_id);
        function set_ifrm_src(the_url, x) {
            try {
                the_url = "string" == typeof (the_url) ? the_url : urls[the_url];
                $frm[0].src = the_url;
            } catch (x) {
                if (confirm("ERROR: " + x.message)) debugger;
            } finally {
                // alert("IFRAME src set to:\n" + the_url);
            }
        }
        //
        this.show = function (options) {
            DLG.show({
                h: 480, w: 640, title: options.title,
                onclose: function () { set_ifrm_src(default_url); },
                onopen: function () { set_ifrm_src(options.url_id); }
            });
        }
    } // DBJ_DLG_URL
    // ------------------------------------------------------------------------
})();            // eof (function () {
// ------------------------------------------------------------------------
///<reference path="dbjdlg.js" />
