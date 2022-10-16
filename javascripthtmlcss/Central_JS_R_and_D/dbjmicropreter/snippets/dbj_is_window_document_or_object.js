// DBJ.ORG 2011
(function (theWindow, undefined) {
// no point in proceeding if there is no dom
   if ( ! theWindow ) throw "object window not found, is there no DOM here?" ;

   dbj = dbj == undefined ? {} : dbj ;

   dbj.isWindow = function (obj) {
       // check the top window if we do not match this window
       return obj === theWindow || obj === theWindow.top ;
   }

   dbj.isDocument = function (obj) {
       // check the top document if we do not match this document
       return obj === theWindow.document || obj === theWindow.top.document ;
   }

   dbj.isBody = function (obj) {
       // check the top body if we do not match this body
       return obj === theWindow.document.body || obj === theWindow.top.document.body ;
   }

}(window));

JSON.stringify(document.createElement("IFRAME"));
/*
{}
*/