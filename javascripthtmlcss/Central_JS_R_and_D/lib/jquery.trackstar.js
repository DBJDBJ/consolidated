/*
http://plugins.jquery.com/project/TrackStar
* TrackStar
* A simple tooltip with reliable mouse tracking
*
*/
(function($) {
    $.fn.trackStar = function(options) {
        debug(this);
        var opts = $.extend({}, $.fn.trackStar.defaults, options);
        return this.each(function() {
            $this = $(this);
            var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
            $this.hover(function(event) {
                $('body').append('<div id="preview" style="position: absolute; background: #fff"></div>');
                $('#' + opts.displayID).clone().css('id', '').appendTo($('#preview')).show();
                $('#preview')
                    .css('top', (event.pageY - opts.xOffset) + 'px')
                    .css('left', (event.pageX + opts.yOffset) + 'px')
                    .fadeIn('fast');
            }, function(event) {
                $('#preview').remove();
            });
            $this.mousemove(function(event) {
                $('#preview')
                    .css('top', (event.pageY - opts.xOffset) + 'px')
                    .css('left', (event.pageX + opts.yOffset) + 'px');
            });
        });
    };
    function debug($obj) {
        if (window.console && window.console.log) {
            ; //console.log();
        }
    };
    // plug-in defaults
    $.fn.trackStar.defaults = {
        xOffset: 10,
        yOffset: 30
    };
})(jQuery);