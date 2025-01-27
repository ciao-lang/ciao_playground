/**
 * @file Ciao Prolog configuration for Monaco Editor
 * @author Guillermo García
 */

// language configuration
const conf = {
  comments: {
    "lineComment": "%",
    "blockComment": ["/*", "*/"]
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"]
  ],
  autoClosingPairs: [
    { open: '(', close: ')' },
    { open: '[', close: ']' },
    { open: '{', close: '}' },
    { open: '"', close: '"', notIn: ['string'] }
  ],
  surroundingPairs: [
    { open: '(', close: ')' },
    { open: '[', close: ']' },
    { open: '{', close: '}' },
    { open: '"', close: '"' }
  ]
};

// language definition
const lang = {
  brackets: [
    { open: '(', close: ')', token: 'delimiter.parenthesis' },
    { open: '{', close: '}', token: 'delimiter.curly' },
    { open: '[', close: ']', token: 'delimiter.square' }
  ],

  keywords: [
    /* // eclipse
    "module", "use_module", "begin_module", "module_interface", "dynamic",
    "external", "export", "dbgcomp", "nondbgcomp", "compile", "yes", "no",

    // mercury
    "all", "else", "end_module", "equality", "external", "fail", "func", "if",
    "implementation", "import_module", "include_module", "inst", "instance",
    "interface", "mode", "module", "pragma", "pred", "some", "then", "true",
    "type", "typeclass", "where",

    // sicstus
    "block", "dynamic", "mode", "multifile", "meta_predicate",
    "parallel", "public", "sequential", "volatile",

    // swi 
    "discontiguous", "dynamic", "ensure_loaded", "export_list", "import",
    "meta_predicate", "module", "module_transparent", "require",

    // gnu
    "built_in", "char_conversion", "discontiguous", "dynamic", "ensure_linked",
    "foreign", "include", "initialization", "op", "set_prolog_flag",

    // ciaopp
    "atm", "list", "int", "nonvar", "var", "gnd", "ground", "string", "flt",
    "term", "num", "nnegint", "mshare", "indep", "not_fails", "fails", "non_det",
    "is_det", "calls", "success", "test", "texec", "regtype", "mtype", "mprop",
    "entry", "checked", "true", "false", "trust",

    "use_package", "use_foreign_library", "use_foreign_source", "reexport",
    "on_abort", "use_class", "extends", "implements", "inherit_class",

    "is", "decl", "pred", "comp", "doc", "fun_eval", "fun_return", "lazy",
    "funct", "function", "argnames", "make", "ifelse", */
  ],

  operators: [
    "\\+", "/=", ">", "<", ">=", "=<", "=:=", "=\\=", "=", ":-",
    "+", "-", "*", "/", "**", "//", "mod", "is", "||", "->", "-->", ":="
  ],

  builtins: [
    "new_declaration", "op", "load_compilation_module", "add_sentence_trans", "add_term_trans",
    "add_clause_trans", "add_goal_trans", "set_prolog_flag", "push_prolog_flag", "pop_prolog_flag",
    "compound_resource", "platform_constants", "platform,load_resource_module", "resource", "head_cost",
    "literal_cost", "trust_default", "granularity_resources", "default_cost", "load_test_module",
    "load_test_package", "extra_compiler_opts", "extra_linker_opts"
  ],

  symbols: /[=><~?@&+*\/\^%>\-\\]+/,

  // escapes: /[0-7]{1,3}|[bdefnrstv\\"']|\^[a-zA-Z]|x[0-9a-zA-Z]{2}|x{[0-9a-zA-Z]+}/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  // the main tokenizer
  tokenizer: {
    root: [
      // LPDoc assertions
      [/author,\s*"/, 'lpdoc-cmd', '@string_doc'],
      [/title,\s*"/, 'lpdoc-cmd', '@string_doc'],
      [/section,\s*"/, 'lpdoc-cmd', '@string_doc'],
      [/subsection,\s*"/, 'lpdoc-cmd', '@string_doc'],
      [/subsubsection,\s*"/, 'lpdoc-cmd', '@string_doc'],
      [/summary,\s*"/, 'lpdoc-cmd', '@string_doc'],
      [/module,\s*"/, 'lpdoc-cmd', '@string_doc'],

      [/^\w+([_-]?\w+)*/m, 'pred-name'],
      [/bug/, 'bug-decl'],
      [/!/, 'cut'],
      [/:\-\s*checked/, 'status-checked'],
      [/0'(\\.|.)/, 'char'],
      [/_[A-Z][\w\-\.']*/, 'type'], // variables starting with _
      [/~[a-z][\w\-\.']*/, 'function-app'], // function application (starting with ~)
      [/#!\/usr\/bin\/env ciao-shell/, 'ciao-shell'],

      [/:\-\s*module/, 'mod-decl'],
      [/:\-\s*package/, 'mod-decl'],
      [/:\-\s*class/, 'mod-decl'],
      [/:\-\s*interface/, 'mod-decl'],
      [/:\-\s*mixin/, 'mod-decl'],
      [/:\-\s*use_module/, 'mod-decl'],
      [/:\-\s*ensure_loaded/, 'mod-decl'],
      [/:\-\s*use_package/, 'mod-decl'],
      [/:\-\s*include/, 'mod-decl'],
      [/:\-\s*use_foreign_library/, 'mod-decl'],
      [/:\-\s*use_foreign_source/, 'mod-decl'],
      [/:\-\s*reexport/, 'mod-decl'],
      [/:\-\s*import/, 'mod-decl'],
      [/:\-\s*initialization/, 'mod-decl'],
      [/:\-\s*on_abort/, 'mod-decl'],
      [/:\-\s*use_class/, 'mod-decl'],
      [/:\-\s*extends/, 'mod-decl'],
      [/:\-\s*on_abort/, 'mod-decl'],
      [/:\-\s*implements/, 'mod-decl'],
      [/:\-\s*inherit_class/, 'mod-decl'],

      [/:\-\s*test/, 'keyword'],
      [/:\-\s*texec/, 'keyword'],
      [/:\-\s*pred/, 'keyword'],
      [/\s*pred/, 'keyword'],
      [/:\-\s*check/, 'keyword'],
      [/:\-\s*calls/, 'keyword'],
      [/:\-\s*success/, 'keyword'],
      [/:\-\s*comp/, 'keyword'],
      [/:\-\s*decl/, 'keyword'],
      [/:\-\s*if/, 'keyword'],
      [/:\-\s*else/, 'keyword'],
      [/:\-\s*elif/, 'keyword'],
      [/:\-\s*endif/, 'keyword'],
      [/:\-\s*compilation_fact/, 'keyword'],

      [/:\-\s*export/, 'usr-decl'],
      [/:\-\s*dynamic/, 'usr-decl'],
      [/:\-\s*discontinguous/, 'usr-decl'],
      [/:\-\s*multifile/, 'usr-decl'],
      [/:\-\s*meta_predicate/, 'usr-decl'],
      [/:\-\s*redefining/, 'usr-decl'],
      [/:\-\s*impl_defined/, 'usr-decl'],

      [/:\-\s*new_declaration/, 'builtin-decl'],
      [/:\-\s*op/, 'builtin-decl'],
      [/:\-\s*load_compilation_module/, 'builtin-decl'],
      [/:\-\s*add_sentence_trans/, 'builtin-decl'],
      [/:\-\s*add_term_trans/, 'builtin-decl'],
      [/:\-\s*add_clause_trans/, 'builtin-decl'],
      [/:\-\s*add_goal_trans/, 'builtin-decl'],
      [/:\-\s*set_prolog_flag/, 'builtin-decl'],
      [/:\-\s*push_prolog_flag/, 'builtin-decl'],
      [/:\-\s*pop_prolog_flag/, 'builtin-decl'],
      [/:\-\s*compound_resource/, 'builtin-decl'],
      [/:\-\s*platform_constants/, 'builtin-decl'],
      [/:\-\s*platform/, 'builtin-decl'],
      [/:\-\s*load_resource_module/, 'builtin-decl'],
      [/:\-\s*resource/, 'builtin-decl'],
      [/:\-\s*head_cost/, 'builtin-decl'],
      [/:\-\s*literal_cost/, 'builtin-decl'],
      [/:\-\s*trust_default/, 'builtin-decl'],
      [/:\-\s*granularity_resources/, 'builtin-decl'],
      [/:\-\s*default_cost/, 'builtin-decl'],
      [/:\-\s*load_test_module/, 'builtin-decl'],
      [/:\-\s*load_test_package/, 'builtin-decl'],
      [/:\-\s*extra_compiler_opts/, 'builtin-decl'],
      [/:\-\s*extra_linker_opts/, 'builtin-decl'],

      [/:\-\s*function/, 'library-decl'],
      [/:\-\s*fun_eval/, 'library-decl'],
      [/:\-\s*fun_return/, 'library-decl'],
      [/:\-\s*lazy/, 'library-decl'],
      [/:\-\s*funct/, 'library-decl'],
      [/:\-\s*argnames/, 'library-decl'],
      [/:\-\s*make/, 'library-decl'],

      [/:\-\s*prop/, 'prop-decl'],
      [/:\-\s*regtype/, 'regtype-decl'],
      [/:\-\s*false/, 'status-false'],
      [/:\-\s*true/, 'status-true'],
      [/:\-\s*modedef/, 'status-true'],
      [/:\-\s*trust/, 'status-trust'],
      [/:\-\s*entry/, 'status-entry'],
      [/:\-\s*doc/, 'doc-decl'],
      [/:\-\s*mydirective/, 'doc-decl'],
      [/:\-/, 'operator'], // :-
      [/=:=/, 'operator'], // :=
      [/:=/, 'operator'], // :=
      [/\-\->/, 'operator'], // -->

      // identifiers and keywords
      [/[a-z_][\w\-\.']*/, {
        cases: {
          '@builtins': 'predefined.identifier',
          '@keywords': 'keyword',
          // '@default': 'identifier'
        }
      }],
      [/[A-Z][\w\-\.']*/, 'type.identifier'],
      // [/[:][\w\-\.']*/, 'string.identifier'],
      [/[$?][\w\-\.']*/, 'constructor.identifier'],

      // whitespace
      { include: '@whitespace' },

      // delimeters and operators
      [/[{}()\[\]]/, '@brackets'],
      [/@symbols/, {
        cases: {
          '@operators': 'predefined.operator',
          '@default': 'operator'
        }
      }],

      // numbers
      [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
      [/0[xX][0-9a-fA-F]+/, 'number.hex'],
      [/\d+/, 'number'],

      // delimiter: after number because of .\d floats
      [/[,.]/, 'delimiter'],

      // strings
      // [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
      // [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],

      // strings
      // [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
      // [/'([^'\\]|\\.)*$/, 'string.invalid'], // non-teminated string

      // strings
      [/#\s*"/, 'string-doc', '@string_doc'],
      [/"/, 'string-double', '@string_double'],
      [/'/, 'string-single', '@string_single'],

      // characters
      [/0'(\\n|\\t|.)/, 'string'],
      [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
      // [/'/, 'string.invalid'],

    ],

    comment: [
      [/[^\/*]+/, 'comment'],
      [/\/\*/, 'comment', '@push'],    // nested comment
      ["\\*/", 'comment', '@pop'],
      [/[\/*]/, 'comment']
    ],

    // string: [
    //   [/[^\\"]+/, 'string'],
    //   [/\\./, 'string.escape.invalid'],
    //   [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
    // ],

    string_doc: [
      [/[^\\"]+/, "string-doc"],
      [/@escapes/, "string-doc.escape"],
      // [/(''|\\")/, "string-doc"],
      [/"/, { token: "string-doc", next: "@pop" }],
    ],

    string_double: [
      [/[^\\"]+/, "string-double"],
      [/@escapes/, "string-double.escape"],
      // [/(''|\\")/, "string-double"],
      [/"/, { token: "string-double", next: "@pop" }],
    ],

    string_single: [
      [/[^\\']+/, "string-single"],
      [/@escapes/, "string-single.escape"],
      // [/(''|\\')/, "string-single"],
      [/'/, { token: "string-single", next: "@pop" }],
    ],

    /* string_double: [
      [/[^\\"]+/, 'string'],
      [/@escapes|\s/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string', '@pop']
    ],

    string_single: [
      [/[^\\']+/, 'string-single'],
      [/@escapes/, 'string-single.escape'],
      [/\\./, 'string-single.escape.invalid'],
      [/'/, 'string-single', '@pop']
    ], */

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/\/\*/, 'comment', '@comment'],
      [/%.*$/, 'comment'],
    ],
  },
};

// add new custom language (ciao prolog)
// (add aliases for markdown highlight)
for (let i of ['ciao-prolog', 'ciao', 'ciao_runnable']) {
  monaco.languages.register({ id: i });
  monaco.languages.setLanguageConfiguration(i, conf);
  monaco.languages.setMonarchTokensProvider(i, lang);
}

monaco.editor.defineTheme('ciao-light', {
  base: 'vs', // can also be vs-dark or hc-black
  inherit: true, // can also be false to completely replace the builtin rules
  rules: [
    { token: 'comment', foreground: 'B22222' },
    { token: 'keyword', foreground: '000080', fontStyle: 'bold' },
    { token: 'string-double', foreground: 'BC8F8F' },
    { token: 'string-single', foreground: '666666' },
    { token: 'string-doc', foreground: '000080' },
    { token: 'lpdoc-cmd', foreground: '416AE1' },
    { token: 'char', foreground: 'BC8F8F' },
    { token: 'operator', foreground: 'FF7F50', fontStyle: 'bold' },
    { token: 'cut', foreground: '4169E1' },
    { token: 'identifier', foreground: '0000FF' },
    { token: 'type', foreground: 'A0522D' },
    { token: 'number', foreground: '000000' },
    { token: 'function-app', foreground: '6B8E22' },
    { token: 'mod-decl', foreground: '7D26CC', fontStyle: 'bold' }, // use_module
    { token: 'doc-decl', foreground: '000080' },
    { token: 'bug-decl', foreground: 'FF0000', fontStyle: 'bold' },
    { token: 'prop-decl', foreground: '0000FF', fontStyle: 'bold' },
    { token: 'regtype-decl', foreground: '0000CD', fontStyle: 'bold' },
    { token: 'pred-name', foreground: '0000FF' },
    { token: 'usr-decl', foreground: '416AE1' },
    { token: 'builtin-decl', foreground: '0000FF', fontStyle: 'bold' },
    { token: 'library-decl', foreground: '000080', fontStyle: 'bold' },
    { token: 'status-false', foreground: 'FF0000', fontStyle: 'bold' }, // :- false
    { token: 'status-true', foreground: '228B22', fontStyle: 'bold' }, // :- true
    { token: 'status-trust', foreground: 'FF7F50', fontStyle: 'bold' },
    { token: 'status-entry', foreground: '964B00', fontStyle: 'bold' },
    { token: 'status-checked', foreground: '006400', fontStyle: 'bold' },
    { token: 'ciao-shell', foreground: '238A22' },

    /* toplevel */
    { token: 'toplevel-head', foreground: '114D8A', fontStyle: 'bold' },
    { token: 'toplevel-prompt', foreground: 'FF7F50', fontStyle: 'bold' },
    { token: 'toplevel-yes', foreground: '228B22', fontStyle: 'bold' },
    { token: 'toplevel-no', foreground: 'FF0000', fontStyle: 'bold' },
    { token: 'toplevel-warning', foreground: 'A52A2A', fontStyle: 'bold' },
    { token: 'toplevel-note', foreground: 'A52A2A' },
  ],
  colors: {
    'editorLineNumber.foreground': '#cbc093',
    'editor.background': '#fff8dd', // lpdoc.css: --codeblock-bg: #2E333A;
    'editor.foreground': '#000000'
  }
});

monaco.editor.defineTheme('ciao-dark', {
  base: 'vs-dark', // can also be vs-dark or hc-black
  inherit: true, // can also be false to completely replace the builtin rules
  rules: [
    { token: 'comment', foreground: '6C7B8B' },
    { token: 'keyword', foreground: '1E90FF', fontStyle: 'bold' },
    { token: 'string-double', foreground: 'FFA07A' },
    { token: 'string-single', foreground: 'E5E5E5' },
    { token: 'string-doc', foreground: '94AABF' },
    { token: 'lpdoc-cmd', foreground: '87CEFA' },
    { token: 'char', foreground: 'FFA07A' },
    { token: 'operator', foreground: 'FF7F50', fontStyle: 'bold' },
    { token: 'cut', foreground: '6495ED' },
    { token: 'identifier', foreground: '0000FF' },
    { token: 'type', foreground: 'EEDD82' },
    { token: 'number', foreground: 'FFFFFF' },
    { token: 'function-app', foreground: 'B3EE39' },
    { token: 'mod-decl', foreground: '9F79EE', fontStyle: 'bold' }, // use_module
    { token: 'doc-decl', foreground: '94AABF' },
    { token: 'bug-decl', foreground: 'FF0000', fontStyle: 'bold' },
    { token: 'prop-decl', foreground: '1E90FF', fontStyle: 'bold' },
    { token: 'regtype-decl', foreground: '1E90FF', fontStyle: 'bold' },
    { token: 'pred-name', foreground: '87CEFA' },
    { token: 'usr-decl', foreground: '1E90FF' },
    { token: 'builtin-decl', foreground: '87CEFA', fontStyle: 'bold' },
    { token: 'library-decl', foreground: '1E90FF', fontStyle: 'bold' },
    { token: 'status-false', foreground: 'FF0000', fontStyle: 'bold' }, // :- false
    { token: 'status-true', foreground: '32CD32', fontStyle: 'bold' }, // :- true
    { token: 'status-trust', foreground: 'FF7F50', fontStyle: 'bold' },
    { token: 'status-entry', foreground: 'FF8C69', fontStyle: 'bold' },
    { token: 'status-checked', foreground: '90EE90', fontStyle: 'bold' },
    { token: 'ciao-shell', foreground: '32CD32' },

    /* toplevel */
    { token: 'toplevel-head', foreground: '87CEFA', fontStyle: 'bold' },
    { token: 'toplevel-prompt', foreground: 'FF7F50', fontStyle: 'bold' },
    { token: 'toplevel-yes', foreground: '32CD32', fontStyle: 'bold' },
    { token: 'toplevel-no', foreground: 'FF0000', fontStyle: 'bold' },
    { token: 'toplevel-warning', foreground: 'FF8C69', fontStyle: 'bold' },
    { token: 'toplevel-note', foreground: 'FF8C69' },
  ],
  colors: {
    'editorLineNumber.foreground': '#6C7B8B',
    'editor.background': '#2E333A', // lpdoc.css: --codeblock-bg: #2E333A;
    'editor.foreground': '#FFFFFF'
  }
});
