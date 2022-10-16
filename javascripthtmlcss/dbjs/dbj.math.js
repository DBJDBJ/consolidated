///
/// MIT (c) 2009 - 2013 by DBJ.ORG
/// DBJ.MATH.JS(tm)
///
/// Dependencies : jQuery 1.3.2 or higher
/// Dependencies : DBJ.LIB.JS 1.0.0 or higher
/*@cc_on
@set @dbj = (1===1)
@if (@dbj)
// This code conditionaly in IE only
@end
@*/

(function(window, dbj, undefined) {

   if (undefined === dbj) return window.alert("ERROR: dbj.utl requires dbj.lib to be included before it.");


   dbj.math = {

       MAX_INT: (0xFFFF), /* a.k.a. 65535 a.k.a. max int16 number */
       fib: function (n)
           ///<summary>
           /// Fibbonachi number computation. 
           /// Much faster and *much* less dangerous to use than: 
           /// function fib(n){
           ///    return n < 2 ? n : fib(n - 1) + fib(n - 2);
           ///}
           /// Inspired by: http://www.ddj.com/hpc-high-performance-computing/217801225?pgno=5
           ///</summary>
       {
           var fib_1 = 1, fib_2 = 0, t;
           for (var i = 0; i < n; i++) {
               t = fib_1;
               fib_1 += fib_2;
               fib_2 = t;
           }
           return fib_2;
       },
       sort: function (/*int[]*/a, /*int*/l, /*int*/r) {
           /// <summary>
           /// quicksort algorithm. Why? It is found to be faster to use this than to relay 
           /// in IE on the inbuilt one.
           /// example call :
           /// dbj.sort( arr, 0, arr.length )
           /// will sort the whole of the array 'arr'
           /// due to the javascript typelese nature the meaning of "<=" operator 
           /// used is automagicaly working on strings,objects,dates etc ...
           /// </summary>
           ///	<param name="a" type="array">
           ///	array of object to be sorted
           ///	</param>
           ///	<param name="l" type="number">
           ///		starting index from which to sort ( 0 .. end-index )
           ///	</param>
           ///	<param name="r" type="number">
           ///		end index from which to sort ( start-index .. length )
           ///	</param>
           var i, j;
           var x, y;
           i = l; j = r;
           x = a[parseInt((l + r) / 2)];
           do {
               while ((a[i] < x) && (i < r)) i++;
               while ((x < a[j]) && (j > l)) j--;
               if (i <= j) {
                   y = a[i];
                   a[i] = a[j];
                   a[j] = y;
                   i++; j--;
               }
           } while (i <= j);
           if (l < j) dbj.sort(a, l, j);
           if (i < r) dbj.sort(a, i, r);
       },
       summa: (function () {
           /* help summarizing or averaging values saved in this cache of named arrays of numerical values 
           internal obj_ is object where each property is an array
           */
           var obj_ = {},
       sum_ = function (arr) { var l = arr.length, sum = 0; while (l--) { sum += arr[l]; }; return sum; },
       avg_ = function (arr) { return sum_(arr) / arr.length; };

           return {
               /* interface */
               add: function (k, v) {
                   v = v - 0;
                   if (!isArray(obj_[k]))
                       obj_[k] = [v];
                   else
                       obj_[k].push(v);
                   return v;
               },
               sum: function (k) { return sum_(obj_[k] || []); },
               avg: function (k) { return avg_(obj_[k] || []); },
               all: function (k) { return obj_[k] || [] },
               rst: function () { obj_ = {}; return this; }
           };
       } ())
   };

    // A dbj set of Number extensions.
    // why extending Number ? No other reason than chaining.
    // with bellow one can do
    // Number(148.23).c2f().f2c().fround(2)
    // above will end in :  148.23
    //
    Number.prototype.fround = function(dec_places) {
        ///<summary>
        // quick and dirty, (or maybe not ?) rounding of float's
        ///<summary/>
        var k = Number("1e" + (dec_places || 1)), f = this;
        f = "" + parseFloat(f), R = f.match(/\.(.+$)/);
        return !R ? f : Math.round(f) + "." + Math.ceil(R[0] * k);
    };
    Number.prototype.c2f = function() {
        ///<summary>
        /// Celsius to Farenheit
        ///<summary/>
        return this * 1.8 + 32;
    }
    Number.prototype.f2c = function() {
        ///<summary>
        /// Farenheit to Celsius 
        ///<summary/>
        return 5 / 9 * (this - 32);
    }
    
    Number.prototype.round = function(original_number, decimals) {
            /* quick number rounder */
                var V1 = original_number * Math.pow(10, decimals), V2 = Math.round(V1);
                return V2 / Math.pow(10, decimals);
            }

    // to convert radians to degrees divide by (Math.PI / 180), and multiply by this to convert the other way.
    var pi_over_180 = Math.PI / 180;
    Math.r2d = function(r) { return r / pi_over_180; }
    Math.d2r = function(d) { return d * pi_over_180; }

    Number.prototype.r2d() = function() { return Math.r2d.call(this); }
    Number.prototype.d2r() = function() { return Math.d2r.call(this); }

    // array math
    Array.prototype.sum = function() {
        for (var i = 0, L = this.length, sum = 0; i < L; sum += this[i++]);
        return sum;
    }

    Array.prototype.avg = function() {
        return this.sum() / this.length;
    }

    Array.prototype.max = function() {
        return Math.max.apply({}, this)
    }
    Array.prototype.min = function() {
        return Math.min.apply({}, this)
    }

    Array.max = function(arr) {
        return Array.prototype.max.call(arr);
    }

    Array.min = function(arr) {
        return Array.prototype.min.call(arr);
    }

    Array.sum = function(arr) {
        return Array.prototype.sum.call(arr);
    }

})(window, dbj);