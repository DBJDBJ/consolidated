//*** This code is copyright 2004 by Gavin Kistner, gavin@refinery.com
//*** It is covered under the license viewable at http://phrogz.net/JS/_ReuseLicense.txt
//*** Reuse or modification is free provided you abide by the terms of that license.
//*** (Including the first two lines above in your source code mostly satisfies the conditions.)


// Rounds a number to a specified number of decimals (optional)
// Inserts the character of your choice as the thousands separator (optional)
// Uses the character of your choice for the decimals separator (optional)
//
// It's not a highly optimized speed demon, but it gives the right result...
// ...do you really care how speedy it is? :)
//
// !!Note!! IEWin gets (-0.007).format(2) WRONG, claiming that it's "0.00"
// This is a bug in IEWin's Number.toFixed() function.


Number.prototype.format=function(decimalPoints,thousandsSep,decimalSep){
	var val=this+'',re=/^(-?)(\d+)/,x,y;
	if (decimalPoints!=null) val = this.toFixed(decimalPoints);
	if (thousandsSep && (x=re.exec(val))){
		for (var a=x[2].split(''),i=a.length-3;i>0;i-=3) a.splice(i,0,thousandsSep);
		val=val.replace(re,x[1]+a.join(''));
	}
	if (decimalSep) val=val.replace(/\./,decimalSep);
	return val;
}
if (typeof Number.prototype.toFixed!='function' || (.9).toFixed()=='0' || (.007).toFixed(2)=='0.00') Number.prototype.toFixed=function(f){
	if (isNaN(f*=1) || f<0 || f>20) f=0;
	var s='',x=this.valueOf(),m='';
	if (this<0){ s='-'; x*=-1; }
	if (x>=Math.pow(10,21)) m=x.toString();
	else{
		m=Math.round(Math.pow(10,f)*x).toString();
		if (f!=0){
			var k=m.length;
			if (k<=f){
				var z='00000000000000000000'.substring(0,f+1-k);
				m=z+m;
				k=f+1;
			}
			var a = m.substring(0,k-f);
			var b = m.substring(k-f);
			m = a+'.'+b;
		}
	}
	if (m=='0') s='';
	return s+m;
}



// var x = 1234567.89532;
// x.format()                  => 1234567.89532
// x.format(2)                 => 1234567.90
// x.format(2,',')             => 1,234,567.90
// x.format(0,',')             => 1,234,568
// x.format(null,',')          => 1,234,567.89532
// x.format(null,' ',',')      => 1 234 567,89532
// x.format(2,' ',',')         => 1 234 567,90
