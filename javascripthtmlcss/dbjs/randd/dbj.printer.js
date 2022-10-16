//--------------------------------------------------------------------------------------------------------
// Arrows from borders
(function(window, undefined) {

// arrow's are made from 'fat' borders of a div
var arrow = function(w, h) {
    w = parseInt(w || 50); w = isNaN(w) ? 50 : w; // w == 50, if not given or if w can not be parsed to int
    h = parseInt(h || w); h = isNaN(h) ? 50 : h; // h == w, if not given or isNan
    // common div markup for arrow , height and width and border-width are : 0px
    var ARW = function(dir) {
        return last_arrow = $("<div direction=" + dir + " id='arrow-" + dir +
               "' style='margin:0px;padding:0px;width:0px; height:0px; background-color:transparent'></div>")
                               .css("border", w + "px solid transparent")
                               .css("width", 0).css("height", 0).css("display", "inline");
    },
             last_arrow = null,
             self = {
                 last: function() { return last_arrow; },
                 left: function() {
                     ARW(arrow.direction.left).css("borderRightColor", arrow.color)
                   .css("borderLeftWidth", 0).css("borderRightWidth", w + w);
                     return self;
                 },
                 right: function() {
                     ARW(arrow.direction.right).css("borderLeftColor", arrow.color)
                   .css("borderRightWidth", 0).css("borderLeftWidth", w + w);
                     return self;
                 },
                 up: function() {
                     ARW(arrow.direction.up).css("borderBottomColor", arrow.color)
                   .css("borderTopWidth", 0).css("borderBottomWidth", h + h);
                     return self;
                 },
                 down: function() {
                     ARW(arrow.direction.down).css("borderTopColor", arrow.color)
                   .css("borderBottomWidth", 0).css("borderTopWidth", h + h);
                     return self;
                 },
                 // position the arrow div on the edges of the host
                 place: function(host_, arr) {
                     arr = arr || last_arrow;
                     var hh = host_.height(), ww = host_.width(),
                            h = arr.outerHeight(), w = arr.outerWidth(),
                            host_zindex = parseInt(host_.css("zIndex")),
                            zindex = isNaN(host_zindex) ? 1 : host_zindex + 1;
                     arr.css("position", "absolute").css("zIndex", zindex).appendTo(host_);
                     switch (parseInt(arr.attr("direction"))) {
                         case 0:  // left
                             arr.css("top", hh / 2 - (h / 2)).css("left", 0);
                             break;
                         case 1:  // right
                             arr.css("top", hh / 2 - (h / 2)).css("right", 0);
                             break;
                         case 2:  // up
                             arr.css("left", ww / 2 - (w / 2)).css("top", 0);
                             break;
                         case 3:  // down
                             arr.css("left", ww / 2 - (w / 2)).css("bottom", 0);
                             break;
                         default:
                             throw new Error(0xFF, "arrow.place() found no direction in the arrow given?");
                     }
                     //
                     arr.click(function() {
                         alert($(this).outer());
                         return false;
                     });
                     //
                     return self;
                 }
             };
    return self;
} // eof arrow()
arrow.direction = { left: 0, right: 1, up: 2, down: 3 };
arrow.color = "#000000"; // a.k.a "black"
/*
Example

arrow.color = "red";
left_arrow = arrow(12).left().place($i);
right_arrow = arrow(12).right().place($i);
up_arrow = arrow(12).up().place($i);
down_arrow = arrow(12).down().place($i);
*/
})(window);
//--------------------------------------------------------------------------------------------------------
$(function() {
    function _decode(H) {
        H = H || "";
        if ("string" !== typeof H) H = ("" + H);
        return H.replace(/./mg, function(ch) {
            if (ch === '<') return "&lt;";  if (ch === '>') return "&gt;";
            if (ch === '&') return "&amp;"; if (ch === '"') return "&quot;";
            if (ch === "'") return "&quot;";
            return ch;
        });
    }

    function offset4(elementID, mouseX, mouseY) {
        var EL = $('#' + elementID),
            offset = EL.offset(),
            height = EL.outerHeight(),
            width = EL.outerWidth(),
            left = mouseX - offset.left,
            right = width - left,
            top = mouseY - offset.top,
            bottom = height - top,
        // border = EL.css("border"),
            bleft = parseInt(EL.css("border-left-width")),
            btop = parseInt(EL.css("border-top-width")),
            bright = parseInt(EL.css("border-right-width")),
            bbottom = parseInt(EL.css("border-bottom-width"))
             ;
        return {
            'left': left, 'right': right, 'top': top, 'bottom': bottom,
            'bleft': left < bleft, 'btop': top < btop, 'bright': right < bright, 'bbotom': bottom < bbottom
        };
    }

    var create_log_window = function() {
        var $w = $('<div id=_info_div_' + (+new Date()) + '<ol></ol></div>').appendTo(document.body),
    style = { "font": "larger/1.1 verdana,tahoma,arial",
        "position": "fixed", "z-index": "99", "right": "1px", "top": "1px",
        "width": "66%", "height": "66%",
        "overflow": "auto",
        "padding": "3px", "margin": "0px",
        "borderStyle": "solid", "borderWidth": "10px", "borderColor": "#6699FF",
        "color": "#000000",
        "background": "#CCCCCC", "cursor": "pointer"
    };
        for (var j in style) $w.css(j, style[j]);
        return $w;
    }

    function start() {
        var $i = create_log_window(), INFO_ID = $i.attr("id"),
        state = { vbar: false, hbar: false,
            minW: $i.css("border-left-width"), fullW: $i.outerWidth(),
            minH: $i.css("border-top-width"), fullH: $i.outerHeight()
        };


        $i.click(function(event) {
            if ($(event.target).is("pre")) {
                $(event.target).parent().fadeOut(100, function() { $(this).html("").remove(); });
            }
            else if ($(event.target)[0].id == INFO_ID) {
                var pointer = offset4(this.id, event.pageX, event.pageY),
                        self = $i, speed = "slow";
                if (event.ctrlKey) {
                    if (pointer.bleft || pointer.bright) {
                        if (state.vbar)
                            self.animate({ width: state.fullW }, "slow");
                        else
                            self.animate({ width: state.minW }, "slow");
                        state.vbar = !state.vbar;
                    }
                    if (pointer.top || pointer.bottom) {
                        if (state.hbar)
                            self.animate({ height: state.fullH }, "slow");
                        else
                            self.animate({ height: state.minH }, "slow");
                        state.hbar = !state.hbar;
                    }
                } else {
                    var o = {};
                    if (pointer.bleft) o.left = 1;
                    if (pointer.btop) o.top = 1;
                    if (pointer.bright) o.left = $(document.body).innerWidth() - self.outerWidth();
                    if (pointer.bbotom) o.top = $(document.body).innerHeight() - self.outerHeight();
                    self.animate(o, speed, null, function() {
                        // print_ ( "left " + self.css("left") + " : top " + self.css("top") + " : right" + self.css("right") + " : bottom " + self.css("bottom") ) ;
                    });
                }
            }
            return true;
        });

        return $i.find("ol");
    }
    var $ol = null;
    window.print_ = function(s, do_not_decode) {
        $ol || ($ol = start());
        $ol.append("<li style='width:100%' title='click to remove' ><pre style='font-family:monospace'>" +
            (do_not_decode ? s : _decode(s)) + "</pre></li>");
    }

    if ("undefined" == typeof window.console) {
        window.console = {log: window.print_}; $ol = start()
    }
});

