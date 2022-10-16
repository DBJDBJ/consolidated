function Moment ( implementation ) {
    var name_ = name ;
    var imp_ = implementation ;
    this.answer = function ( json_string, callback ) {
         var opt = JSON.parse(json_string) ;
         var fun = imp_[opt.name] ;
         var arg = opt.arg || []  ;
         callback = callback || function () {/*no-op*/} ;
         var tid = window.setTimeout (
          function () {
               callback( fun( arg ) ) ;
           }     
          , Moment.timeout
         )
    }
}
Moment.timeout = 100 ; // uSec's
Moment.registry = [] ;
Moment.create = function ( json_string ) { 
    var opt = JSON.parse(json_string) ;
    return Moment.registry[opt.name ] ;
} ;
Moment.remember = function ( json_string, object ) {
    var opt = JSON.parse(json_string) ;
    Moment.registry[opt.name ] = new Moment( opt.name, object ) ;
} ;


Moment.remember('{ "name" : "person"}', { "name" : function () { return "Bill"; } } ) ;

person = Moment.create('{"name":"person"}') ;

person.answer('{"name":"name"}', function (data) {alert(data)} )