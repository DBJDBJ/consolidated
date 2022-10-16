
// http://javascript.crockford.com/prototypal.html
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();  
    };
}

y = {a:1,b:2}
x = dbj.create( y )
y.c = 3
dbj.jsonize(x)
/*
{ a: 1, b: 2, c: 3 }
*/
x == y
/*
true
*/