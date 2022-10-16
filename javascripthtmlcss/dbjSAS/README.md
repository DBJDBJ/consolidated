
    # dbj Enhanced Attribute Selectors   
	##(aka dbjSAS or SAS) for Sizzle/jQuery  

    Version: 1.0.1
    Copyright (c) 2009 Balazs Endresz (BE) (balazs.endresz@gmail.com)
    Released under the MIT, BSD, and GPL Licenses.
    2010-04-21 Balazs fixed for jQuery (Sizzle) 1.4.2

    Version 2.0.0
    Copyright (c) 2013 DBJ.ORG 
    Released under the MIT, BSD, and GPL Licenses.
    Works with jQuery 1.9.1 or better

    Extended attribute selection syntax:

    for data -- "[:name  operator value]"
    for css  -- "[~name  operator value]"
    for prop -- "[::name operator value]"

    If extended attr syntax is used four new operators can also be applied: 
    >, <, <=, >=
    in which case,before comparison, parseFloat() is applied to values.
    Example:
           $("div[id][~bottom>=10]");

    Above will select any div element that has a 'id' attribute and css bottom property
    bigger or equal to "10px" or "10%" or any other number/unit combination stored in css style.

    NOTE: if value or check value can not be parsed into float (NaN situation) they will NOT 
          be compared and the result will be false. 

           $("p[~top > auto]") // makes no sense and result is false

    NOTE: This extensions provide more functionality. More functionality is less speed.

	TEST is here :	http://jsfiddle.net/dbjdbj/PPTED/
	
PS: this is how it all started: http://dbj.org/dbj/?p=85

DBJ

