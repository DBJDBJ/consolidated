function GetScriptEngineInfo(){
   return ScriptEngine() + " " + ScriptEngineMajorVersion() + "." + ScriptEngineMinorVersion() + "." + ScriptEngineBuildVersion();
}

   // Format integer string to have at least LEN digits.
   // where 2 < LEN < 7
   function NS(n, LEN ) {
        if ( ! LEN ) LEN = 2 ;
        LEN %= 7 ;
        var sign = n < 0 ? "-" : "+" ;
        n = Math.abs(n) ;
        var T = [ 
              null, /* 0 */
              null, /* 1 */
              { N: 10, P:'0' },           /* len == 2 */
              { N: 100, P:'00' },         /* len == 3 */
              { N: 1000, P:'000' },       /* len == 4 */
              { N: 10000, P:'0000' },     /* len == 5 */
              { N: 100000, P:'00000' },   /* len == 6 */
              { N: 1000000, P:'000000' }  /* len == 7 */
        ];
        return sign +( n < T[LEN].N ? T[LEN].P + n : n ) ;
    }


var ua = GetScriptEngineInfo() ; // window.navigator.userAgent ;

NS( 3,44 )
/*
+03
*/