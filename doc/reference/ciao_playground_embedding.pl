:- use_package([assertions]).

:- doc(filetype, documentation).

:- doc(title, "Creating Documents with Editable and Runnable Examples").

:- doc(module,"

The [Ciao Prolog Playground](/playground) provides an @em{easy way to
embed editable and runnable short code snippets} in manuals,
tutorials, slides, exercises, etc., and in general any kind of
document. The following sections show how to embed @em{editable} and
@em{runnable} snippets using:
@begin{itemize}
@item the LPdoc documenter (@ref{Editable and Runnable Examples using LPdoc})
@item other tools, such as Google
Docs, Jupyter notebooks, Word, Powerpoint, LaTeX, Pages, Keynote, Org
mode, web site generators, etc., etc. (@ref{Adding runnable examples
to arbitrary documents}).
@end{itemize}

@cindex{playground, direct access}
@cindex{playground, runnable examples}
@cindex{runnable examples}

@section{Editable and Runnable Examples using LPdoc}

Documents with @em{embedded} editable and runnable examples can be
generated easily using the @apl{LPdoc} tool. Code fragments can be
automatically rendered as editable panes that can be run in place
(embedded playground) or loaded into a separate playground. The
following example: 

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

%! \\begin{hint}
% TASK 1 - Rewrite with Prolog arithmetic 
factorial(0,s(0)).    % TODO: Replace s(0) by 1
factorial(M,F) :-     % TODO: Make sure that M > 0
    M = s(N),         % TODO: Compute N from M using is/2 (note that N is unbound! clear the equation)
    factorial(N,F1),
    times(M,F1,F).    % TODO: Replace times/3 by a call to is/2 (using *)
% When you are done, press the triangle (\"Run tests\") or the arrow (\"Load into playground\").
%! \\end{hint}

%! \\begin{solution}
factorial(0,1). 
factorial(N,F) :-
    N > 0,
    N1 is N-1,
    factorial(N1,F1),
    F is F1*N.
%! \\end{solution}
```

Can be generated including in the source file (e.g., in markdown) the
following code:

~~~
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

%! \\begin{hint}
% TASK 1 - Rewrite with Prolog arithmetic 
factorial(0,s(0)).    % TODO: Replace s(0) by 1
factorial(M,F) :-     % TODO: Make sure that M > 0
    M = s(N),         % TODO: Compute N from M using is/2 (note that N is unbound! clear the equation)
    factorial(N,F1),
    times(M,F1,F).    % TODO: Replace times/3 by a call to is/2 (using *)
% When you are done, press the triangle (\"Run tests\") or the arrow (\"Load into playground\").
%! \\end{hint}

%! \\begin{solution}
factorial(0,1). 
factorial(N,F) :-
    N > 0,
    N1 is N-1,
    factorial(N1,F1),
    F is F1*N.
%! \\end{solution}
```
~~~

As shown above, tests can be included, hints and solutions provided,
etc. 

It is also possible to specify that only some parts of the code be
shown by placing those parts between begin focus and end focus
directives. For example:

~~~
```ciao_runnable
:- module(_, _, [assertions,sr/bfall]).
%! \\begin{focus}
factorial(0,s(0)).
factorial(s(N),F) :-
    factorial(N,F1),
    times(s(N),F1,F).
%! \\end{focus}

nat_num(0).
nat_num(s(X)) :- nat_num(X).

times(0,Y,0) :- nat_num(Y).
times(s(X),Y,Z) :- plus(W,Y,Z), times(X,Y,W).

plus(0,Y,Y) :- nat_num(Y).
plus(s(X),Y,s(Z)) :- plus(X,Y,Z).
```
~~~

results in:

```ciao_runnable
:- module(_, _, [assertions,sr/bfall]).
%! \\begin{focus}
factorial(0,s(0)).
factorial(s(N),F) :-
    factorial(N,F1),
    times(s(N),F1,F).
%! \\end{focus}

nat_num(0).
nat_num(s(X)) :- nat_num(X).

times(0,Y,0) :- nat_num(Y).
times(s(X),Y,Z) :- plus(W,Y,Z), times(X,Y,W).

plus(0,Y,Y) :- nat_num(Y).
plus(s(X),Y,s(Z)) :- plus(X,Y,Z).
```

Programs can be modules or 'user' (i.e., non-modular) code. The focus
facility can be used as shown above to select whether boilerplate
lines (such as, e.g., module declarations, imports, auxiliary code,
etc.) are shown in the output or not.

Finally, runnable and editable queries can also be easily defined as
follows:

~~~
```ciao_runnable
?- factorial(X,s(s(s(s(s(s(0))))))).
```
~~~

resulting in: 

```ciao_runnable 
?- factorial(X,s(s(s(s(s(s(0))))))).
``` 

There is essentially one Ciao Prolog top level per page; all programs
in the page are loaded into this Ciao Prolog top level and all queries
in the page are executed in that top level, against all the code
(possibly separate modules) that has been loaded into the top level at
that point.

@subsection{Full page example}

The following pointers provide a complete example of a class exercise
that uses embedded code, showing the full source and the full output:

@begin{itemize}
@item This is the [source of the page (written in this case in markdown)](/ciao/build/doc/ciao_playground.html/factorial_peano_iso_source.html)
@item and this is the [result produced by LPdoc](/ciao/build/doc/ciao_playground.html/factorial_peano_iso.html).
@end{itemize}

@section{Adding runnable examples to arbitrary documents} 

Links to the playground that auto-upload examples can be easily
included in any document (slides, manual, book, web site, tutorial,
article, spreadsheet, etc.) provided the tool used for editing allows
including links to URLs. This includes Google Docs, Jupyter notebooks,
Word, Powerpoint, LaTeX, Pages, Keynote, HTML, Org mode, web site
generators, etc., etc.

The URL to be included in the link can easily be obtained as follows:

@begin{note} 
@begin{enumerate} 
@item Paste or upload the example program into the @bf{playground editor}.
@item Click the @key{Share!} button. This will @bf{copy into the clipboard}
a link to an instance of the playground with the program included.
@item Go to the document with the example and @bf{insert the link} in the
document as a URL.
@end{enumerate}
@end{note}

The examples are stored in the documents themselves (URI-encoded) and
do not need to be uploaded to (or edited in) any server.

@begin{alert} @bf{Caveats:} Be aware that large code snippets may
exceed the default maximum sizes for URI length (e.g., configure a
larger size like @tt{LimitRequestLine 100000} in @tt{httpd.conf}). For
arbitrary size links you can also embed the GitHub link to the full
source code @tt{https://ciao-lang.org/playground/#GITHUBURL}, e.g.,
@href{https://ciao-lang.org/playground/#https://github.com/ciao-lang/ciao/blob/master/core/examples/general/tak.pl}{this link}.
@end{alert}

Now, if one clicks on this link, the playground will be opened with
the example program loaded.

For example,
@href{https://ciao-lang.org/playground/?code=%25%20Try%3A%20%20%3F-%20is_in_list(X%2C%5B1%2C2%2C3%5D).%0A%0Ais_in_list(X%2C%5BX%7C_%5D).%0Ais_in_list(X%2C%5B_%7CT%5D)%20%3A-%0A%20%20%20%20%20%20is_in_list(X%2CT).}{this link}
(@em{obtained as described above}) opens the playground and loads into its
editor the following program:

@begin{verbatim}
% Try:  ?- is_in_list(X,[1,2,3]).

is_in_list(X,[X|_]).
is_in_list(X,[_|T]) :-
      is_in_list(X,T).
@end{verbatim}

We show below some examples of this embedding for different source formats.

@subsection{LaTeX}

This is a simple example in LaTeX:

@includecode{append_latex_simple.tex}

and this [the pdf output generated](/playground/examples/append_latex_simple.pdf).

These are a few more examples in LaTeX:

@includecode{append_latex_nicer.tex}

and this [the pdf output generated](/playground/examples/append_latex_nicer.pdf).

@subsection{Word}

And this is a simple example in Word (note: image below not clickable):

@image{append_word_simple_cropped}

This is the [word file](/playground/examples/append_word_simple.docx), here [exported to pdf](/playground/examples/append_word_simple_cropped.pdf).

@subsection{Org}

Another example, in Emacs Org mode:

@includecode{append_org_simple.org}

And this is the result [exported to pdf](/playground/examples/append_org_simple.pdf).

").
