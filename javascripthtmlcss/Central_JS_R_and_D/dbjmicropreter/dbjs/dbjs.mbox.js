
	top.M$FT = top.M$FT || (/*@cc_on!@*/false);
	top.NL = top.NL || (M$FT ? "\r\n" : "\n");
	if (top.M$FT) {
		top.dbj = top.dbj || {};
		dbj.mbox = (function () {

			var retvals = {
				/* VBScript msg box can return" */
				"1": "vbOK - OK was clicked",
				"2": "vbCancel - Cancel was clicked ",
				"3": "vbAbort - Abort was clicked",
				"4": "vbRetry - Retry was clicked",
				"5": "vbIgnore - Ignore was clicked",
				"6": "vbYes - Yes was clicked",
				"7": "vbNo - No was clicked"
			},
			buttons = {
				/* buttons argument is one of these integers: */
				"1": "OK and Cancel buttons",
				"2": "Abort, Retry, and Ignore buttons",
				"3": "Yes, No, and Cancel  buttons",
				"4": "Yes and No buttons",
				"5": "Retry and Cancel buttons"
			},
			icons = {
				/* To show icons bellow add the number to the buttons number above */
				"16": "Critical message icon",
				"32": "Warning Query icon",
				"48": "Warning Message icon",
				"64": "Information Message"
			},
			default_title = "DBJ.ORG Message Box";
			function hlp() {
				function o2s(o_) {
					var r = [];
					for (var p in o_) r.push(p + " : " + o_[p]);
					return r.join(top.NL);
				}
				var s = ["retval = dbj.mbox( message, title, option)", "Return Values", o2s(retvals), "Option arguments is integer which is one of ", "Buttons", o2s(buttons), "Plus one of these", "Icons", o2s(icons)]
				mBox(s.join(top.NL), 65, default_title);
			}
			function popit(m_, o_, t_) {
				if (!m_) return hlp(); /* No message given, assuming debugging */
				t_ = t_ || default_title;
				o_ = o_ || 1;
				return mBox(m_, o_, t_);
			}
			/*
			opts object 
			*/
			var default_ /*options*/ = {
				m: null,
				o: 1,
				t: "DBJ.ORG Message Box",
				"1": function () { return "vbOK - OK was clicked"; },
				"2": function () { return "vbCancel - Cancel was clicked "; },
				"3": function () { return "vbAbort - Abort was clicked"; },
				"4": function () { return "vbRetry - Retry was clicked"; },
				"5": function () { return "vbIgnore - Ignore was clicked"; },
				"6": function () { return "vbYes - Yes was clicked"; },
				"7": function () { return "vbNo - No was clicked"; }
			}
			return function (opts) {
				opts = opts || {};
				/* use default opts where necessary */
				for (var p in default_) opts[p] = opts[p] || default_[p];
				return opts[popit(opts.m, opts.o, opts.t)]();
			}
		} ());
		/* helpers */
		dbj.mbox.yesno = function (msg, onyes, onno) {
			/* 6 is yes , 7 is no retval */
			return dbj.mbox({ "m": msg, o: 4, "6": onyes, "7": onno });
		}
	}
