
    :dbj() pseudo selector for Sizzle/jQuery

    Version 1.0.0
    Copyright (c) 2013 DBJ.ORG 
    Released under the MIT, BSD, and GPL Licenses.
    Works with jQuery 1.8.1 or better

    Purpose:

    To be able to compose jQuery selectors where current values of data, css, properties or         attributes are used. Also to have the ability to use operators to check on current values.

    Syntax:
    
    ":dbj(label:name operator check)"
   
   Optional syntax parts: label:, operator and check.

   Where label is "data" or "css" or "prop" or "attr" if no label is given.

   Stabdard W3C operators are: "!=", "^=", "*=", "$=", "~=", "|=", "=":
   Four new operators can also be applied:  ">", "<", "<=", ">=","=="
   In which case,before comparison, parseFloat() is applied to values.

   API:

   Operators can be also user added/defined. Operators are binary.

   /* example of a user defined operator */
   dbj[":"]["rx"] = function ( current, check ) {
   }
   /* after this we can use new operator 'rx'*/
   $("p:dbj(prop:value rx /\d+/)");

    Standard Example:

    $("div[id]:dbj(css:bottom >= 10)");

    Above will select any div element that has a 'id' attribute and css bottom property
    bigger or equal to "10px" or "10%" or any other number/unit combination stored in css style.

    NOTE: if value or check value can not be parsed into float (NaN situation) they will NOT 
          be compared and the result will be false. 

           $("p[css:top > auto]") // makes no sense and result is false

    NOTE: This extensions provide more functionality. More functionality is less speed.

