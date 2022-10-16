
(function (undefined) {
	Number.prototype.inc = function (val_, MAX) { return MAX != null ? (this.valueOf() + val_) % MAX : (this.valueOf() + val_); }
	Array.prototype.random = function () { return this[parseInt(this.length * Math.random())]; }
	Array.prototype.X = 0;
	Array.prototype.next = function () { var v_ = this[this.X]; this.X = this.X.inc(1, this.length); return v_; }
	/*
	DBJ*ORG(tm) -- DBJavaScript
	-------------------------------------------------------------------------- 
	(c) 2009 by DBJ.ORG (mailto:dbj@dbj.org)
	*/
	window.dbj || (dbj = { toString: function () { return "DBJ*ImageSwat"; } });
	//----------------------------------------------------
	// test-ing
	dbj.extensions_testing = function () {
		var a = [1, 2, 3, 7, 8, 9], b = [4, 5, 6];
		var s = "";
		s += "\n a[" + a.X + "] --> " + a.next()
		s += "\n a[" + a.X + "] --> " + a.next()
		s += "\n b[" + b.X + "] --> " + b.next();
		s += "\n b[" + b.X + "] --> " + b.next();
		s += "\n a[" + a.X + "] --> " + a.next()
		return s;
	}
	//------------------------------------------------------------------------------
	dbj.debug = function (s_) {
		if (!dbj.debug.flag) return;
		var tid;
		tid = setTimeout(function () {
			$("#debug").append("<li>" + s_ + "</li>");
			clearTimeout(tid);
		}, 1);
	}
	dbj.debug.clr = function () { $("#debug").html(""); }
	dbj.debug.flag = false;

	//---------------------------------------------------------------------
	// DBJ slide show is actually just an JQ image swapper
	//---------------------------------------------------------------------
	// forward slash in path is required
	dbj.IMGS = undefined;
	//---------------------------------------------------------------------
	dbj.start = function (selektor) {

		if (!dbj.IMGS) throw "dbj.IMGS must contain array of urls to images";
		// currently only FF needs pre-loading, so that first run looks ok
		function preloading() {
			var preload;
			for (var i = 0; i < dbj.IMGS.length; i++) { preload = new Image(); preload.src = dbj.IMGS[i]; }
		}
		// this version needs no preloading
		$(".dbj_imageswap").remove();
		var uid = +(new Date());
		$(selektor).append("<img class='dbj_imageswap' id='" + uid + "' src='' alt='' />");
		$(".dbj_imageswap").attr("src", dbj.IMGS[0]);
		$(".dbj_imageswap").click(function () { dbj.stop();});
		$(".dbj_imageswap").load(function () { $(this).fadeIn(dbj.fadeintime); });
		//
		if (dbj.tid == null) dbj.next();
	}
	//---------------------------------------------------------------------
	dbj.idx = 0;
	dbj.tid = null;
	dbj.fadeouttime = 1 * 1000;
	dbj.fadeintime = 1 * 1000;
	dbj.nexttime = 4 * 1000;
	//---------------------------------------------------------------------
	dbj.stop = function () {
		if (dbj.tid != null) clearTimeout(dbj.tid); dbj.tid = null; $(".dbj_imageswap").remove();
	};
	//---------------------------------------------------------------------
	dbj.next = function () {

		function swap() {
			dbj.idx = (dbj.idx + 1) % dbj.IMGS.length;
			$(".dbj_imageswap").attr("src", dbj.IMGS[dbj.idx]).attr("alt", dbj.IMGS[dbj.idx]);
			// dbj.debug("IDX=" + dbj.idx);
		}

		$(".dbj_imageswap").fadeOut(dbj.fadeouttime, swap);
		if (dbj.tid != null) clearTimeout(dbj.tid);
		dbj.tid = setTimeout(dbj.next, dbj.nexttime);
	}
	//---------------------------------------------------------------------
} ());