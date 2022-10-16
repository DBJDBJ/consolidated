Array.prototype.swap=function(a, b)
{
	var tmp=this[a];
	this[a]=this[b];
	this[b]=tmp;
}

function partition(array, begin, end, pivot)
{
	var piv=array[pivot];
	array.swap(pivot, end-1);
	var store=begin;
	var ix;
	for(ix=begin; ix<end-1; ++ix) {
		if(array[ix]<=piv) {
			array.swap(store, ix);
			++store;
		}
	}
	array.swap(end-1, store);

	return store;
}
function qsort(array, begin, end)
{
	if(end-1>begin) {
		var pivot=begin+Math.floor(Math.random()*(end-begin));

		pivot=partition(array, begin, end, pivot);

		qsort(array, begin, pivot);
		qsort(array, pivot+1, end);
	}
}
function quick_sort(array)
{
	qsort(array, 0, array.length);
}

arr = "CFVGBHNJMKA".split(""); // [14,12,3,2,1]
quick_sort(arr)
arr
/*
1,2,3,12,14
*/

/*
B,C,F,G,H,J,K,M,N,V
*/

/*
A,B,C,F,G,H,J,K,M,N,V
*/