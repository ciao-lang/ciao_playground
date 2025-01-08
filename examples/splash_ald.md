\title A simple Active Logic Document

This is a sample *active logic document*: a notebook containing
@em{embedded runnable Prolog code examples}, that can be edited,
queried, etc.

In it you can use:

- **Markdown** (LPdoc flavor)
- or @bf{LPdoc commands}. 

Most importantly, you can include **runnable examples**:

```ciao_runnable
:- module(_,_).

app([],X,X).
app([X|L1],L2,[X|L3]) :-
     app(L1,L2,L3).
```

You can edit the example code and click on the ? sign to load it.
Then you can then **query** the examples:

```ciao_runnable
  ?- app([1,2],[3,4],L).
```

```ciao_runnable
?- app(A,B,[1,2,3,4]).
```

Some things to try **in the document**:

  - Edit the example above.
  - (Re)load it by clicking on the `?`.
  - Run queries in the query box. 
  - Open the example in the playground with the `↗` arrow.
  - If in presentation (fullscreen) mode, go/return to the editor by 
    clicking on the pencil icon in the top right.

Some things to try in the **editor/playground**:

  - Edit the markdown source and hit the `Load ⏵` button. 
  - Use the `Share!` button to generate a URL for the document that you can send, publish, etc.
  - `Save` the document source to rour computer and `Open` it at any other time.
  - Select `More...`, `Toggle on-the-fly` to see the document change as the markdown is changed.
  - Select `More...`, `Toggle presentation mode` to see just the document. 
    You can go back to the editor clicking on the pencil in the top right. 

You can save the document source with the 'Save'
button and upload it at any other time.

You can also click on the 'Share!' button to obtain a URL
that contains the document and which you can paste in other
documents, send by email, etc. (see the
[**manual**](/ciao/build/doc/ciao_playground.html/ciao_playground_embedding.html)).

Check out the [**markdown
syntax**](/ciao/build/doc/lpdoc.html/Markdown.html) and the
[**commands for including editable and runnable
examples**](/ciao/build/doc/lpdoc.html/Runnables.html)!
