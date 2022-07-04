:- use_package([assertions]).

:- doc(filetype, documentation).

:- doc(title, "Using the Ciao Prolog Playground").

:- doc(module,"

@cindex{playground, using}
@cindex{playground, key bindings}

The [Ciao Prolog Playground](/playground) includes two main areas,
which are both editable (note that the arrangement of the areas is
configurable):

@begin{itemize}
@item The left area (or top area, if the window is narrow) is an
editor for the program. Users can add their code into this editor and
modify it there. The program can then be loaded into the system's top
level, in the right area, where it can be run by entering queries at
the prompt.

@item The right area (or bottom area, if the window is narrow) hosts
the top-level, where most communication with the system takes
place. The top-level first shows @tt{Loading Ciao...}  while the
system is loading its dependencies.  When the top-level is completely
ready to use, it will show the prompt @tt{?- }. Now programs can be
loaded and queries issued.

@end{itemize}

There is also a preview area for graphical program output. 

@section{Buttons}

@begin{description}

@item{@key{New}} Erases all previous content from the editor.

@item{@key{Open}} Lets you upload your own Prolog code from your local
filesytem. This action also erases all previous content present in the
editor.

@item{@key{Save}} Allows downloading the code written in the playground
directly to your filesystem.

@item{@key{Load}} Loads the code in the editor into the top-level. It
compiles it and, in case there are any errors, they are printed in the
right (bottom) editor and highlighted in the left (top) one. Once you
click this button, you can ask queries about your code in the
top-level.

@item{@key{Run tests}} Loads the unit test library (@lib{unittest})
into the top-level and runs any unit tests (test assertions) that may
appear in the code.

@item{@key{Share!}} Is an alternative form of save: it copies into the
clipboard a link that allows opening the playground with the current
state of the program loaded in the editor area.

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
when running a query that is taking too long. It terminates the query
currently running.

@begin{alert} 

This button fully terminates the Ciao worker executing the Ciao
process, so it may take a some time to reload dependencies after
aborting. The code in the editor area will be reloaded into the
top-level.

@end{alert}

@end{description}

@section{Key bindings}

The playground supports a number of key bindings (including some of the
most used in @apl{Emacs}). They are listed below, classified by
functionality.

@subsection{Editing key bindings}

These commands are useful to edit and move around the editor areas:

@begin{itemize}

@item @key{Ctrl}-@key{A} - move cursor to the beginning of the line.
@item @key{Ctrl}-@key{E} - move cursor the end of the line.
@item @key{Ctrl}-@key{F} - move cursor forward.
@item @key{Ctrl}-@key{B} - move cursor backward.
@item @key{Ctrl}-@key{P} - previous line.
@item @key{Ctrl}-@key{N} - next line.
@item @key{Ctrl}-@key{S} - search forward in the editor.
@item @key{Ctrl}-@key{R} - search backward in the editor.
@item @key{Ctrl}-@key{D} - delete character to the right.
@item @key{Ctrl}-@key{H} - delete character to the left.
@item @key{Ctrl}-@key{K} - kill the line after the cursor.
@item @key{Ctrl}-@key{M} - insert line below.
@item @key{Ctrl}-@key{O} - insert line after the current position.
@item @key{Ctrl}-@key{Z} - undo.
@item @key{Ctrl}-@key{G} - go to line.
@item @key{Ctrl}-@key{X} + @key{U} - undo.
@item @key{Ctrl}-@key{X} + @key{O} - select the other editor.
@item @key{Ctrl}-@key{V} - go to the end of the editor.
@item @key{Ctrl}-@key{X} + @key{Ctrl}-@key{P} - select all.
@item @key{Ctrl}-@key{X} + @key{Ctrl}-@key{U} - transform selected
text to upper case.
@item @key{Ctrl}-@key{X} + @key{Ctrl}-@key{L} -  transform selected
text to lower case.
@item @key{Esc} + @key{D} - delete the next word.
@item @key{Esc} + @key{V} - move cursor to the beginning.
@item @key{Esc} + @key{Backspace} - delete left word.
@item @key{Esc} + @key{;} - comment/uncomment current line.

@end{itemize}

@subsection{Loading key bindings}

These commands perform Ciao or filesystem-related actions: 

@begin{itemize}

@item @key{Ctrl}-@key{X} + @key{Ctrl}-@key{S} - save file (same as button).
@item @key{Ctrl}-@key{C} + @key{L} - load code into top-level (same as button).
@item @key{Ctrl}-@key{C} + @key{U} - run tests in current module (same as button).

@end{itemize}

@section{Specific key bindings for the top-level}

The top-level area includes some key bindings of its own:

@begin{itemize}
@item @tt{Up arrow} - previous query in history.
@item @tt{Down arrow} - next query in history.
@item @key{Ctrl}-@key{P} - previous query in history.
@item @key{Ctrl}-@key{N} - next query in history.
@item @key{Ctrl}-@key{C} - abort current query, if there is any
running.
@end{itemize}

@begin{alert} 

@key{Ctrl}-@key{C} fully terminates the Ciao worker executing the Ciao
process in the browser, so it may take some time to reload
dependencies after aborting. The code present in the left (or top)
window will be reloaded to the top-level.

@end{alert}

@section{Current playground limitations}

Please be aware of some current limitations of the playground with
respect to a full, native installation:

@begin{itemize}

@item Binaries and libraries are downloaded into your browser and code
  is executed locally (no connection required once loaded, no
  information about your code is gathered). To reduce download times,
  only some essential libraries are loaded by default.

@item Currently this platform is limited to 32-bit binaries, runs
  around 2-3x slower than native binaries, and only offers partial
  POSIX features. Some Prolog libraries that depend on 3rd-party
  binaries (via the foreign interface) may not be currently available.

@item The top level currently has some limitations regarding the
  loading of packages, debugging, portraying answers, and others. We
  are actively working on all of these and will be adding this
  functionality shortly.

@item Reading input from standard input (@tt{read/1}) is currently not
  directly supported, due to WebAssembly limitations. We plan also to
  fix this soon.

@end{itemize}

Please @bf{ask us} if some useful library or feature is missing; if
technically possible, we will add it. However, for intensive use we
recommend [installing Ciao Prolog natively](/install.html), for
improved performance and full features.

").

/* 
% TODO: experimental, document when it is ready

@section{Prolog to JavaScript interface}

@cindex{playground, javascript output}

Taking advantage of the web environment and its capabilities, users
can run JavaScript code from their Ciao Prolog code and interact with
the browser. In order to access these functionities, the predicates
need to print to the standard output the prompt @tt{$$$js_eval$$$:} +
@tt{JavaScript code}. For example, they can employ the browser's
@tt{alert} feature with a predicate like this one:

@begin{verbatim}
alert(X) :- 
   display('$$$js_eval$$$:alert(\"'), 
   display(X), 
   display('\")\\n').
@end{verbatim}

Other functionalities include accessing the HTML to create a new
@tt{div}, adding images and videos, or printing tables and other
figures.


@section{Outputting html from programs}

@cindex{playground, html output}

Html code that is generated by programs (using, e.g., the PiLLoW
library) can be easily rendered in the top level area ...

*/
