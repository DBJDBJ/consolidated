var livetip_style = "position: absolute;background-color: #cfc;padding: 4px;border: 2px solid #9c9;border-radius: 4px;-webkit-border-radius: 4px;  -moz-border-radius: 4px;";
var $liveTip = $('<div id="livetip" style="'+livetip_style+'"></div>').hide().appendTo('body');
var tipTitle = '',
    showTip,
    delay = 300;

$('#toolbar').bind('mouseover mouseout mousemove', function(event) {
  var $link = $(event.target).closest('button');
  if (!$link.length) { return; }
  var link = $link[0];

  if (event.type == 'mouseover') {
    showTip = window.setTimeout(function() {
      $link.data('tipActive', true);
      tipTitle = link.tagName;
      link.title = '';
      $liveTip
        .html('<div>' + tipTitle + '</div><div>' + link.innerText + '</div>')
        .show()
        .css({
          top: event.pageY + 12,
          left: event.pageX + 12
        });
    
    }, delay);
  }

  if (event.type == 'mouseout') {
    if ($link.data('tipActive')) {
      $link.removeData('tipActive');
      $liveTip.hide();
      link.title = tipTitle || link.title;        
    } else {
      window.clearTimeout(showTip);
    }
  }

  if (event.type == 'mousemove' && $link.data('tipActive')) {
    $liveTip.css({
      top: event.pageY + 12,
      left: event.pageX + 12
    });
  }
});
/*
[object Object]
*/