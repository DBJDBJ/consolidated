/// <reference path="highlight.js/highlight.pack.js" />
/// <reference path="highlight.js/highlight.pack.js" />
///<reference path="../lib/dbj/dbj.lib.js" />
///Copyright © 2005-2009 DBJ.ORG. All Rights Reserved.
//@cc_on
//@set @_DEBUG =(1==0)
//@set @_TRACE =(1==0)
//
(function (window, undefined) {
	//
	var this_year = (new Date).getFullYear(),
        comment_begin = String.NL + "/*" + String.NL,
        comment_end = String.NL + "*/" + String.NL
        ;
	window.THIS = {
		///<summary>
		/// This application object
		///</summary>
		BUILD: "$Revision: 6 $$Date: 29/06/11 0:15 $",
		display_id: "display",
		$display: $("#display"),
		toString: function () { return "DBJ*MicroPreter " + THIS.BUILD; },
		thisYear: this_year,
		title: "DBJ*Micropreter(tm) 2001-" + this_year,
		print_: function (s_) {
			s_ = s_ || ""; // dbj 2009SEP03
			var rez = "";
			if (s_ instanceof Error) {
			    rez = s_.name + " " + "\nNumber : " + (s_.number & 0xFFFF) +
                                      "\nDescription : " + s_.description + 
			                          ( s_.stack ? "\nStack : " + s_.stack : "") ;
			} else
				rez = s_;
			THIS.$display.val(THIS.$display.val() + (comment_begin + rez + comment_end));
		},
		print2: function (s) { dbj.later(function () { THIS.print_(s); }) },
		ERR_CODE: 0x1313,
		error: function (s) { THIS.print_(new Error(THIS.ERR_CODE, s)); return false; },
		rx1: dbj.rx.c_style_comments,
		rx2: dbj.rx.slashslash_comments,
		rx3: dbj.rx.source_junk,
		compress: function (o, total) {
			if ("string" != typeof o) return THIS.error("Bad argument for THIS.compress()");
			if (total || false)
				try {
					return JSMIN("", o, 2);
				} catch (x) {
					THIS.print_(x);
					return THIS.code_clean(o);
				}
			else
				return THIS.code_clean(o);  
		},
		code_clean: function (o) { return o.replace(/\n{2,}/mg, String.NL).replace(/[ ]{2,}/g, String.space).replace(THIS.rx1, String.empty); },
		decompress: function (o, total) {
			// for String.NL to work this has to be added to the value of the
			// textarea, NOT the innerText !
			return o.replace(/;/mg, ";" + String.NL).replace(/\{/mg, "{" + String.NL).replace(/\}/mg, "}" + String.NL);
		},
		code: function () {
			//return THIS.compress(THIS.$display.val(), true);
			return THIS.$display.val();
		},
        /*
		load_script: function (file_Name) {
			///<summary>
			///Use jQuery to load and activate the script
			///</summary>
			$.getScript(file_Name, function () {
				//@if (@_TRACE)
                THIS.print2(file_Name + ", Loaded");
                //@end
			});
		},
        */
		//-----------------------------------------------------------------------
		onload: function () {

			function global_error_handlers() {
				var j = arguments.length;
				while (j--) {
					$(arguments[j]).error(function (msg, url, line) {
						THIS.print2("Error: " + msg + String.NL + url + String.NL + line);
					});

					$(arguments[j]).ajaxError(function (event, xhr, settings, thrownError) {
						THIS.print2("Ajax Error requesting: " + settings.url + (thrownError ? ", message: " + thrownError.message : ""));
						return false;
					});
				}
			}

			global_error_handlers(window, document, document.body);
			//-----------------------------------------------------------------------
		    // apply every css property in arg object to the jQuery instance
		    /*
            NOT required any more since we have $(...).css(<object for one or more css properties and new values>)

			jQuery.fn.cssApply = function (propobj) {
				for (var prop in propobj) {
					this.css(prop, propobj[prop]);
				}
				return this;
			};
            */
			//-----------------------------------------------------------------------
			THIS.$display = $("#display");
//-----------------------------------------------------------------------
			var blanket_maker = function (call_on_show) {
  
    jQuery.getScript("highlight.js/highlight.pack.js",
        function () {
            var /* element_to_be */_blanketed = $("#display"),
                $blanket = $(document.body).append("<div id='blanket' style='background-color:white;display:none;overflow:auto; border:1px solid;padding:2px;position:absolute;top:0px;left:0px;z-index:99'><link rel='stylesheet' href='highlight.js/styles/vs.css'><script>hljs.initHighlightingOnLoad();</script><pre class='prettyprint linenums'><code></code></pre></div>").find("#blanket"),
                $code = $blanket.find("code");
            $blanket.click(function (event) { $blanket.hide("slow"); });

            blanket_maker = function (call_on_show) {
                $blanket.hide(0);
                $code.text('');
                $blanket.css({
                    top: _blanketed.position().top,
                    left: _blanketed.position().left,
                    width: 1 + _blanketed.width(),
                    height: _blanketed.height()
                });
                if ("function" === typeof call_on_show) call_on_show($code);
                hljs.highlightBlock($code[0],"TAB");
                $blanket.show();
            }
            blanket_maker(call_on_show);
        });
} ;

THIS.code_painter = function () {
	try {
		blanket_maker(
        /* blanket for syntax highlighted display is styled and ready, but empty
            give it code in here
        */
        function (code_area) {
            code_area.text("/* click on this panel to edit the code */" + String.NL
                + THIS.$display.text());
		});
	} catch (x) {
		alert(""+x);
	}
};

//-----------------------------------------------------------------------
			THIS.$display.rightMouseDown(function (E) {
				if (E.altKey) {
					THIS.code_painter();
				}
				else
					this.val(THIS.compress(this.val(), E.ctrlKey));
			});
		}
		//-----------------------------------------------------------------------
	};
	// POP(content) is avaliable for users
	(function (oPopup) {

		var oPopBody = oPopup.document.body;
		defualt_style = {
			font: "small/1.5 'segoe ui',verdana,arial,tahoma",
			color: "black",
			backgroundColor: "lightyellow",
			border: "solid black 1px",
			overflow: "auto",
			padding: "5px"
		};

		window.POP = function (content, style_opt) {
			style_opt = style_opt || defualt_style;
			content = content || String.empty;
			if ((content === String.empty) || ("string" != typeof content)) {
				return THIS.error("POP() needs string as the only argument.");
			}
			if (THIS.$display.length < 1) {
				THIS.$display = $("#display");
			}

			if (!!style_opt && typeof (style_opt) === "object")
				for (var j in style_opt) {
					try {
						oPopBody.style[j] = style_opt[j]
					} catch (x) {
						THIS.error(x);
						continue;
					}
				}

			if (!!window.POP.script) {
				content += "<script type='text/javascript' src='" +
				   window.POP.script +
				   "' ></" + "script >";
			}

			oPopBody.innerHTML = content;
			oPopup.show(0, 0, 8 + THIS.$display.width(), 8 + THIS.$display.height(), THIS.$display[0]);
			return oPopBody; // DBJ 07-NOV-11
		};

		window.POP.script = "https://getfirebug.com/firebug-lite.js";

	})(window.createPopup());
	//
}(this));

//-----------------------------------------------------------------
var main_event_handlers = function ($display) {
	//----------------------------------------------------------------- 
	var sPersistValue = new String();
	var file_filter = "JavaScript Files (*.js)|*.js|Text Files (*.txt)|*.txt";
	//----------------------------------------------------------------- 
	function check_content(msg) {
		if (THIS.code().length < 3) {
			THIS.print_(msg); return false;
		}
		return true;
	}
	//----------------------------------------------------------------- 
	dugme_quit.onclick = function () {
		dbj.mbox.yesno("Quit?",
        function () {
        	checkForSave();
        	CollectGarbage();
        	top.close();
        }
        );

	}
	//----------------------------------------------------------------- 
	//SaveDocument uses the common dialog box object to display the save as dialog, 
	//then writes a textstream object from the value of the div's innerHTML property
	dugme_save.onclick = function () { SaveDocument(); }
	function SaveDocument(e) {
		//Setting CancelError to true and using try/catch allows the user to click
		// cancel on the save as dialog without causing a script error
		cDialog.CancelError = true;
		try {
			if (!check_content("Nothing to save...")) return;
			cDialog.Filter = file_filter;
			cDialog.ShowSave();
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			var f = fso.CreateTextFile(cDialog.filename, true);
			f.write(display.innerText);
			f.Close();
			sPersistValue = display.innerText;
			//
			document.title = cDialog.filename;
			// dbj 2009-28-06
			delete f;
			delete fso;
		}
		catch (e) {
			var sCancel = "true";
			return sCancel;
		}
		display.focus();
	}
	//----------------------------------------------------------------- 
	//LoadDocument uses the common dialog box object to display the open dialog box, 
	//then reads the file and displays its contents in the div
	dugme_load.onclick = function (e) {
		function load_js() {
			cDialog.Filter = file_filter;
			cDialog.ShowOpen();
			var ForReading = 1;
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			var f = fso.OpenTextFile(cDialog.filename, ForReading);
			var r = f.ReadAll();
			f.close();
			display.innerText = r;
			//This variable is used in the checkForSave function to see if there 
			//is new content in the div 
			sPersistValue = display.innerText;
			display.focus();
			document.title = cDialog.filename;
			//
			THIS.code_painter();
			// dbj 2009-08-17
			delete f;
			delete fso;
		}

		//Setting CancelError to true and using try/catch allows the user to click cancel 
		//on the save as dialog without causing a script error
		cDialog.CancelError = true;
		try {
			load_js();
		}
		catch (e) {
			THIS.print2(e);
		}
	}
	//----------------------------------------------------------------- 
	//NewDocument creates a new "document" by clearing the content of the div. 
	//If there is any new content in the div, the user is asked whether or not to save
	dugme_new.onclick = function () {
		checkForSave();
		display.focus();
	}
	//----------------------------------------------------------------- 
	// This function checks to see if the div has new text, then displays a dialog box if appropriate
	// on YES retursn TRUE, FALSE otherwise (on NO and CANCEL )
	function checkForSave() {
		try {
			if (THIS.code() !== String.empty) {
				dbj.mbox.yesno("Save the current code?",
                        function () { SaveDocument(); THIS.$display.val(""); },
                        function () { THIS.$display.val(""); }
                );
			}
		} catch (x) {
			THIS.print2(x); return false;
		}
		return true;
	}
	//-------------------------------------------------------------------------
	window.onunload = function () {
		checkForSave();
	}
	//-----------------------------------------------------------------
	var RETVAL_PROPERTY_ = THIS.RETVAL_PROPERTY_ = '_dbj_micropreter_retval_' + Math.floor(Math.random() * 2147483648).toString(36);
	function dbj_eval(o) {
		if (typeof o !== "string") {
			throw THIS.error("eval(), can not evaluate non-strings?");
		}
		/*
		"use strict";
		(0, eval)("top['" + RETVAL_PROPERTY_ + "'] = (" + o + ")");
		return top[RETVAL_PROPERTY_];
		*/
		return eval(o);
	}
	//-----------------------------------------------------------------
	$("#dugme_eval").click(function (E) {
		try {
			if (!check_content("Nothing to evaluate...")) return;
			if (E.ctrlKey)
				window.POP("" + dbj_eval(THIS.code()));
			else
				THIS.print2("" + dbj_eval(THIS.code())); // ""+ added by DBJ 2009-OCT-15
		} catch (X) {
			THIS.print2(X);
		}
	});
	//-----------------------------------------------------------------
};           // eof var main_event_handlers = function () {

    var dbj_obj_maker = function(prog_id) {
        if ("undefined" === typeof window.ActiveXObject) {
            return null;
        }
        var o_ = null; try { o_ = new ActiveXObject(prog_id); } catch (x) { o_ = null; }
        return o_ ?
        (function() { return o_; } ()) :
        (function() {
            if (!o_ && confirm("Ooops " + prog_id + " not made.\n\nStop here?"))
                debugger;
            else
                return o_;
        } ());
    };
//----------------------------------------------------------------- 
// PLUGINS
//----------------------------------------------------------------- 
    (function() {
        //@set @_plugin_trace=(1==0)
        var fso = dbj_obj_maker("Scripting.FileSystemObject"),
        folder = "plugins",
        P = {},
        PTABLE = [];
        
        PTABLE.badid = -1;
        PTABLE.uid_ = 0;
        PTABLE.uid = function() {
            // no arguments: make and return new uid
            if (arguments.length < 1) return (PTABLE.uid_ += 1);
            // one argument: try to get method uid
            try {
                return arguments[0]["ptable_entry"];
            } catch (x) {
                THIS.print2(x);
                return PTABLE.badid;
            }
        }
        PTABLE.add = function(p_name, method, name) {
            var uid = PTABLE.uid();
            PTABLE[uid] = { "p": p_name, "m": method, "n": name };
            method["ptable_entry"] = uid;
        }
        // call the plugin method , given its id
        PTABLE.cll = function(uid) {
            // pass the arguments 2..n, uid is the argument 1
            try {
                return PTABLE[uid].m.apply(this, Array.prototype.slice.call(arguments).slice(1));
            } catch (x) {
                THIS.print2("ERROR while calling: \n" + PTABLE.toString(uid));
                THIS.print2(x);
            }
            return;
        }
        //
        PTABLE.toString = function(uid) {
            if (uid)
                return "uid: " + uid + ", plugin: " + PTABLE[uid].p + ", method: " + PTABLE[uid].n + ", " + PTABLE[uid].m.summary.title;
            return "Plugins Table";
        }
        //
        THIS.plugins = { toString: function() { return "THIS*MicroPreter Plugins"; } }
        THIS.plugins.length = 0;
        THIS.plugins.names = [];
        // use jQuery to load and activate the script
        THIS.plugins.load_script = function(file_Name) {
            $.getScript(file_Name, function() {
                //@if (@_plugin_trace)
            THIS.print2(file_Name + ", Loaded");
            //@end
            });
        }
        //
        THIS.plugins.load = function() {
            if (!fso.FolderExists(folder)) return false;
            var plugins_folder = fso.GetFolder(folder);
            //@if (@_plugin_trace)
        //debugger;
        //@end
            var fc = new Enumerator(plugins_folder.files), file;
            for (; !fc.atEnd(); fc.moveNext()) {
                file = fc.item();
                if ("js" === fso.GetExtensionName(file.Name)) {
                    THIS.plugins.load_script(file.Path);
                }
            }
        }       // eof plugins load

        // this is called by plugins in order for them to become available
        THIS.plugins.add = function(name_, instance_) {
            if (name_ in P) return;
            P[name_] = instance_;
            //@if (@_plugin_trace)
        THIS.print2("Added: " + instance_);
        //@end
            // each relevant plugin method will be recorded by UID
            // which will be later used to call it ...
            THIS.plugins.visit(P[name_],
         function(method, m_name) {
             PTABLE.add(name_, method, m_name);
         });
        }

        // only visit plugin functions which have 'sub-object' 
        // 'summary' = { title: .... , url: .... }
        THIS.plugins.visit = function(plugin, call_back) {
            for (var j in plugin) {
                if (!plugin[j]) continue;
                if ("function" != typeof (plugin[j])) continue;
                if ("summary" in plugin[j])
                    try { call_back(plugin[j], j); } catch (x) { this.print2(x); }
            }
        }

        var L64 = "-".lpad(64, "-"), P8 = function(s_, padlen) { return (s_+"").lpad(padlen || 8); };
        ///<summary>
        // general Descriptor/User of plugins
        ///</summary>
        THIS.D = window.D = function(name_) {
            var s = "";
            try {
                // no name given: just list the plugins
                if (!name_) {
                    s = "Plugins loaded\n" + L64;
                    for (var j in P) s += "\n" + P8(j) + ":" + P[j];
                    return s;
                }
                if ("number" === typeof name_) {
                    // if (confirm("Calling method : \n" + PTABLE.toString(name_)))
                    // pass the arguments 
                    return PTABLE.cll.apply(this, arguments);
                }
                // list the relevant methods from the plugin  
                var plugin = P[name_], s = P8(name_) + ":" + plugin + "\n" + L64;
                THIS.plugins.visit(P[name_],
                     function(method, name) {
                         s += "\n" + P8(PTABLE.uid(method)) + P8(name) + ": " + method.summary.title;
                     });
            } catch (x) {
                THIS.print2(x);
            }
            return s;
        }
    })();


