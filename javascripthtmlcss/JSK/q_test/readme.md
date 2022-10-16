#DBJ*Q(tm) : Quick-Query-Engine 
##            Tiny Simpler and faster element queries
---
####Copyright(c) 2009-2010 by DBJ.ORG
####Dual licensed under the MIT and GPL licenses.
####Please mail to: dbjdbj@gmail.com
####for the usage of this code to be granted 

####NOTE! Only W3C compliant browsers are suported
####NOTE! this works in all browser supporting document.querySelectorAll() method
####NOTE! error checks are *minimal*

##The API

###Q(selector, container)

selector is any valid CSS "like" selector
container dom element is optional, default is document object
returns: always an list of matched elements, with a "length" property
no result will return null

###Q.FLUSH(container, selector)

flush the whole internal cache
or  for the results inside a container if given
and for the results for a selector if given

###Q.ID = function(id_string)

helper : query by ID only, 
return the first element found by id given
returns null if no element found

###Q.CLASS = function(class_name) {

Same as above but for given class name.
Use this instead of getElementByClassName()

###Q.NULL = function(selector, container) 

helper: return true if query has result,
otherwise null

###Q.EACH(method, selector, container)

For each element found call the function given.
Element found is passed as the first argument.

###Q.LABEL(label_, selector_, container_)
	
If label_ is a string Label each element found by the selector and container given
previous labels will be replaced
Otherwise if label_ is object the label content of that object will be returned
Null is returned for missing labels
Use this method to store arbitrary data in the attribute value.
Attribute name is hidden.

-----------------------------------------------------------------------------
##Q.T are Q Text methods extension

For every 'th' inside every table which has a border=2
select it, if it contains letters A, B or C
if it does put the result in an list to be returned

###Q.T.M(/A|B|C/,"table[border='2'] th")

Format of a returned object is

 { "node": object , "match": "..."}

where 'node' is element , and 'match' is the result of
matching the whole of the text found inside the element, using the regexp given
on no result returns an empty array
on error returns null

###Q.T.F(dom_element,/A|B|C/)

Will return only the first element found, where its text content
has to match the regex given 
the element given is the root element for the search

##------------------------------------------------------------------------------------
##------------------------------------------------------------------------------------
