Const N = 1000000 
ReDim Primes(N) ' VBScript holds 1000000+1 elements
 
Primes(0) = False
Primes(1) = False
For i = 2 To N
    Primes(i) = True
Next
 
M = Sqr(N)
For j = 2 To M
    If Primes(j) Then
        i = j * j
        While i <= N  ' Filtering out non-prime numbers
            Primes(i) = False
            i = i + j
        Wend 
    End If 
Next
 
S = ""
For i = 0 To N
    If Primes(i) Then ' concatenate numbers into strings
        S = S & i & ", "
    End If
Next 
 
' Just output the length
WScript.Echo Len(s)