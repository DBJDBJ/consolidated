
/*
 MIT,GPL (c) 2009-2010 by DBJ.ORG

 a little javascript set for my development and testing pages

 $Revision: 9 $$Date: 7/03/11 0:12 $
----------------------------------------------------------------------------------------------
if unlucky and debugging inside IE <= 8 include this script once on the top of your html page
as it will provoke inclusion of firebug-lite

    if (!window.console)
        document.write(
    '<!--[if lte IE 8]>' +
    '<script type="text/javascript" src="https://getfirebug.com/firebug-lite.js"><' + '/script>' +
    '<![endif]-->'
    );

*/

/*-----------------------------------------------------------------------------------------------*/
(function () {
	/*-----------------------------------------------------------------------------------------------*/

	if (!this.dbj) {
		throw new Error(0xFF,"This file requires previous inclusion of dbj root object which is in dbj.microlib.js");
	}

	dbj.utl = {};
	/** 
	help summarizing or averaging values saved in this cache 
	of key/value pairs where values are always numerical values 
	internal obj_ is object where each property is an array
	example:
			dbj.summa.add("A",1).add("A",2).add("B",[100,1]) ;
			dbj.summa.sum("A") returns 3
			dbj.summa.sum("B") returns 101
			dbj.summa.sum("C") returns 0
	*/
	dbj.utl.summa = (function () {
		"use strict";
		var obj_ = {},
	sum_ = function (arr) { var l = arr.length, sum = 0; while (l--) { sum += arr[l]; }; return sum; },
	avg_ = function (arr) { return sum_(arr) / arr.length; },
	num_ = function (arr) { var l = arr.length, sum = 0; while (l--) { arr[l] = arr[l] - 0; }; return arr; };

		return {
			/* interface */
			add: function (k, v) {

				if (!isArray(v)) { v = [v - 0]; }
				else v = num_(v);

				if (!isArray(obj_[k]))
					obj_[k] = [].concat(v);
				else
					obj_[k] = obj_[k].concat(v);
				return this;
			},
			sum: function (k) { return sum_(obj_[k] || []); },
			avg: function (k) { return avg_(obj_[k] || []); },
			all: function (k) { return (obj_[k] ? [].concat(obj_[k]) : []) },
			rst: function (k) { if (obj_[k]) { var old = obj_[k]; obj_[k] = []; return old; } return []; }
		};
	}());
	/**
	use this function to harvest form values on inputs named in its "defaults" argument
	example call :
	var harvest = harvester("myForm", { "name" : "Default", "age" : 22, "sex" : "male" } );
	look for inputs name, age and sex in the form "myForm". if input value is null use the
	values given in the argument.
	*/
	dbj.utl.harvester = function (frm_id, defaults) {
		var $frm = jQuery("#" + frm_id, document.object), $input,
		getval = function (id_) {
			$input = $frm.find("input#" + id_);
			return ($input.val() || defaults[id_]);
		};
		for (name in defaults) { defaults[name] = getval(name); }
		return defaults;
	},

	/**
	 * very simple but effective table 'writer'
	 *
	 * all arguments are optional
	 * var tabla = dbj.table(your_host_dom_element, "your_table_id", "your_css_class_name");
	 * 
	 * methods are chainable
	 * 
	 * tabla.hdr("ID", "Name", "Average Rating")  // defines table of 3 columns
	 * .caption("Waiting for " + query[1])
	 *
	 * .row(1,"Bob",3.5) // proceed with SAME number of columns
	 * .row(2,"DBJ",2.5); // 
	 * 
	 * optionaly style the table made, for example:
	 * tabla.uid( function( id_ ) { $("#"+id_ ).dataTable()  }); // apply 'dataTable' jQuery plugin 
	 * 
	 */
	dbj.utl.table = function (host, id, klass, undefined) {
		host || (host = document.body);
		id || (id = dbj.GUID());
		klass || (klass = "dbjtable");
		var
			slice = Array.prototype.slice,
			$table = $("#" + id),
			colcount = 0;

		if (!$table[0]) {
			$table = jQuery("<table id='{0}' class='{1}'><caption></caption><thead></thead><tbody></tbody>".format(id, klass));
			$table.appendTo(host);
		}

		function selfcheck() {
			if (!$table[0]) {
				dbj.print("dbj.utl.table() : This is wrong. No table to handle?");
				return false;
			}
			return true;
		}

		/** 
			first row added defines number of columns 
			latter can make row with different number; the table will be jaddged
			@param {array} row_
			@param {bool}  header if true the header (TH) cells will be made
		*/
		function to_row(row_, header) {
			dbj.assert(roleof(row_) === "Array");
			if (!colcount) colcount = row_.length;
			var td = header ? "TH" : "TD", wid = Math.round(100 / colcount);
			td += " width='{0}%' ".format(wid);
			row_ = row_.join("</{0}><{0}>".format(td));
			return "<tr><{0}>{1}</{0}></tr>".format(td, row_);
		};
		return {
			ccn: function () { return colcount; },
			/**
			 Add new header to this table.
			 Call with arguments or a single array
			 No check regarding the column count is made
			 Appends to thead element
			 Can be called repeatedly to add more than one TH row .
			*/
			hdr: function () {
				if (selfcheck()) {
					if (roleof(arguments[0]) == "Array")
						$table.find("thead").append(to_row(arguments[0], true));
					else
						$table.find("thead").append(to_row(slice.call(arguments), true));
				}
				return this;
			},
			/**
			 Add new row to this table.
			 Call with arguments or a single array
			 No check regarding the column count is made
			*/
			row: function () {
				if (selfcheck()) {
					if (roleof(arguments[0]) == "Array")
						$table.find("tbody").append(to_row(arguments[0]));
					else
						$table.find("tbody").append(to_row(slice.call(arguments)));
				}
				return this;
			},
			caption: function (caption) {
				if (selfcheck())
					$table.find("caption").html(caption || "Caption");
				return this;
			},
			err: function () {
				if (selfcheck())
					$table.find("tbody").append(to_row(
				"<span style='color:#cc0000;'>{0}</span>".format(slice.call(arguments).join(" ")))
				);
				return this;
			},
			uid: function (cb) { dbj.assert(roleof(cb) === "Function"); cb(id); return this; },
			/**
				Dump the whole array to this table
			*/
			a2t : function ( argarr, show_idx ) {
				 var arr_  = argarr, cells, colnum = this.ccn() ;
				 for ( var k = 0; k < arr_.length; k += colnum ) {
					cells = arr_.slice(k, k + colnum);
					
					if ( show_idx )
					   cells = cells.map(function (v,i,a) {
						   return (k+i) + ":" + v ;
					   });
					
						$table.find("tbody").append(to_row(cells));
				 }
			}
		}
	};
	
   /**
	* helper for dbj table making
	*/
	dbj.utl.make_table = function (_host_element, _uid, column_names_array, caption, table_style ) 
	{
		//using bootstrap every table should have class ".table" plus other class for styling
		var bootstrap_table_classing = "table table-striped";
		// &#9733; (black star) or the &#9734; (white star with black borders).
		var default_caption = "<h1>&#9733;&#9733;&#9733;</h1>";
    var tabla = dbj.utl.table(_host_element, "table_" + _uid, table_style || bootstrap_table_classing);
        tabla.hdr(column_names_array)  // creates the table 
            .caption("{0}".format(caption || default_caption));
    return tabla;
	};
	/**
	  Copyright (c) 2016 by DBJ.ORG
	  index from :      ["apple","banana","apple","orange","banana","apple"];
	  produces this:    {"apple":[0,2,5] , "banana":[1,4] , "orange":[3], "_" : ["apple",3] }
	  where "_" is the most prevailing value calculated from the input array
	*/
	dbj.utl.index = function ( ca ) {
    var hasOwnProperty = Object.prototype.hasOwnProperty ; 
	var idx = { "_" : ["_" , 0 ] ,
	/**
	  index object to array of strings, not a single string
	  caller can join the array in accordance with her requirements
	*/
	toString : function () {
		var s = ["{"];
			for ( var k in this ) {
				if (hasOwnProperty.call(this, k))
					if ( roleof(this[k]) != "Function" )
						s.push( "  " + k + ": [" + this[k] + "]"); 
			} ; 
			s.push("}"); return s;
		} ,
	/**  inform that our primitive value is an array, not an object */
	valueOf : function () {
			 return this.toString();
		}
	};

	for(var i=0;i< ca.length;i++)
	{
	  var key = ca[i];
	  if (idx[key] == undefined ) {
			idx[key] = [i] ;
	   } else {
			idx[key].push(i);
	   }
	   // now update the prevailing value
	   if (idx[key].length > idx["_"][1]  )
	   idx["_"] = [ key , idx[key].length ];
	};
		return idx;
    }
/*-----------------------------------------------------------------------------------------------*/
}(this || window));
/*-----------------------------------------------------------------------------------------------*/
