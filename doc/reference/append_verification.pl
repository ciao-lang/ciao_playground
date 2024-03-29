:- module(_, [], [assertions]).

:- doc(filetype, documentation).

:- doc(title, "Checking predicate app/3").

:- doc(module, "

@section{Analyzing}
 
Let us analyze this implementation of the @pred{app/3} predicate:

```ciao_runnable
%! \\begin{code}
:- module(_, [app/3], [assertions]).

:- pred app(A,B,C) : (list(A), list(B)) => var(C).

app([],Y,Y).
app([X|Xs], Ys, [X|Zs]) :-
    app(Xs,Ys,Zs).  
%! \\end{code}
%! \\begin{opts}
A,filter=all
%! \\end{opts}  
```

Automatic analysis can be performed by clicking @key{?} button.

By default, @apl{CiaoPP} analyzes programs with a type domain (@tt{eterms}) and a
sharing/freeness domain (@tt{shfr}).  The inferred information is expressed with
(@tt{true}) assertions (for a more extensive tutorial of the assertion
language see section @em{Using assertions for preprocessing programs}
in the @apl{CiaoPP} manual).
@tt{true} represents abstractions of the behaviour of the program inferred by the
analyzer. In this case, it was inferred:

@exfilter{app_assrt_false.pl}{A,filter=tpred}

The first assertion contains types information and encodes @em{predicate @tt{app/3} is
called with @var{A} and @var{B} as @tt{lists} and if it succeeds, @var{C} will
be a @tt{list}}.

The second one contains information about how variables are shared. It was
inferred that when @tt{app(A,B,C)} is called arguments @var{A}, @var{B}, and
@var{C} may be shared and if it succeeds they also will be shared, since @var{C}
is the concatenation of @var{A} and @var{B}.
 
@section{Assertion Checking}

In the example above, we have also added an assertion with properties that we want
to prove about the execution of the program.

```ciao
:- pred app(A,B,C) : (list(A), list(B)) => var(C).
```
 
This assertion is stating that if the predicate is called with a @var{A} and
@var{B} @tt{list}, if it succeeds @var{C} will be a free variable.
Of course, this assertion does not hold and we get a message saying so:

@exfilter{app_assrt_false.pl}{V,filter=warn_error}

Assertion checking can also be reported within the source code,
we can see that the analyzer does not verify the assertion that we had included.
Run the analysis again (clicking @key{?} button) to see the result.

@begin{cartouche}
@bf{Exercise. }@em{What assertion would we need to add?}
```ciao_runnable
%! \\begin{code}
:- module(_, [app/3], [assertions]).

:- pred app(A,B,C) : (list(A), list(B)) => var(C).

app([],Y,Y).
app([X|Xs], Ys, [X|Zs]) :-
    app(Xs,Ys,Zs).  
%! \\end{code}
%! \\begin{opts}
solution=verify_assert
%! \\end{opts}  
%! \\begin{solution}
:- module(_, [app/3], [assertions]).

:- pred app(A,B,C) : (list(A), list(B)) => list(C).

app([],Y,Y). 
app([X|Xs], Ys, [X|Zs]) :-
    app(Xs,Ys,Zs).   
%! \\end{solution}
```
@end{cartouche}
 

@section{Program Optimization} 

The following program naively implements a predicate that duplicates the first
element of a list. 

```ciao_runnable
%! \\begin{code}
:- module(_, [dup_first/2], []).

dup_first([X|Xs], Zs) :-
    app([X], [X|Xs], Zs).

app([],Y,Y).
app([X|Xs], Ys, [X|Zs]) :-
    app(Xs,Ys,Zs).
%! \\end{code}
%! \\begin{opts}
O,filter=all
%! \\end{opts} 
```

@apl{CiaoPP} can automatically optimize sources, see the result by clicking @key{?} button.
").
