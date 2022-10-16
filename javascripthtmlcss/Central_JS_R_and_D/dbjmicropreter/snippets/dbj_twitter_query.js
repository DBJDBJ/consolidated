var S = "" ;
jQuery.support.cors = true;
$.getJSON('http://search.twitter.com/search.json?q=windows8', function (data) {
    if(data.results.length < 24 )
    {
       for ( var t in data.results) S += "\n" + data.results[t].text;
       alert(S);
    } 
    else alert(data.results[0].text);
});
/*
[object Object]
*/