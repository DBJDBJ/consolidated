      
(function () {

$("<head>").append("<style type='text/css'>" +
" .container{float:left;position:relative;background:#cccccc;margin:1px;}" +
" .container canvas{position:absolute;left:0px;top:0px;}" +
" .container .name{position:absolute;left:0px;bottom:0px;right:0px;" +
" height:20px;font:11px arial;line-height:20px;" +
" text-align:center;background:#eeeeee;}" +
"</style>" );

      var operation = ["source-over","source-in","source-out","source-atop",
                       "destination-over","destination-in","destination-out",
                       "destination-atop","lighter","xor","copy"
       ];

         // remove previuous test
         $("#test_div").remove();
         
         test( 180 )

      function test( size_ ) {
           var host_ = setupLayout($("#toolbar"), size_ || 80 );
              $.each( operation,  function ( i, id_ ) {
                                       var canvas = $("#"+id_, host_).find("#canvas_");
                                       testGlobalCompositeOperation(canvas[0],id_);
                                  });
      }

      function setupLayout(host_, size){
         var unit = (function () {
             var cache_ = null ;
             return function (id_) {
                if ( cache_ ) return cache.clone().attr("id",id_) ;
                var divTmpl = $("<div class='container' style='width:" + size + "px; height:" + size + 20 + "px' />")
                   .append( $("<canvas />").attr("width",size).attr("height",size).attr("id","canvas_"))
                   .append( $("<div class='name' />")) ;
                return cache_ = divTmpl.attr("id",id_) ;
           }
        })());

         var test_div = host_.append("<div id='test_div' />").find("#test_div");

         $.each( operation, function (i, id_ ) { 
                            test_div.append(unit(id_));
                   }
               );
         return test_div ;
      }
      function testGlobalCompositeOperation(canvas,op){
         var w = canvas.width/3 * 2, h = canvas.height/3 * 2;
         var ctx = canvas.getContext("2d");
         ctx.beginPath();
         ctx.fillStyle = "rgba(0,152,255,1)";
         ctx.fillRect(0,0,w,h);

         ctx.save();
         ctx.beginPath();

         ctx.globalCompositeOperation = op;

         ctx.fillStyle = "rgba(255,0,0,1)";
         ctx.arc(w,h,w/2,0,Math.PI * 2,false);
         ctx.fill();
         ctx.restore();
      }
/* eof */
}());