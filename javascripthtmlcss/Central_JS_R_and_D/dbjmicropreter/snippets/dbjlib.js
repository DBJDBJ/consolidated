if ( typeof DBJ == "undefined" || ! DBJ ) function DBJ()
{
return {

is_in:function (mvalue,mtest){ return (mtest.test(mvalue)) ? true : false; },
f:function (n) { return n < 10 ? '0' + n : n;  },
stamp : function () {
                    var d = (new Date()) ;
	            return d.getUTCFullYear()   + '-' +
	                 this.f(d.getUTCMonth() + 1) + '-' +
	                 this.f(d.getUTCDate())      + 'T' +
	                 this.f(d.getUTCHours())     + ':' +
	                 this.f(d.getUTCMinutes())   + ':' +
	                 this.f(d.getUTCSeconds())   + 'Z';
	        }
}
}

var s = "" ;
for( dbj in DBJ() )
{
    s += ", " + dbj ; // typeof dbj is "string"
}
s.substring(2)