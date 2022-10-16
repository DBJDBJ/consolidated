

$.fn.extend({
    
    path :  function(root) {
        var r;
        if(root) {
            r = $(root)[0];
        } else {
            r = $()[0];
        }
        var el = this[0];
        if(el) {
            var path = "";
            while(el && el.parentNode && el != r) {
                if(el.nodeType == 9) {
                    // reached document node, no root provided.
                    return;
                }

                if (el.id){
                    path = el.tagName.toLowerCase()+"#"+el.id+" "+path;
                    break;
                } else {
                    path = el.tagName.toLowerCase()+":eq("+
                        $(el).prevAll(el.tagName).size()+") "+path;
                }
                var el = el.parentNode;
            }
        }
        return path;
    }
});
$("button").path()
/*
button#dugme_eval 
*/