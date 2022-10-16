# -----------------------------------------------------
# recursive  (aka wrong) fibbonacci
#
def ff(n) :
    if n < 2:
        return n
    else:
        return ff(n - 1) + ff(n - 2)

# -----------------------------------------------------
# non recursive (aka ok) fibbonacci
#
def fib(n):
    if n == 1:
        return [1]
    if n == 2:
        return [1, 1]
    fibs = [1, 1]
    for i in range(2, n):
        fibs.append(fibs[-1] + fibs[-2])
    return fibs

#fibonacci sequence with dictionary acting as "table" 
# of predefined fib numbers
class tabular_fibo:
    # DBJ: 
    # dictionary starts with first two fib numbers
    # we can populate it with all the possible fib numbers for the 
    # current platform and intrinsic type used by the language
    # thus avoiding any calculation whatsoever
    memory = { 0:1 , 1:1 }
    
    def fibonacci(n):
        if n in tabular_fibo.memory:
            return tabular_fibo.memory[n]
        else:
            tabular_fibo.memory[n] = tabular_fibo.fibonacci(n-1) + tabular_fibo.fibonacci(n-2)
            return tabular_fibo.memory[n]

if __name__ == "__main__":
    value = tabular_fibo.fibonacci(100)

# print("\nmemory type is: {}".format( type(tabular_fibo.memory) ))

print("\nFibonacci({}) : {}".format(100,value))
# 
print("\n---------------------------------------------------------------------\n")
print(fib(1))  # [1]
print(fib(2))  # [1, 1]
print(fib(3))  # [1, 1, 2]
print(fib(10)) # [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]