/// <reference path="jquery.dbjnvo.js" />
/*

Copyright (c) 2009-2010 Dusan Jovanovic ( http://dbj.org ) 
 
Licensed under the MIT license:
http://www.opensource.org/licenses/mit-license.php
   
DEPENDENCIES :
   
1::jQuery
2::jquery.dbjnvo.js

*/

if ('undefined' === typeof (DBJ)) DBJ = { toString: function() { return "DBJ";  } }

DBJ.shaker = function(obj) {
    var interval = null;
    var $element = $(obj);
    $element[0].unselectable = "on";
    $element[0].ondrag = function() { return false; };
    $element[0].onselectstart = function() { return false; };
    var delay_of_movement = 100;
    //-----------------------------------------------
    // this is where jquery.dbjnvo.js is used
    function front() {
        // $element.inc("zIndex", DBJ.dx);
        $element.animate({ zIndex: "+=" + DBJ.dx }, 0);
    }
    function back() {
        // $element.dec("zIndex", DBJ.dx);
        $element.animate({ zIndex: "-=" + DBJ.dx }, 0);
    }
    function left() {
        /* $element.inc("left", DBJ.dx); */
        $element.animate({ left: "-=" + DBJ.dx }, "slow"); 
    }
    function right() {
        // $element.dec("left", DBJ.dx);
        $element.animate({ left: "+=" + DBJ.dx }, "slow");
    }
    function up() {
        // $element.inc("top", DBJ.dy);
        $element.animate({ top: "-=" + DBJ.dy }, "slow");
    }
    function down() {
        // $element.dec("top", DBJ.dy);
        $element.animate({ top: "+=" + DBJ.dy }, "slow");
    }
    //-----------------------------------------------
    this.remove = function() { clearInterval(IID); if ($element) { $element.remove(); delete $element; $element = null; } }
    //-----------------------------------------------
    this.centeron = function(x, y) {
        $element.css("left", x - ($element.width() / 2));
        $element.css("top", y - ($element.height() / 2));
    }
    // element.innerText = String.fromCharCode( 120 + DBJ.instances.length ) ;
    // this.centeron($element.parent().width() / 2, $element.parent().height() / 2 );
    $element.css("zIndex", 0); // flatten to z=0
    var IID = window.setInterval(function() {
        if (!$element) return;
        var f = [front, back, left, right, up, down][Math.floor(Math.random() * 6)];
        f();
        if (DBJ.random_color)
            $element.css("color", DBJ.RNDRGB());
    }, delay_of_movement * 1);
}         // eof DBJ.shaker class------------------------------------
//
DBJ.shaker_init = function(selector) {
    DBJ.shaker_remove();
    $(selector).each(function() { DBJ.instances.push(new DBJ.shaker(this)); });
}
//
DBJ.shaker_remove = function() {
    $.each(DBJ.instances, function(j, v) {
        v.remove();
    }
);
    delete DBJ.instances; DBJ.instances = [];
}
//
DBJ.dx = 12 ;
DBJ.dy = 12 ;
DBJ.instances = [] ;
DBJ.random_color = false; 
//-----------------------------------------------
DBJ.hex2 = function (s) {
    s = parseInt(s).toString(16);
    return (s.length < 2) ? '0' + s : s;
};
// return css colur value
// rgb() is returned as '#' hex value
// 'color_name' is returned as 'color_name'
DBJ.get_css_color = function (node, color_prop) {
    if (color_prop === null) color_prop = "backgroundColor";
        var v = jQuery.css(node, color_prop);
        if (v.match(/rgb/)) {
            rgb = v.match(/\d+/g);
            return '#' + hex2(rgb[0]) + hex2(rgb[1]) + hex2(rgb[2]);
        }
        if (v && v != 'transparent')
            return v;
     return '#ffffff';
};

DBJ.int2color = function ( integer ) {
return "#" + DBJ.hex2(integer).toUpperCase();
}

DBJ.RNDRGB = function () {
    function R() { return Math.floor(Math.random() * 255).toString(10); }
    return "RGB(" + R() + "," + R() + "," + R() + ")";
}

//-----------------------------------------------
// a little circular file list
DBJ.store = { toString: function() { return "DBJ.store"; } }
DBJ.store.url = []; // here users add the array of sound file url's
DBJ.store.index_ = 0;
DBJ.store.next = function() {
    function IDX() {
        if (DBJ.store.url.length < 1) return 0;
        DBJ.store.index_ = DBJ.store.index_ % DBJ.store.url.length;
        return DBJ.store.index_++;
    }
    return DBJ.store.url[IDX()];
}
DBJ.store.add = function(url_) { DBJ.store.url.push(url_); }
