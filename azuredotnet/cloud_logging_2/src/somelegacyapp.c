/*
Add gcc if not present -- apk add build-base

gcc main.c -o test

Imagine test is 20+ years old and we want its output to go
to the container log

./test &>/dev/console -- both STDOUT and STDERR will go to the log
./test 1>/dev/console -- only 1 == STDOUT
./test 2>/dev/console -- only 2 == STDERR

 And then: write 1 and 2 to log then redirect the log to container log 
 and then run as daemon
 
./test &>log.txt>/dev/console &

Note: it is important not to insert spaces above!

*/  
#include <stdio.h>
#include <time.h>
#include <unistd.h> // sleep

int main(void)
{
   int count = 5 ;

   while( count-- ) {

    time_t stamp_ = time(0);

   fprintf(stdout, "%ld STDOUT\r\n", stamp_);
   fflush(stdout);

   fprintf(stdout, "%ld STDERR\r\n", stamp_);
   fflush(stderr);

   sleep(3);

  }

return 0;
}
