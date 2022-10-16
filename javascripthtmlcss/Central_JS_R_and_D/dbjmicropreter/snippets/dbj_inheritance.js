
// http://javascript.crockford.com/prototypal.html
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        return (function () {}).prototype = (o || {});
    };
}

oldObject = function () { this.toString = function () { return "oldObject"; }} ;
newObject = Object.create(oldObject);
oldObject.m = function () { return "oldObject.m" ; }
newObject.m();
/*
oldObject.m
*/