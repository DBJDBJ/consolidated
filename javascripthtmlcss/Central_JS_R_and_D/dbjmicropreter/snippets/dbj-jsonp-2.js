
function goory ( qry ) {
window.myCB = function (data) {
 head.removeChild(script);
   POP( data['responseData']['results'][0]['content'] );
}
var head = document.getElementsByTagName('head')[0],
    script = document.createElement('script');
script.src = 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=' + qry + '&callback=myCB';
script.type = 'text/javascript';
script = head.appendChild(script);
};
goory( "dr jelena milosevic york phd bsc" );