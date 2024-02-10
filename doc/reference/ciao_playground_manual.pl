:- use_package([assertions]).

:- doc(filetype, documentation).

:- doc(title, "The Ciao Prolog Playground").
:- doc(author, "Jose F. Morales").
:- doc(author, "Guillermo Garc@'{i}a Pradales (playground interface)").
:- doc(author, "Manuel Hermenegildo").
:- doc(author, "The Ciao Development Team").

:- doc(module,"

The [Ciao Prolog Playground](/playground) offers several main
functionalities:

@begin{itemize}

@item A [very easy way to run and share Prolog
  code](/ciao/build/doc/ciao_playground.html/ciao_playground_using.html),
  directly from any modern browser.

  The main advantage over other ways of using Ciao is that the
  playground does not require any installation or interaction with a
  server @comment{(beyond the an automatic initial download),} since
  @em{everything runs within the browser}. 

@item An [easy way to embed runnable code
  examples](/ciao/build/doc/ciao_playground.html/ciao_playground_embedding.html)
  in tutorials, manuals, slides, exercises, etc., and in general any
  kind of document.

  These documents can be developed with many tools, such as Google
  Docs, Jupyter notebooks, Word, Powerpoint, LaTeX, Pages, Keynote,
  web site generators, etc., etc. 

  The examples are stored in the documents themselves and do not need
  to be uploaded to (or edited in) any server.

  Here is an [example of an exercise generated with the LPdoc
  tool](/ciao/build/doc/ciao_playground.html/factorial_peano_iso.html).

@item An [easy way to create interactive verification
  tutorials](/ciao/build/doc/ciao_playground.html/exfilter_documents.html)
  for CiaoPP.

@item An easy way to create and distribute applications.

  The Playground can be specialized to create standalone web-based
  applications, with editor and top level, which also do not need
  installation, running fully within the user's browser. An example is
  the [s(CASP) playground](/playground/scasp.html).

@end{itemize}

@comment{ Mention examples, e.g., s(CASP), add a tutorial. }

The Ciao Playground is based on a web-based editor component and the
@tt{wasm} build grade of Ciao (using WebAssembly and compiled with
Emscripten).

@comment{ % Working on improving this: 

The playground assumes some familiarity with Prolog.  Links are
provided to the various Prolog learning resources, examples,

listed in the
Ciao web site.

provides access to some pointers to Prolog tutorials and examples,
However, it

Familiarity with the Ciao Prolog system can also be useful to access
advanced features. Please see the
@href{http://ciao-lang.org/ciao/build/doc/ciao.html/}{Ciao manual} and
the @href{http://ciao-lang.org}{Ciao Prolog site}.

% End comment } 

@include{../../CHANGELOG.md}
").
