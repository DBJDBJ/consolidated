
var storage = [] ;

function stream ( store_ )
{
  return function out ( s_ ) {
  
  if ( "function" === typeof s_ ) {
      s_.call( store_, arguments[1]  )
  } else {
     if( s_ )
       store_.push(s_) ;
  }
    return out ;
  }
}

var opener = function (tag_) { this["last_opener"] = tag_ ; this.push("<"+tag_+">"); },
    closer = function () { if (this["last_opener"]){ this.push("</"+this["last_opener"]+">"); delete this["last_opener"]}};
    sender = function ( url ) { alert(this.join("\n")); }

stream(storage)("A")("B")("C")
("ROOT")(opener,"ROOT")(2)(3)(closer)(sender)