	 var wd=450
	 var hd=250
	 function pie(values,max,labels){
	   var simpleEncoding = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	   function simpleEncode(values,maxValue) {
	     var chartData = ['s:'];
	     for (var i = 0; i < values.length; i++) {
	       var currentValue = values[i];
	       if (!isNaN(currentValue) && currentValue >= 0)
	         chartData.push(simpleEncoding.charAt( Math.round((simpleEncoding.length-1) * currentValue / maxValue)));
	       else chartData.push('_');
	     }
	     return chartData.join('');
	   }
	   var chart="cht=p3&chd="+simpleEncode(values,max) +"&chs="+wd+"x"+hd+"&chl="+labels;
	   return "<img src='http://chart.apis.google.com/chart?"+chart+"'/>";
	 }
	   
	 POP ( pie([80,20],80,"hello|world") + pie([20,40,80],80,"a|b|c")) ;


/*
undefined
*/

/*
undefined
*/