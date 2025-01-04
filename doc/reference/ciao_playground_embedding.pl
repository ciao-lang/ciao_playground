:- use_package([assertions]).

:- doc(filetype, documentation).

:- doc(title, "Creating Documents with Editable and Runnable Examples").

:- doc(module,"The [Ciao Prolog Playground](/playground) provides
several easy ways for @em{creating documents with editable and
runnable examples}. This includes:

@begin{itemize}

@item Creating @bf{Active Logic Documents}: notebooks containing
  @em{embedded runnable Prolog code examples}, that can be edited,
  queried, etc.

@item Embedding links to runnable examples in arbitrary documents.

@end{itemize}

@cindex{playground, direct access}
@cindex{playground, runnable examples}
@cindex{runnable examples}

@section{Creating notebooks: Active Logic Documents (ALDs)}

The playground allows easily generating Active Logic Documents (ALDs):
@bf{notebooks} containing @bf{embedded runnable Prolog code examples},
that can be edited, queried, etc.

@begin{note} This is an example of a simple exercise:

@begin{enumerate} @item Click on
@href{/playground/#/playground/examples/factorial_peano_iso.md}{this
  link} to open it.

@item Click on the pencil button on the top right to edit the document
  in the playground.

@item See [the playground usage
  page](/ciao/build/doc/ciao_playground.html/ciao_playground_using.html)
  for other functionality available.

@item In particular, clicking the @key{Share!} button will @bf{copy
  into the clipboard} a link that can be used to open the
  document. This link can be sent by email, embedded in notes, etc.

@end{enumerate}
@end{note}


ALD notebooks are very useful for developing @bf{tutorials, exercises,
slides, manuals, etc.} and in general any kind of document with
runnable Prolog examples. The source for these documents is in (LPdoc)
markdown and they can be easily shared, as shown in the example
above. The documents and the embedded code run locally on the user's
browser, without the need for a server. This provides many advantages
such as @em{scalability to any number of users, privacy, efficiency,}
etc.

This functionality is provided by an integration of @apl{LPdoc} with
the playground. The [**Editable and runnable
examples**](/ciao/build/doc/lpdoc.html/Runnables.html) and
[**Documentation markdown language**](/ciao/build/doc/lpdoc.html/Markdown.html) chapters of the
LPdoc manual provides a description of the markdown syntax and other
commands that can be used in ALDs.

@comment{allowing runnable and editable code blocks
in @apl{LPdoc} generated program documentation.}



@section{Adding runnable examples to arbitrary documents} 

Links to the playground that auto-upload examples can be easily
included in any document (slides, manuals, books, web sites, tutorials,
articles, spreadsheets, class exercises, etc.) provided the tool used for editing allows
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
