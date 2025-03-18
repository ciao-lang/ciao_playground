:- use_package([assertions]).

:- doc(filetype, documentation).

:- doc(title, "Using the Ciao Prolog Playground").

:- doc(module,"

@cindex{playground, using}
@cindex{playground, key bindings}

The [Ciao Prolog Playground](/playground) includes a number of areas,
most of which are editable (note that the arrangement of the areas is
configurable):

@begin{itemize}

@item The @bf{editor area} @cindex{editor area}
  (left area, or top if the window is narrow)
  is an editor for the @bf{program} or @bf{notebook-style document}. Users can
  add their code into this editor and modify it there. Programs can be
  loaded into the system's top level (see below), where they can be
  run by entering queries at the prompt. Documents are processed in
  the top level and rendered in the preview area (see below). If the
  document contains runnable examples these can be executed there.

@item The @bf{top-level area} @cindex{top-level area} (on the right,
  or bottom if the window is narrow) is where most communication with
  the system takes place. The top-level first shows @tt{Loading
  Ciao...}  while the system is loading its dependencies.  When the
  top-level is completely ready to use, it will show the prompt @tt{?-
  }. Now programs can be loaded and queries issued. This area is also
  an editor that allows, e.g., editing the query, recalling previous
  queries, etc.

@item The @bf{preview area} @cindex{preview area}
  is where documents or program
  documentation is rendered. This preview area (and other areas) can
  be also used for other graphical program output.

@end{itemize}

@section{Buttons}

@begin{description}

@item{@key{Area selector}} Allows selecting which areas are visible.

@item{@key{New}} Erases all previous content from the editor. It
 allows selecting whether the new content of the editor will be a
 program (@tt{.pl}) or a document (@tt{.md}).

@item{@key{File}} allows the following: 

   @begin{description}

   @item{@key{Open}} Lets you upload your own Prolog code (@tt{.pl}
   file) or document (@tt{.md} or @tt{.lpdoc} file) from your local
   file system. This action also erases all previous content present
   in the editor. The playground will switch to program mode or
   document mode depending on the type of file uploaded.

   @item{@key{Save} (@key{Ctrl}-@key{x} + @key{Ctrl}-@key{s})} Allows
        downloading the code or document written in the playground
        directly to your file system.  @cindex{saving}

   @end{description}

@item{@key{Examples}} Allows loading a number of examples of programs
  and active logic documents to get started.  @cindex{examples}

@item{@key{Load} (@key{Ctrl}-@key{c} + @key{l})} Processes the content
  of the editor area: 
  @cindex{loading programs}
  @cindex{rendering documents}

  @begin{itemize}

  @item If the editor contains a program, it loads the code into the
    top-level. It compiles it and, in case there are any errors, they
  are printed in top-level area and highlighted in the . Once you click this button, you can ask queries about 
  your code in the top-level.

  @item If the editor contains a document source, it processes it in
  the top level and renders it in the preview area. If the document
  contains runnable examples these can be executed there.

  @end{itemize}

@item{@key{⇱⇲}} (Toggle presentation mode)
  Switches to a full window view of
  the document or any other content of the preview area. In this view:
  @cindex{presentation mode}
  @cindex{full-screen mode}
  @cindex{slides}
  @cindex{slides presenation mode}

  @begin{itemize}
  @item The pencil @key{✎} icon allows returning to the editor mode.

  @item The rectangular @key{▭} icon switches to @em{slides
  presentation mode}, where each document section is presented as a
  separate slide.

  @item To exit slides presentation mode use the @key{ESC} key.
  @end{itemize}


@item{@key{🔎} (Debug, @key{Ctrl}-@key{c} + @key{d})} Debug (or stop
  debugging) source and enable tracing the control flow of the program
  for the next queries (see debugger documentation for more
  information).  @cindex{program debugging}

@item{@key{📖} (Preview documentation, @key{Ctrl}-@key{c} + @key{D})}
  In code mode, generate and preview the documentation (using LPdoc)
  for the code in the editor area. @cindex{documenting programs}

@item{@key{↻} (Toggle on-the-fly)} If turned on, the program is loaded or
 the document rendered continuously. This allows showing program errors
 on the code as it is being modified, or seeing interactively the
 results of editing the document source.

@item{@key{Share!}} Is an alternative form of save, very useful for
  sharing!: it copies into the clipboard a link that will open the
  playground with the current state of the program loaded in the
  editor area. In the case of documents this link will open directly
  the rendered document, and it can also be edited. These links can be
  sent by email, embedded in other documents, etc. (see
  [Adding links to runnable examples and notebooks to arbitrary
  documents](/ciao/build/doc/ciao_playground.html/ciao_playground_embedding.html)).
  @cindex{sharing programs}
  @cindex{sharing documents}

@comment{ % begin comment
@begin{alert} 
Currently all tests are required to set the default timeout to 0 by
adding a @tt{timeout(0)} global property, e.g.:

@begin{verbatim}
:- test is(X,2+3) => (X=5) + timeout(0).
@end{verbatim}

(We are currently working on a solution for this issue.)
@end{alert}
% end comment }

@item{@key{Abort query}} This button will appear below the top-level
  when running a query that is taking too long. It terminates the
  query currently running.
  @cindex{aborting}


  @begin{alert} 
  This button fully terminates the Ciao worker executing the Ciao
  process, so it may take a some time to reload dependencies after
  aborting. The code in the editor area will be reloaded into the
  top-level.
  @end{alert}

@end{description}

@section{Additionally}

In addition, in the @key{More...} pull-down the following can be
selected:

@begin{description}

@item{@key{Run tests} (@key{Ctrl}-@key{c} + @key{u})} Loads the unit test library
  (@lib{unittest}) into the top-level and runs any unit tests (test
  assertions) that may appear in the code.  @cindex{running tests}

@item{@key{Analyze and check assertions} (@key{Ctrl}-@key{c} + @key{V})} Analyze
  the program and perform compile-time checking of the assertions
  (types, modes, determinacy, ...) in the current module (using
  CiaoPP).
  @cindex{checking assertions}
  @cindex{program verification}

@item{@key{Analyze and check assertions (w/output)}} Same as above, but
 also show in a separate area the results of analysis, i.e., the
 program annotated with the analysis results.

@item{@key{Specialize code} (@key{Ctrl}-@key{c} + @key{O})} Run the CiaoPP
 specializer on the code in the editor area.

@item{@key{Browse analysis/checking/optimizing options}} Open the
 CiaoPP graphical menu to select different options for analysis,
 assertion checking, and optimization.

@end{description}

@section{Key bindings}

The playground supports a number of key bindings (including some of the
most used in @apl{Emacs}). They are listed below, classified by
functionality.

@subsection{Editing key bindings}

These commands are useful to edit and move around the editor areas:

@begin{itemize}

@item @key{Ctrl}-@key{a} - move cursor to the beginning of the line.
@item @key{Ctrl}-@key{e} - move cursor the end of the line.
@item @key{Ctrl}-@key{f} - move cursor forward.
@item @key{Ctrl}-@key{b} - move cursor backward.
@item @key{Ctrl}-@key{p} - previous line.
@item @key{Ctrl}-@key{n} - next line.
@item @key{Ctrl}-@key{s} - search forward in the editor.
@item @key{Ctrl}-@key{r} - search backward in the editor.
@item @key{Ctrl}-@key{d} - delete character to the right.
@item @key{Ctrl}-@key{h} - delete character to the left.
@item @key{Ctrl}-@key{k} - kill the line after the cursor.
@item @key{Ctrl}-@key{m} - insert line below.
@item @key{Ctrl}-@key{o} - insert line after the current position.
@item @key{Ctrl}-@key{z} - undo.
@item @key{Ctrl}-@key{g} - go to line.
@item @key{Ctrl}-@key{x} + @key{u} - undo.
@item @key{Ctrl}-@key{X} + @key{o} - move to another playground area.
@item @key{Ctrl}-@key{v} - go to the end of the editor.
@item @key{Ctrl}-@key{x} + @key{Ctrl}-@key{p} - select all.
@item @key{Ctrl}-@key{x} + @key{Ctrl}-@key{u} - transform selected
text to upper case.
@item @key{Ctrl}-@key{x} + @key{Ctrl}-@key{l} -  transform selected
text to lower case.
@item @key{Esc} + @key{d} - delete the next word.
@item @key{Esc} + @key{v} - move cursor to the beginning.
@item @key{Esc} + @key{Backspace} - delete word to the left.
@item @key{Esc} + @key{;} - comment/uncomment current line or selected lines.

@end{itemize}

@subsection{Code processing key bindings}

These commands perform Ciao or filesystem-related actions: 

@begin{itemize}

@item @key{Ctrl}-@key{x} + @key{Ctrl}-@key{s} - save file (same as button).
@item @key{Ctrl}-@key{c} + @key{l} - load code into top-level (same as button).

@end{itemize}

These commands perform actions on the source code: 

@begin{itemize}

@item @key{Ctrl}-@key{c} + @key{d} - (un)debug source code (same as button). 
@item @key{Ctrl}-@key{c} + @key{D} - preview documentation (same as button).
@item @key{Ctrl}-@key{c} + @key{u} - run any tests in the source code (same as button).
@item @key{Ctrl}-@key{c} + @key{V} - analyze and check assertions in source code (same as button).
@item @key{Ctrl}-@key{c} + @key{O} - run specializer on source code.

@end{itemize}


@section{Specific key bindings for the top-level}

The top-level area includes some key bindings of its own:

@begin{itemize}
@item @tt{Up arrow} - previous query in history.
@item @tt{Down arrow} - next query in history.
@item @key{Ctrl}-@key{p} - previous query in history.
@item @key{Ctrl}-@key{n} - next query in history.
@item @key{Ctrl}-@key{c} - abort current query, if there is any
running.
@end{itemize}

@begin{alert} 

@key{Ctrl}-@key{c} fully terminates the Ciao worker executing the Ciao
process in the browser, so it may take some time to reload
dependencies after aborting. The code present in the left (or top)
window will be reloaded to the top-level.

@end{alert}

@section{Current playground limitations}

Please be aware of some current limitations of the playground with
respect to a full, native installation of the Ciao system:

@begin{itemize}

@item Binaries and libraries are downloaded into your browser and code
  is executed locally. This has the advantage that no connection is
  required other than this initiad download, no server is necessary,
  no information about your code is uploadede/gathered, etc. However,
  to reduce download times, only a subset of the libraries are loaded
  by default.

@item Currently this platform is limited to 32-bit binaries, runs
  around 2-3x slower than native binaries, and only offers partial
  POSIX features. Some Prolog libraries that depend on 3rd-party
  binaries (via the foreign interface) may not be currently available.

@item The top level currently has some limitations regarding the
  loading of packages, portraying answers, and others. We are actively
  working on all of these and will be adding this functionality
  shortly.

@item Reading input from standard input (@tt{read/1}) is currently not
  directly supported, due to WebAssembly limitations. We plan also to
  fix this soon.

@item Only a subset of analyses (abstract domains) and capabilities of
  CiaoPP are available for program verification (assertion checking,
  etc.) and optimization.

@end{itemize}

Please @bf{ask us} if some useful library or feature is missing; if
technically possible, we will add it. However, for intensive use we
recommend [installing Ciao Prolog natively](/install.html), for
improved performance and full features.

").

/* 
% TODO: experimental, document and extend (ciaowasm) foreign_js

@section{Prolog to JavaScript interface}

@cindex{playground, javascript output}

Taking advantage of the web environment and its capabilities, users
can run JavaScript code from their Ciao Prolog code and interact with
the browser. For example, they can employ the browser's
@tt{alert} feature with a predicate like this one:

@begin{verbatim}
:- export(alert/1).
alert(Str) :- js_call(alert(string(Str))).
js_def(alert("x"), [], "alert(x);").
@end{verbatim}

Other functionalities include accessing the HTML to create a new
@tt{div}, adding images and videos, or printing tables and other
figures.

@section{Outputting html from programs}

@cindex{playground, html output}

Html code that is generated by programs (using, e.g., the PiLLoW
library) can be easily rendered in the top level area ...

*/
