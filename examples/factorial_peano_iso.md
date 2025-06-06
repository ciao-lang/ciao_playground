\title An example of an exercise

# Exercise: code factorial using ISO-Prolog arithmetic 

Consider again the factorial example, using Peano arithmetic:
```ciao_runnable
:- module(_, _, [sr/bfall]).
%! \begin{focus}
factorial(0,s(0)).
factorial(s(N),F) :-
    factorial(N,F1),
    times(s(N),F1,F).
%! \end{focus}

nat_num(0).
nat_num(s(X)) :- nat_num(X).

times(0,Y,0) :- nat_num(Y).
times(s(X),Y,Z) :- plus(W,Y,Z), times(X,Y,W).

plus(0,Y,Y) :- nat_num(Y).
plus(s(X),Y,s(Z)) :- plus(X,Y,Z).
```

Load the program (click on **?**) and note some facts about this version:
  - It is fully reversible!
```ciao_runnable
?- factorial(X,s(s(s(s(s(s(0))))))).
```
  - But also inefficient (try progressively increasing the input below): 
```ciao_runnable
?- factorial(s(s(s(s(0)))),Y).
```

An alternative is to code it using ISO-Prolog arithmetic, i.e., `is/2`:
```ciao
 ... Z is X * Y ... 
```

Try in the following window to encode the factorial program using
`is/2`, following the instructions: 
```ciao_runnable
:- module(_, _, [assertions]).

:- test factorial(A, B) : (A = 0) => (B = 1) + (not_fails, is_det).
:- test factorial(A, B) : (A = 1) => (B = 1) + (not_fails, is_det).
:- test factorial(A, B) : (A = 2) => (B = 2) + (not_fails, is_det).
:- test factorial(A, B) : (A = 3) => (B = 6) + (not_fails, is_det).
:- test factorial(A, B) : (A = 4) => (B = 24) + (not_fails, is_det).
:- test factorial(A, B) : (A = 5) => (B = 120) + (not_fails, is_det).
:- test factorial(A, B) : (A = 0, B = 0) + (fails, is_det).
:- test factorial(A, B) : (A = 5, B = 125) + (fails, is_det).
:- test factorial(A, B) : (A = -1) + (fails, is_det).

%! \begin{hint}
% TASK 1 - Rewrite with Prolog arithmetic 
factorial(0,s(0)).    % TODO: Replace s(0) by 1
factorial(M,F) :-     % TODO: Make sure that M > 0
    M = s(N),         % TODO: Compute N from M using is/2 (note that N is 
    factorial(N,F1),  %       unbound, so you need to compute N from M!)
    times(M,F1,F).    % TODO: Replace times/3 by a call to is/2 (using *)
% When you are done, press the face ("Run tests") to check you program.
% You can also use the arrow to "Load into playground".
%! \end{hint}
%! \begin{solution}
factorial(0,1). 
factorial(N,F) :-
    N > 0,
    N1 is N-1,
    factorial(N1,F1),
    F is F1*N.
%! \end{solution}
```

You can also click on **Show solution** to load the solution in the
edit area. 

Note that this type of arithmetic provides a (large!) performance
gain. But it also has limitations: it only works in one direction,
i.e., the second argument of `is/2` must be bound to an arithmetic
term. Thus, wrong goal order in your solution above can raise an error
(e.g., moving the last call to `is/2` before the call to factorial).

Meta-logical tests (see later) can be used to improve this, but we
will see later a more elegant solution: using constraints!
