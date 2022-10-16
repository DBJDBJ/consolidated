
var d1 = new Date(2011,11,11,11,11,11,11), d2 = new Date(2011,11,11,11,11,31,13);

function dd( date1, date2) {
    return (date1 - date2)/1000;
}
dd2 = (function () {
       var mili2day = (60/24)/(1000*60), day2mili = 1000*60*60*24,
           hor2mili = 1000*60*60,
           min2mili = 1000*60,
           sec2mili = 1000;
return function (earlierDate,laterDate)
{
       var nTotalDiff = laterDate - earlierDate;
       var oDiff = {};
 
       oDiff.days = Math.floor(nTotalDiff*mili2day);
       nTotalDiff -= oDiff.days*day2mili;
 
       oDiff.hours = Math.floor(nTotalDiff/1000/60/60);
       nTotalDiff -= oDiff.hours*hor2mili;
 
       oDiff.minutes = Math.floor(nTotalDiff/1000/60);
       nTotalDiff -= oDiff.minutes*min2mili;
 
       oDiff.seconds = Math.floor(nTotalDiff/1000);
       nTotalDiff -= oDiff.seconds*sec2mili ;
       
       oDiff.milisec = nTotalDiff ;
       return oDiff;
}
}());
JSON.stringify(dd2( d1, d2 ));
/*
{"days":0,"hours":0,"minutes":0,"seconds":20,"milisec":2}
*/