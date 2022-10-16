var pack = '{ "document.writeln(\'ka-boom!\')" : "innocent" }' ;
var obj = (new Function("return " + pack ))() ;
for ( bomb in obj )  eval(bomb) ; // bang!