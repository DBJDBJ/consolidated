# dbj.cond.comparators

(c) 2009-2018 .. and beyond, by dbj.org  
 Licensed under the Apache License 2.0 

<img src="http://dbj.org/wp-content/uploads/2013/07/comparator-e1373486780369.jpg" alt="dbj.cond() by dbj.org" width="100%" align="left" vspace="15px" />

# &nbsp;

dbj Comparators to be used either standalone or with <a href="https://www.npmjs.com/package/dbj.cond" target="_blank">dbj.cond</a>

The purpose of this comparators is functionality not speed. They are most usefull when used with dbj.cond, or some such mechanism for complex conditional programing made feasible.

The API
```
npm install dbj.cond.comparators
```
```javascript
require("dbj.cond.comparators");
// after this we have dbj.compare available
// standard strict equaility (aka '===')
// returns true
dbj.compare.standard(42,42); 
// arrays comparison
// is comparator argument is provided it is deep
// otherwise it is shallow "===" comparison
// for array elements comparing
// returns true
dbj.compare.arr([42],[42]);
// transforms both arguments to arrays
// returns true
dbj.compare.arr( 42 , 42 );
// two way lookup comparison
// if comparator argument is provided it is deep
// otherwise it is shallow "===" comparison
// returns false
dbj.compare.lookup( [42], [42]); 
// returns true
dbj.compare.lookup( 42, 42); 
// secondary comparator may be given 
// to both 'arr' and 'lookup'
// it is used for deep comparisons 
// it can be passed direct as third argument or factory
// method 'make' might be used as a better option
const fdeq = require('fast-deep-equal');
const arr = dbj.compare.make('arr', fdeq) ;
// returns true
arr([[42]],[[42]]);
// returns true
// arguments are transformed to arrays
arr({a:42},{a:42});
//
const lookup  = dbj.compare.make('lookup', fdeq );
// returns true
lookup([1,2,3], 2);
// also returns true
lookup([1,{a:2},3], {a:2})
//
```

For overview and usage with dbj.cond, 
please go to the short <a href="https://github.com/DBJDBJ/dbj.cond/blob/master/man.md" target="_blank">**online manual**</a> on the GitHub project. 

For testing project please go straight to 
<a href="https://github.com/DBJDBJ/dbj.cond.test" target="_blank">**dbj.cond.test**</a> on GitHub.

Please do feel free to send us your code and comments. 
We might publish it and discuss it on <a href="https://dbj.org" target="_blank">dbj.org</a> site.

**NOTE**  
 
Please do not hesitate to ask for a suport by mailing <a href="mailto:info@dbj.org" target="_blank">info@dbj.org</a>

---------------------------------------------------------------------  
### &copy; 2018 [![dbj();](http://dbj.org/wp-content/uploads/2015/12/cropped-dbj-icon-e1486129719897.jpg)](http://www.dbj.org "dbj")  
