var url= ["http://www.jobserve.com/MySearch/7093EA52A4F820.rss"
         ,"http://www.jobserve.com/MySearch/CC3E63DF1A06421F.rss"] ;
var RSS = {} ;
RSS.items = {} ;
RSS.items.toString = function ( delim ) { var s = [] ;
   for( var j in RSS.items ) s.push(j + ":" + RSS.items[j]);
   return s.join(delim) ;
}
//
$.get( url[1], function( data ) {
    $js = $(data) ;
    RSS.title = $js.find("title:first").text() , counter = 1 ;
    // if title contains 'Error' no items will be in the data
    $js.find("item").each( function () {
         item_proc(this) ;
    }
    );
    POP("<font size=1>" + RSS.title + "<hr/>" + RSS.items.toString("<hr/>") + "</font>") ;
});

// each item contains: title,link,description,guid,pubDate
function item_proc( item )
{
    var s = [] ;
    $($(item).find("description").text())
    .each(function (){
        if ( this.nodeName.match(/table/i) )
           s.push( this.innerHTML );
     }) ;

    var $description = $( "<table border=2>" + s.join("") + "</table>") ;
     s = [] ;
    $description.find("tr").each( function (){
        s.push( MKP(this.innerText) ) ;
      }
     ) ;
   s = s.join(",") ;
   s = "{" + s.replace(/^.,/, "" ) + "}" ;
   try {
         item = JSON.parse(s) ;
         RSS.items[item.Reference] = s ;
   } catch (x) {
        alert("Error:" + x.message + "\n\nWhile evaluating:\n" + s ) ;
   }
}
function MKP ( s )
{ 
   var p = s.split(":") ;
   if ( p.length === 2 ) return '"' + p[0].trim().replace(/\s/g,"_") + '":"' + p[1].trim() + '"' ;
   return s ;
}