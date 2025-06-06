:- module(_, [], [ciaobld(bundlehooks)]).

:- use_module(ciaobld(third_party_custom)).

% (hook)
'$builder_hook'(custom_run(fetch_externals, [])) :- !,
    third_party_custom_install(ciao_playground).

m_bundle_foreign_dep(ciao_playground, cmd, 'node', 'Node (http://nodejs.org)').
m_bundle_foreign_dep(ciao_playground, cmd, 'npm', 'NPM (http://www.npmjs.com)').
m_bundle_foreign_dep(ciao_playground, npm, 'monaco-editor@0.38', 'https://microsoft.github.io/monaco-editor/index.html').
% (optional extension)
m_bundle_foreign_dep(ciao_playground, npm, 'mathjax@3', 'https://www.mathjax.org').

% ---------------------------------------------------------------------------
% Prepare site/ for distribution (or file serving)

:- use_module(ciaobld(site_aux)).

% (hook)
'$builder_hook'(custom_run(dist, [])) :- !,
    site_build.

site_build :-
    % TODO: explain: this is similar to linking an executable!
    %   (it puts all resources together)
    site_copy_files,
    site_link_builddoc, % TODO: also done in ciao-serve, needed?
    site_link_npm_node_modules.

site_copy_files :-
    site_glob_cp(lpdoc, 'etc', '*.css', '/css'), % (for lpdoc.css) % TODO: better way?
    site_glob_cp(lpdoc, 'etc', '*.js', '/js'), % (for lpdoc.js) % TODO: better way?
    site_glob_cp(ciao_playground, 'src', '*.html', '/playground'),
    site_glob_cp(ciao_playground, 'src', '*.js', '/playground/js'),
    site_glob_cp(ciao_playground, 'src/syntax', '*.js', '/playground/js/syntax'),
    site_glob_cp(ciao_playground, 'src/css', '*.css', '/playground/css'),
    site_glob_cp(ciao_playground, 'src/images', '*.png', '/playground/images'),
    site_glob_cp(ciao_playground, 'src/images', '*.svg', '/playground/images'),
    site_glob_cp(core, 'library/menu/etc', '*.js', '/playground/js'), % (for ciao_menu.js)
    site_glob_cp(core, 'library/menu/etc', '*.css', '/playground/css'), % (for ciao_menu.css)
    % (part of the manual)
    site_glob_cp(ciao_playground, 'examples', '*.tex', '/playground/examples'),
    site_glob_cp(ciao_playground, 'examples', '*.sty', '/playground/examples'),
    site_glob_cp(ciao_playground, 'examples', '*.png', '/playground/examples'),
    site_glob_cp(ciao_playground, 'examples', '*.pdf', '/playground/examples'),
    site_glob_cp(ciao_playground, 'examples', '*.docx', '/playground/examples'),
    site_glob_cp(ciao_playground, 'examples', '*.md', '/playground/examples'),
    site_glob_cp(ciao_playground, 'examples', '*.lpdoc', '/playground/examples').

% ---------------------------------------------------------------------------
% (helper for other playgrounds)

:- use_module(library(bundle/bundle_paths), [bundle_path/3]).
:- use_module(engine(internals), ['$bundle_id'/1]).
:- use_module(library(system), [file_exists/1]).
:- use_module(library(streams), [display/1, nl/0]).

% (hook)
% List bundles that have a playground/ directory
'$builder_hook'(custom_run(list_playgrounds, [])) :- !,
    ( % (failure-driven loop)
      '$bundle_id'(Bndl),
        bundle_path(Bndl, 'playground', PG),
        file_exists(PG),
        display(Bndl), nl,
        fail
    ; true
    ).

% (hook)
% Site copy playground/ directory
'$builder_hook'(custom_run(dist_playground, [Bndl])) :- !,
    site_glob_cp(Bndl, 'playground', '*.html', '/playground'),
    site_glob_cp(Bndl, 'playground', '*.js', '/playground/js').

