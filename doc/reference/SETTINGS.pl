:- module(_,[],[doccfg]).

filepath := at_bundle(ciao_playground, 'examples/').

output_name := ciao_playground.
doc_structure := ciao_playground_manual-[
    ciao_playground_using,
    ciao_playground_embedding-[
        % TODO: duplicated in LPdoc; kept here for paper links, fix?
        factorial_peano_iso_source,
        factorial_peano_iso
    ],
    exfilter_documents-[ 
        append_verification_source,
        append_verification
    ]
].

doc_mainopts := /*no_patches|no_biblio|no_math.*/ _ :- fail.

indices := lib|regtype|concept|author|global.

allow_markdown := yes.
syntax_highlight := yes.
allow_runnable := yes.

% (extensions)
load_doc_module := exfilter(exfilter_lpdoc).
