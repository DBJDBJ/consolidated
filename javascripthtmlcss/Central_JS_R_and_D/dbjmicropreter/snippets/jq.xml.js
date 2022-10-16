var typenames = [
"NULL" , "ELEMENT_NODE", "ATTRIBUTE_NODE", "TEXT_NODE", "CDATA_SECTION_NODE",  "ENTITY_REFERENCE_NODE", 
"ENTITY_NODE", "PROCESSING_INSTRUCTION_NODE", "COMMENT_NODE", "DOCUMENT_NODE", "DOCUMENT_TYPE_NODE", 
"DOCUMENT_FRAGMENT_NODE", "NOTATION_NODE" ] ;

function createXML() {
      var xml;

      if (document.implementation &&
                   document.implementation.createDocument) {
        xml = document.implementation.createDocument("", "", null);
      } else {
        xml = new ActiveXObject("MSXML2.DOMDocument");
      }
      return xml;
    }

var xml = createXML() ;
xml.loadXML('<States><State ref="FL"><name>Florida</name><capital>Tallahassee</capital></State><State ref="IA"><name>Iowa</name><capital>Des Moines</capital></State></States>') ;

X = $(xml)
s = "" ;
X.each( function ( j, k ){s += "\n " + j + ":" + this.nodeName + ",\t" + typenames[this.nodeType] ;} )
//$.isXMLDoc(xml)
s

X.find("State").length