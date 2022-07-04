/**
 * @file Toplevel language configuration for Monaco Editor
 * @author Guillermo García
 */

// language configuration
const toplevel_conf = {
  comments: {},
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
const toplevel_lang = {
  brackets: [
    { open: '(', close: ')', token: 'delimiter.parenthesis' },
    { open: '{', close: '}', token: 'delimiter.curly' },
    { open: '[', close: ']', token: 'delimiter.square' }
  ],

  keywords: [
    "?-"
  ],

  operators: [
    "Ciao", "yes", "no",
  ],

  builtins: [],

  symbols: /[=><!~?:&|+\-*\/\^%>]+/,

  // the main tokenizer
  tokenizer: {
    root: [
      // identifiers and keywords
      // [/[a-z_][\w\-\.']*/, {
      //     cases: {
      //         '@builtins': 'predefined.identifier',
      //         '@keywords': 'keyword',
      //         '@default': 'identifier'
      //     }
      // }],
      [/Ciao [a-zA-Z 0-9:.+\(\)]+/, 'toplevel-head'],
      [/{Loading Ciao...}/, 'toplevel-head'], // before number.identifier
      [/^\?\- /m, 'toplevel-prompt'],
      [/^yes/m, 'toplevel-yes'],
      [/^no/m, 'toplevel-no'],
      [/^PASSED: [a-zA-Z 0-9:.+\(\)\-=_/"',{}|\\]+/m, 'toplevel-yes'],
      [/^FAILED: [a-zA-Z 0-9:.+\(\)\-=_/"',{}|\\]+/m, 'toplevel-no'],
      [/^ABORTED: [a-zA-Z 0-9:.+\(\)\-=_/"',{}|\\]+/m, 'toplevel-no'],
      [/^ERROR: [a-zA-Z 0-9:.+\(\)\-=_/"',{}|\\]+/m, 'toplevel-no'],
      [/^{ERROR: [a-zA-Z 0-9:.+\(\)\-=_/"',|\\{}\[\]$]*}/m, 'toplevel-no'],
      [/^SYNTAX ERROR: [a-zA-Z 0-9:.+\(\)\-/"]+/m, 'toplevel-no'],
      [/^\*\* here \*\*/m, 'toplevel-no'],
      [/^aborted/m, 'toplevel-no'],
      [/^WARNING: [a-zA-Z 0-9:.+\(\)\-=_/"',{}\\|\[\]]+/m, 'toplevel-warning'],
      [/^NOTE: [a-zA-Z 0-9:.+\(\)\-=_/"',{}|\\]+/m, 'toplevel-note'],
      [/^Note: [a-zA-Z 0-9:.+\(\)\-=_/"',{}|\\]+/m, 'toplevel-note'],
      [/^{[a-zA-Z 0-9:.+\(\)\-=_/"',|\\{}\[\]]*/m, 'toplevel-note'],
      [/^}/m, 'toplevel-note'],

      // whitespace
      { include: '@whitespace' },

      // delimeters and operators
      [/[{}()\[\]]/, '@brackets'],
      /* [/@symbols/, {
          cases: {
              '@operators': 'predefined.operator',
              '@default': 'operator'
          }
      }], */
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
    ],
  },
};

// add new custom language (ciao prolog)
monaco.languages.register({ id: 'toplevel' });
monaco.languages.setLanguageConfiguration('toplevel', toplevel_conf);
monaco.languages.setMonarchTokensProvider('toplevel', toplevel_lang);
