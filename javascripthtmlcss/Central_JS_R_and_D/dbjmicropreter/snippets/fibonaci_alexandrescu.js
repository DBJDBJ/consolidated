function fib(n)
{
   var fib_1 = 1, fib_2 = 0, t ;
   while (n--)
  {
      t = fib_1;
      fib_1 += fib_2;
      fib_2 = t;
   }
   return fib_2;
}

fib(500)