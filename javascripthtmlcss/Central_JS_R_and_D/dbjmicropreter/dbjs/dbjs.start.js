
	//@cc_on
	//@set @_DEBUG =(1==0)
	//@set @_TRACE =(1==0)

	(function (global, undefined) {

		var uid = (+new Date()), result_name = "result_" + uid, stack_name = "stack_" + uid;
		top[result_name] = null;
		top[stack_name] = [];

		function evil(x) {
			"use strict";
			(0, eval)(";top['" + result_name + "']=(" + x + ");");
			return top[result_name];
		}

		function htmlEscape(str) {
			return ("" + str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		}

		var X = function () {
			if ("function" === typeof arguments[0]) {
				arguments[0].apply(X, top[stack_name]);
			}
			else if (this.eval)
				for (var r = "", s, j = 0; s = arguments[j++]; ) {
					try { r = evil(s); } catch (x) { r = x + " "; }
					top[stack_name].push("<li>" + s + "&nbsp;<b style='font-size:larger;'>&rarr;</b>&nbsp;(" + htmlEscape(r) + ")</li>");
				} else
				for (var r = "", s, j = 0; s = arguments[j++]; ) {
					top[stack_name].push("<li>" + s + "</li>");
				};
			return X;
		};

		X.flush = function (cback) {
			if (top[stack_name].length > 0) {
				cback(top[stack_name].join("")); top[stack_name] = null; top[stack_name] = [];
			}
			return X;
		};

		/* just print what is sent */
		global.P = function () {
			X.apply({ "eval": false }, arguments); return global.P;
		};

		/* consider expresions to be printed and evaluated are sent */
		global.E = function () {
			X.apply({ "eval": true }, arguments); return global.E
		};

	} (this));
//-----------------------------------------------------------------------
(function (global) {
//-----------------------------------------------------------------------
global.all_is_ok_to_start = function () {
		@if (@_DEBUG) debugger;	@end
		//-----------------------------------------------------------------------
		THIS.onload();
		main_event_handlers(THIS.$display);
		// THIS.plugins.load();
		//-----------------------------------------------------------------------
		document.title = THIS.title; // show some info as the window caption
		// make access keys from first chars of each buttons text
		$("button", toolbar).each(
			function () {
				var inner_text = this.innerText,
				access_char = inner_text.substring(0, 1),
				inner_html = '<span style="text-decoration:underline;">' + access_char + '</span>' +
							inner_text.substr(1);
				this.accessKey = access_char;
				this.innerHTML = inner_html;
			}
		);

		//ensure that all document elements except the display textarea are unselectable
		dbj.later(function () {
			$("*", document.body).each(
		 function (i) { this.unselectable = "on"; }
		);
			display.unselectable = "off"; display.focus();
		});

		dbj.later(
		function () { /*THIS.copyright_notice */
			//-----------------------------------------------------------------------
			var shell = new ActiveXObject("WScript.Shell");
			P(THIS.title + "&nbsp;" + document.domain + " V:" + document.lastModified,
			dbj + "",
			"jQuery: " + $(document.body).jquery,
			"documentMode: " + document.documentMode,
			"compatMode: " + document.compatMode);
			for (i = 0; i < document.compatible.length; i++) {
				P(" userAgent = " + document.compatible[i].userAgent + ", version   = " + document.compatible[i].version);
			}
			P("PROCESSOR_ARCHITECTURE : " + shell.ExpandEnvironmentStrings("%PROCESSOR_ARCHITECTURE%"),
			"-------------------------------------------------------------------------- ",
			"&copy;" + THIS.thisYear + ", by DBJ.ORG (mailto:dbj@dbj.org)",
			"-------------------------------------------------------------------------- ",
			"Scripts loaded:",
			dbjdbj.reporter().join("<br/>")
			);
			P(function (stack) { this.flush(POP); });
		});
/*		ChiliBook.automatic = false;
		ChiliBook.lineNumbers = true;
        */
	};

} (this));