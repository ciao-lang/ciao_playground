:- module(_,[],[doccfg]).

filepath := at_bundle(ciao_playground, 'examples/').

output_name := ciao_playground.
doc_structure :=
    ciao_playground_manual-
    [
          ciao_playground_using
        , ciao_playground_embedding-
        [ 
              factorial_peano_iso_source
            , factorial_peano_iso
        ],
          exfilter_documents-
        [ 
              append_verification_source
            , append_verification
        ]
    ].

allow_markdown := yes.
syntax_highlight := yes.
allow_runnable := yes.

% (extensions)
load_doc_module := exfilter(exfilter_lpdoc).
