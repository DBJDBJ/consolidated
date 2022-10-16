
///
/// MIT,GPL (c) 2009-2010 by DBJ.ORG
/// DBJ.HDR.JS(tm)
///
/// Standard javascript intro into my development and testing pages
///
/// $Revision: 13 $$Date: 10/29/11 09:09 $
///

/*
if using IE <= 8 include this file on the top of your html page
as it will provoke inclusion of firebug-lite
*/
if (! window.console )
    document.write(
'<!--[if lte IE 8]>' +
'<script type="text/javascript" src="https://getfirebug.com/firebug-lite.js"><' + '/script>' +
'<![endif]-->'
);
/* TODO: do we need this any more and actually ? */