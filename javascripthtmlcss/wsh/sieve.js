(function() {
    var N = 1000000 + 1;
    var Primes = new Array(N);
    Primes[0] = false;
    Primes[1] = false;
    for (var i = 2; i < N; i ++) {
        Primes[i] = true;
    }
    var M = Math.sqrt(N);
    for (var j = 2; j <= M; j ++) {
        if (Primes[j]) {
            var i = j * j;
            for (; i < N; i += j) {
                Primes[i] = false;
            }
        }
    }
    var s = "";
    for (var i = 0; i < N; i ++) {
        if (Primes[i]) {
            s += i + ", ";
        }
    }
    WScript.Echo(s.length); // output length of string to validate the result
})();