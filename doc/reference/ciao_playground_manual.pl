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

@item An [easy way to run and share Prolog
  code](/ciao/build/doc/ciao_playground.html/ciao_playground_using.html),
  directly from any modern browser.

  The main advantage over other ways of using Ciao is that the
  playground does not require any installation or interaction with a
  server @comment{(beyond the an automatic initial download),} since
  @em{everything runs within the browser}. 

@item An [easy way to develop Active Logic
  Documents](/ciao/build/doc/ciao_playground.html/ciao_playground_using.html):
  notebooks containing @em{embedded runnable Prolog code examples},
  that can be edited, queried, etc.

  These are very useful for developing @bf{tutorials, exercises,
  slides, manuals, etc.} and in general any kind of document with
  runnable Prolog examples. The source for these documents is in
  (LPdoc) markdown and they can be easily shared. The documents and
  the embedded code run locally on the user's browser, without the
  need for a server. This provides many advantages such as scalability
  to any number of users, privacy, efficiency, etc.

@comment{
  Here is an [example of a simple
  exercise](/ciao/build/doc/ciao_playground.html/factorial_peano_iso.html).
}

  Here is an
  @href{/playground/#/playground/examples/factorial_peano_iso.md}{example
  of a simple exercise} (click on the pencil button on the top right
  to edit it).

@item An [easy way to embed links to runnable code
  examples](/ciao/build/doc/ciao_playground.html/ciao_playground_embedding.html)
  in tutorials, manuals, slides, exercises, etc., and in general any
  kind of document developed with other tools, such as Google Docs,
  Jupyter notebooks, Word, Powerpoint, LaTeX, Pages, Keynote, web site
  generators, etc., etc. 

  The examples are stored in the documents themselves and do not need
  to be uploaded to (or edited in) any server.

  Here is a [simple example in pdf generated with LaTeX](/playground/examples/append_latex_simple.pdf).

@item An [easy way to create interactive verification
  tutorials](/ciao/build/doc/ciao_playground.html/exfilter_documents.html)
  for CiaoPP.

@item An easy way to create and distribute applications.

  The Playground can be specialized to create standalone web-based
  applications, with editor and top level, which also do not need
  installation, running fully within the user's browser. An example is
  the [s(CASP) playground](/playground/scasp.html).

@end{itemize}

@comment{Add a tutorial on how to create and distribute applications.}

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
