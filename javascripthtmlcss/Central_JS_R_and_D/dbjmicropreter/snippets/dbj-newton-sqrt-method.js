

function sqrt(n) {
    var approx = n/2.0 ;
    var better = (approx + n/approx)/2.0 ;
    while (better != approx) {
        approx = better
        better = (approx + n/approx)/2.0
    }
    return approx
}
function comp (x)
{
  var r1 = Math.sqrt(x) , r2 = sqrt(x) ;
  return "for: " + x + " :: " + r1 + " === " + r2 + " : " + (r1 === r2);
}

comp(1e19 * Math.random())
/*
for: 5919322810174573000 :: 2432965846.487487 === 2432965846.487487 : true
*/

/*
for: 4386123927032213000 :: 2094307505.3659653 === 2094307505.3659653 : true
*/

/*
for: 6097850080176330000 :: 2469382530.1431794 === 2469382530.143179 : false
*/

/*
for: 8381492019027457000 :: 2895080658.4666095 === 2895080658.4666095 : true
*/