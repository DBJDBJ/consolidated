/*
tests for defauly.htm + dbj.qunit.js
*/
top.tests = {
    "Basic dbj.condxx()" : {
		"dbj.condeq() for the simplest native equality comparisons":
		[
		    [function () { return dbj.condeq(1, 1, "A", 2, "B", "C"); }, "A"],
            [function () { return dbj.condeq(7, 1, "A", 2, "B", "C"); }, "C"],
        ],
		"dbj.condnq() for the simplest native non-equality comparisons":
		[
		    [function () { return dbj.condnq(1, 1, "A", 2, "B", "C"); }, "B"],
            [function () { return dbj.condnq(1, 1, "A", 1, "B", "C"); }, "C"],
        ],
		"dbj.condgt() for the simplest native greater than comparisons":
		[
		    [function () { return dbj.condgt(1, 1, "A", 2, "B", "C"); }, "C"],
            [function () { return dbj.condgt(7, 7, "A", 2, "B", "C"); }, "B"],
        ],
		"dbj.condlt() for the simplest native less than comparisons":
		[
		    [function () { return dbj.condlt(1, 1, "A", 2, "B", "C"); }, "B"],
            [function () { return dbj.condlt(7, 7, "A", 4, "B", "C"); }, "C"],
        ]
	},
	"dbj.cond() by defauylt uses complex comparator for equality comparisons of any types": {  
		"dbj.cond() simpler uses": [
                [function () { return dbj.cond(1, [3, 2, 1], "A", 7, "B", "C"); }, "A"],
                [function () { return dbj.cond(7, [3, 2, 1], "A", 7, "B", "C"); }, "B"],
                [function () { return dbj.cond(9, [3, 2, 1], "A", 7, "B", "C"); }, "C"],
                [function () { return dbj.cond([4, 3, 2, 1], [3, 2, 1], "A", 7, "B", "C"); }, "C"]
            ],
		"dbj.cond() more complex usage": [
           [function () {
           	var f1 = function () { return 4; }, f2 = function () { return 5; }, 
			f3 = function () { return 3; }, f5 = function () { return 5; }, f6 = function () { return 6; };
           	return dbj.cond(f1, f1, f3, f2, f5, f6)();
           }, 3],
           [function () {
           	var f1 = function () { return 4; }, f2 = function () { return 5; };
           	return dbj.cond(f1, f1, "A", f2, "B", "C");
           }, "A"],
           [function () {
           	var d1 = new Date(), d2 = new Date(1959, 7, 3);
           	return dbj.cond(d1, d1, "A", d2, "B", "C");
           }, "A"],
           [function () { return dbj.cond(/./, /./, "A", /.[a,A]?/, "B", "C"); }, "A"],
           [function () { return dbj.cond([1, 2, 3], [1, 2, 3], "A", 7, "B", "C"); }, "A"],
           [function () { return dbj.cond([1, 2, 3], [1, [2,3], [1,2,3]], "A", 7, "B", "C"); }, "A"],
           [function () { return dbj.cond({ a: 7 }, [1, 2, 3], "A", { a: 7 }, "B", "C"); }, "B"]
		]
	}, // eof module
	"Utilities": {
		"DBJ String ulitities ": [
                [function () { return "{0}{1}{2}".format(1, 2, 3); }, "123"],
                [function () { return "{0}{1}{2}".format(0); }, "0{1}{2}"],
                [function () { return "{99}".format("!"); }, "{99}"]
              ],
		"DBJ dbj.role system": [
                [function () { return dbj.roleof(NaN); }, "Number"],
                [function () { return dbj.roleof([]); }, "Array"],
                [function () { return dbj.roleof(true); }, "Boolean"],
                [function () { return dbj.roleof(new Date()); }, "Date"],
                [function () { return dbj.roleof(new Error(0xFF, ".")); }, "Error"],
                [function () { return dbj.roleof(function () { }); }, "Function"],
                [function () { return dbj.roleof(Math); }, "Math"],
                [function () { return dbj.roleof(1); }, "Number"],
                [function () { return dbj.roleof({}); }, "Object"],
                [function () { return dbj.roleof(/./); }, "RegExp"],
                [function () { return dbj.roleof(""); }, "String"],
                [function () { return dbj.roleof(window.JSON || undefined); }, (window.JSON ? "JSON" : "undefined")],
                [function () { return dbj.roleof(window.Arguments || undefined); }, (window.Arguments ? "Arguments" : "undefined")],
                [function () { return dbj.roleof(undefined); }, "undefined"],
                [function () { return dbj.roleof(null); }, "null"]
            ],
		"DBJ dbj.role system isXXX functions ": [
                [function () { return dbj.role.isArray([]); }, true],
                [function () { return dbj.role.isBoolean(true); }, true],
                [function () { return dbj.role.isDate(new Date()); }, true],
                [function () { return dbj.role.isError(new Error()); }, true],
                [function () { return dbj.role.isFunction(Function); }, true],
                [function () { return dbj.role.isMath(Math); }, true],
                [function () { return dbj.role.isNumber(13); }, true],
                [function () { return dbj.role.isObject({}); }, true],
                [function () { return dbj.role.isRegExp(/./); }, true],
                [function () { return dbj.role.isString("."); }, true]
            ]
	}
}         // eof tests
