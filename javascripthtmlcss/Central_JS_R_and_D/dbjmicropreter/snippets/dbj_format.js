//
// .net string.format like function
// usage:   "{0} means 'zero'".format("nula") 
// returns: "nula means 'zero'"
// place holders must be in a range 0-99.
// if no argument given for the placeholder, 
// no replacement will be done, so
// "oops {99}".format("!")
// returns the input
// same placeholders will be all replaced 
// with the same argument :
// "oops {0}{0}".format("!","?")
// returns "oops !!"
//
String.prototype.format = function () {
   var args = arguments; 
   return this.replace( /\{(\d|\d\d)\}/g, 
   function ( $0 ) {
      var idx = $0.match(/\d+/);
      return args[idx] ? args[idx] : $0 ;
   } );
}

"T123{0}T{0}".format("A","B")
/*
T123ATA
*/