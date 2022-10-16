
Object.prototype.each = function(func) {
// var args = Array.prototype.slice.call(arguments).slice(1);
for (property in this) {
   if ( ! Object.prototype[property]) {
    func.call(this, property );
 }
}
};
s = "";
var x = {a:"aa", b:"bb", c:"cc"};
x.each(function( property_name ) {
s += (property_name + ": " + this[property_name] +"\n" );
});
s