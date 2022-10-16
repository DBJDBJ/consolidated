var dbj = {
        isFunction : function(obj) {
            return Object.prototype.toString.call(obj) === "[object Function]";
        },

        isArray : function(obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
        },
       
        isWhat : function( obj, full ) {
              var ctor = undefined === obj.constructor ? obj+"" : obj.constructor+""  ;
              if ( full )return ctor.match(/\w+/g) ;
              return ctor.match(/\w+/g)[0] ;
        }
}
dbj.isWhat(document.getElementById)