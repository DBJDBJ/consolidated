window.myFunc = function (data) {
 alert(data['responseData']['results'][0]['content']);
}
var script = document.createElement('script');
script.src = 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=Dog&callback=myFunc';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);