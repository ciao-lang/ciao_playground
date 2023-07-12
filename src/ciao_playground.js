/**
 * @title The Ciao Prolog playground
 * 
 * This file implements several components for editing Prolog files
 * and executing them interactively using Ciao toplevel processes.
 * The editor component is based on the Monaco editor. The Ciao
 * toplevel makes use of CiaoWasm to run locally in the browser.
 *
 * @author The Ciao Development Team
 */

/* (must be loaded from lpdoc.js) */

/* --------------------------------------------------------------------------- */
/* Playground defaults */

const playgroundCfg_defaults = {
  title: "Prolog playground",
  with_header: true,
  with_github_stars: true,
  has_new_button: true,
  has_open_button: true,
  has_save_button: true,
  //
  has_load_button: true,
  has_toggle_on_the_fly_button: true,
  has_run_tests_button: true,
  has_debug_button: true,
  has_doc_button: true,
  has_acheck_button: true,
  has_spec_button: true,
  //
  has_share_button: true,
  //
  has_layout_button: true,
  has_examples_button: true,
  window_layout: ['E','T'],
  //
  storage_key: 'code', // key for local storage of draft program
  //
  splash_dialog: true,
  splash_code: `\
% Write your Prolog code here, e.g.:

app([],X,X).
app([X|L1],L2,[X|L3]) :-
     app(L1,L2,L3).
`,
  example_list: [
    // TODO: replace by a pedagogical list of smaller Ciao/Prolog/CLP examples; move this collection somewhere else
    { k:'core/examples/general/bignums.pl', n:'bignums.pl' },
//    { k:'core/examples/general/boyer.pl', n:'boyer.pl' },
    { k:'core/examples/general/crypt.pl', n:'crypt.pl' },
    { k:'core/examples/general/derivf.pl', n:'derivf.pl' },
//    { k:'core/examples/general/fib.pl', n:'fib.pl' },
//    { k:'core/examples/general/fft.pl', n:'fft.pl' },
//    { k:'core/examples/general/guardians.pl', n:'guardians.pl' },
//    { k:'core/examples/general/jugs.pl', n:'jugs.pl' },
    { k:'core/examples/general/knights.pl', n:'knights.pl' },
    { k:'core/examples/general/money_clpfd.pl', n:'money_clpfd.pl' },
    { k:'core/examples/general/nqueens.pl', n:'nqueens.pl' },
    { k:'core/examples/general/nqueens_clpfd.pl', n:'nqueens_clpfd.pl' },
//    { k:'core/examples/general/poly.pl', n:'poly.pl' },
//    { k:'core/examples/general/population_query.pl', n:'population_query.pl' },
    { k:'core/examples/general/primes.pl', n:'primes.pl' },
    { k:'core/examples/general/qsort.pl', n:'qsort.pl' },
    { k:'core/examples/general/sudoku_clpfd.pl', n:'sudoku_clpfd.pl' }
//    { k:'core/examples/general/tak.pl', n:'tak.pl' }
  ],
  // Delay for saving when content changes (milliseconds)
  // (do not set too low if files are large)
  autosave_delay: 200,
  // Amend code (add module, etc.)
  amend_on_save: true,
  // Auto-* actions (on start and restart)
  auto_action: 'load',
  // Do auto-* actions on the fly (as document changes)
  on_the_fly: false,
  // Keep worker alive (only when lpdocPG=='runnable' at this moment)
  runnable_keep_alive: true
};

// TODO: make it nicer
// (Config for miniplayground)
var miniPlaygroundCfg = {
  with_header: false,
  has_new_button: false,
  has_open_button: false,
  has_save_button: false,
  has_load_button: false,
  has_toggle_on_the_fly_button: false,
  has_run_tests_button: false,
  has_debug_button: false,
  has_doc_button: false,
  has_acheck_button: false,
  has_spec_button: false,
  has_layout_button: false,
  has_share_button: false,
  on_the_fly: true,
  storage_key: null // (program is never stored)
};

if (typeof playgroundCfg === 'undefined') { var playgroundCfg = {}; }
playgroundCfg = Object.assign({...playgroundCfg_defaults}, playgroundCfg);

/* --------------------------------------------------------------------------- */

// lpdocPG:
//   'raw': do not setup pgset (custom setups)
//   'runnable': setup runnable code blocks in a LPdoc document
//   'playground': setup a playground
if (typeof lpdocPG === 'undefined') {
  console.error('loading ciao_playground.js without lpdocPG');
  var lpdocPG = 'raw';
}
if (typeof urlPREFIX === 'undefined') {
  var urlPREFIX = ''; 
}

// ===========================================================================
// Dynamically load dependencies

// TODO: this one is not very fast but it seems to be robust enough;
//   better ways?

var require = { paths: { vs: urlPREFIX+'/node_modules/monaco-editor/min/vs' } };
(function() {
  //importCSS('/playground/css/ciao_playground.css'); // (better from main html)
  importCSS(urlPREFIX+'/node_modules/monaco-editor/min/vs/editor/editor.main.css');
  // aux for UI
  importScript(urlPREFIX+'/playground/js/split.min.js'); // old split.js
  // monaco
  importScript(urlPREFIX+'/node_modules/monaco-editor/min/vs/loader.js');
  importScript(urlPREFIX+'/node_modules/monaco-editor/min/vs/editor/editor.main.js');
  importScript(urlPREFIX+'/node_modules/monaco-editor/min/vs/editor/editor.main.nls.js');
  // Ciao syntax for monaco
  importScript(urlPREFIX+'/playground/js/syntax/ciao-language.js');
  importScript(urlPREFIX+'/playground/js/syntax/ciao-toplevel-language.js');
  // Ciao engine and interface (ciaowasm)
  importScript(urlPREFIX+'/js/ciao-prolog.js');
})();

// ---------------------------------------------------------------------------
// UI - Modal dialog windows

function modal_elm() {
  return document.getElementById('modal-content');
}

/* (un)set visibility */
function modal_visible(visibility) {
  function set_visible(elm, visible) {
    let d = visible ? 'block' : 'none';
    if (elm.style.display !== d) {
      elm.style.display = d;
    }
  }
  set_visible(document.getElementById('modal-screen'), visibility);
  set_visible(document.getElementById('modal-content'), visibility);
}


function modal_alloc(w) {
  let dp = document.createElement('div');
  dp.id = "modal-screen";
  dp.style.display = "none";
  let dpc = document.createElement('div');
  dpc.id = "modal-content";
  dpc.style.display = "none";
  dp.appendChild(dpc);
  w.appendChild(dp);
}

// ---------------------------------------------------------------------------
// UI - Layouts for playground

var layout_modif_list = [
  { k:'E', n:'Editor' }, // Toggle editor
  { k:'T', n:'Toplevel' }, // Toggle toplevel
  { k:'P', n:'Preview (normal)' }, // Toggle preview
  { k:'Pt', n:'Preview (tall)' }, // Toggle preview (in tall mode)
  { k:'Pw', n:'Preview (wide)' } // Toggle preview (in wide mode)
];

class Layout {
  static create(modifs) {
    let p = new Layout();
    for (const m of modifs) { p.toggle(m); }
    return p;
  }
  constructor() {
    this.e = false;
    this.t = false;
    this.p = false;
  }
  set(o) {
    this.e = o.e;
    this.t = o.t;
    this.p = o.p;
  }
  is_empty() {
    let c = 0;
    if (this.e !== false) c++;
    if (this.t !== false) c++;
    if (this.p !== false) c++;
    return c == 0;
  }
  // Toggle layout
  toggle(layout_modif) {
    let c = 0;
    let prev = new Layout();
    prev.set(this);
    switch(layout_modif) {
    case 'E': this.e = !this.e; break;
    case 'T': this.t = !this.t; break;
    case 'P': this.p = (this.p !== true ? true : false); break;
    case 'Pt': this.p = (this.p !== 'tall' ? 'tall' : false); break;
    case 'Pw': this.p = (this.p !== 'wide' ? 'wide' : false); break;
    }
    if (this.is_empty()) this.set(prev); // restore 
  }
  enabled_modif(layout_modif) {
    switch(layout_modif) {
    case 'E': return this.e === true;
    case 'T': return this.t === true;
    case 'P': return this.p === true;
    case 'Pt': return this.p === 'tall';
    case 'Pw': return this.p === 'wide';
    }
    return false;
  }
  // Get layout sequence (ls) array (see gen_layout)
  get_ls(narrow) {
    let ls = '';
    function upd_(ls, x, n) {
      if (ls=='') {
        if (x!==false) return n;
      } else if (Array.isArray(ls)) { // rebalance
        if (x===true) return [ls[0],ls[1],['v',ls[2],n]];
        if (x==='tall') return [ls[0],['v',ls[1],ls[2]],n];
        if (x==='wide') return ['v',ls,n];
      } else {
        if (x===true) return ['h',ls,n];
        if (x==='tall') return ['h',ls,n];
        if (x==='wide') return ['v',ls,n];
      }
      return ls;
    }
    ls = upd_(ls, this.e, 'E');
    ls = upd_(ls, this.t, 'T');
    ls = upd_(ls, this.p, 'P');
    if (narrow && Array.isArray(ls) && ls[0] == 'h') {
      ls[0] = 'v';
    }
    return ls;
  }
}

// ---------------------------------------------------------------------------
// SVGs (Note: clone with .cloneNode(true) if needed)

const help_svg = elem_from_str(`<svg class="header-icon-img" version="1.1" viewBox="0 0 34 34" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g>
<path d="M17.123,9.2c-1.44,0-2.642,0.503-3.604,1.32S11.994,12,11.832,14h2.937c0.064-1,0.303-1.231,0.716-1.611 s0.926-0.618,1.541-0.618c0.615,0,1.116,0.174,1.504,0.571c0.389,0.396,0.583,0.882,0.583,1.48s-0.187,1.094-0.558,1.499 l-1.772,1.769c-0.518,0.518-0.626,0.934-0.78,1.249C15.849,18.654,16,19.133,16,19.78V21h2v-0.832c0-0.646,0.289-1.148,0.581-1.504 c0.112-0.129,0.333-0.287,0.521-0.473c0.186-0.187,0.448-0.405,0.715-0.656c0.267-0.25,0.5-0.457,0.662-0.619 c0.161-0.161,0.404-0.437,0.712-0.825c0.533-0.647,0.805-1.456,0.805-2.427c0-1.408-0.45-2.503-1.356-3.289 C19.732,9.592,18.563,9.2,17.123,9.2z" fill="currentColor"/>
<path d="M16.94,22.145c-0.51,0-0.946,0.179-1.311,0.534c-0.364,0.356-0.546,0.78-0.546,1.274 c0,0.493,0.186,0.914,0.558,1.262c0.372,0.348,0.813,0.521,1.322,0.521c0.51,0,0.947-0.178,1.311-0.533 c0.363-0.356,0.546-0.781,0.546-1.274s-0.187-0.914-0.559-1.263C17.891,22.318,17.45,22.145,16.94,22.145z" fill="currentColor"/>
<path d="M17,0C7.611,0,0,7.611,0,17s7.611,17,17,17s17-7.611,17-17S26.389,0,17,0z M17,31C9.268,31,3,24.732,3,17 C3,9.268,9.268,3,17,3c7.732,0,14,6.268,14,14C31,24.732,24.732,31,17,31z" fill="currentColor"/>
</g></svg>`);
const layout_svg = elem_from_str(`<svg class="header-icon-img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g>
<path d="M21 20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v16zM11 5H5v14h6V5zm8 8h-6v6h6v-6zm0-8h-6v6h6V5z" fill-rule="nonzero" fill="currentColor"/>
</g></svg>`);
const github_svg = elem_from_str(`<svg class="header-icon-img" version="1.0" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<path clip-rule="evenodd" d="M16.003,0C7.17,0,0.008,7.162,0.008,15.997
c0,7.067,4.582,13.063,10.94,15.179c0.8,0.146,1.052-0.328,1.052-0.752c0-0.38,0.008-1.442,0-2.777
c-4.449,0.967-5.371-2.107-5.371-2.107c-0.727-1.848-1.775-2.34-1.775-2.34c-1.452-0.992,0.109-0.973,0.109-0.973
c1.605,0.113,2.451,1.649,2.451,1.649c1.427,2.443,3.743,1.737,4.654,1.329c0.146-1.034,0.56-1.739,1.017-2.139
c-3.552-0.404-7.286-1.776-7.286-7.906c0-1.747,0.623-3.174,1.646-4.292C7.28,10.464,6.73,8.837,7.602,6.634
c0,0,1.343-0.43,4.398,1.641c1.276-0.355,2.645-0.532,4.005-0.538c1.359,0.006,2.727,0.183,4.005,0.538
c3.055-2.07,4.396-1.641,4.396-1.641c0.872,2.203,0.323,3.83,0.159,4.234c1.023,1.118,1.644,2.545,1.644,4.292
c0,6.146-3.74,7.498-7.304,7.893C19.479,23.548,20,24.508,20,26c0,2,0,3.902,0,4.428c0,0.428,0.258,0.901,1.07,0.746
C27.422,29.055,32,23.062,32,15.997C32,7.162,24.838,0,16.003,0z"
fill="currentColor" fill-rule="evenodd"/>
</svg>`);
const share_svg = elem_from_str(`<svg class="header-icon-img" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
<path d="m8.5 4c.27614 0 .5.22386.5.5 0 .24545778-.17687704.4496079-.41012499.49194425l-.08987501.00805575h-3c-.77969882 0-1.420449.59488554-1.49313345 1.35553954l-.00686655.14446046v8c0 .7796706.59488554 1.4204457 1.35553954 1.4931332l.14446046.0068668h8c.7796706 0 1.4204457-.5949121 1.4931332-1.3555442l.0068668-.1444558v-1c0-.2761.2239-.5.5-.5.2454222 0 .4496.1769086.4919429.4101355l.0080571.0898645v1c0 1.325472-1.0315469 2.4100378-2.3356256 2.4946823l-.1643744.0053177h-8c-1.3254816 0-2.41003853-1.0315469-2.49468231-2.3356256l-.00531769-.1643744v-8c0-1.3254816 1.03153766-2.41003853 2.33562452-2.49468231l.16437548-.00531769zm4.768-.89136.0617.05301 4.4971 4.42118c.2099.20633.229.53775.0573.76685l-.0572.06544-4.4971 4.42258c-.3378.3322-.8869.1189-.9469-.3338l-.0053-.0823v-2.0955l-.2577.0232c-1.8003.1924-3.52574 1.0235-5.18729 2.5071-.38943.3478-.99194.019-.92789-.5063.49872-4.09021 2.58567-6.34463 6.14828-6.62742l.2246-.01511v-2.12975c0-.47977.5302-.73818.8904-.46918z" fill="currentColor"/>
</svg>`);

// ---------------------------------------------------------------------------

var pg_editor_num = 0;

/* Create a playground code or toplevel editor. If opts.autoresize==true then
   the size will dinamically change with contents (for
   lpdoc-runnable). */
function create_pg_editor(container, text, kind, opts) {
  const theme = editor_theme[get_actual_theme()];
  let maxh = 500;
  let minh = 0;
  const ops = {
    value: text,
    scrollBeyondLastLine: false,
    /* (same font size and family than in lpdoc.css) */
    fontSize: "14px",
    lineHeight: "17px", /* same result as in lpdoc.css */ 
    fontFamily: "SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace",
    minimap: {
      enabled: false
    },
    "bracketPairColorization.enabled": false,
    theme: theme,
    autoClosingBrackets: false,
    overviewRulerLanes: 0,
    renderLineHighlight: 'none',
    automaticLayout: false /* Do not use! Expensive! */
  };
  if (kind == 'toplevel') {
    Object.assign(ops, {
      language: 'toplevel',
      lineNumbers: 'off',
      folding: 'false',
      autoIndent: 'none',
      guides: {
        indentation: false
      },
      wordWrap: 'on'
    });
    maxh = 160;
  } else {
    Object.assign(ops, {
      language: 'ciao-prolog',
      lineNumbersMinChars: 3
    });
  }
  if (opts.autoresize === true) {
    Object.assign(ops, {
      scrollbar: {
        alwaysConsumeMouseWheel: false // TODO: good for automatic updateHeight
      }
    });
  }
  const ed = monaco.editor.create(container, ops);
  if (opts.autoresize === true) {
    //container.style.height = '300px';
    let ignoreEvent = false;
    const updateHeight = () => {
      const w = container.clientWidth;
      const h = Math.max(minh, Math.min(maxh, ed.getContentHeight()));
      if (opts.noshrink === true) minh = h; // Force minh to prevent shrinking
      //container.style.width = `${width}px`;
      container.style.height = `${h}px`;
      try {
        ignoreEvent = true;
        ed.layout({ width: w, height: h });
      } finally {
        ignoreEvent = false;
      }
    };
    ed.onDidContentSizeChange(updateHeight);
    ed.onDidLayoutChange(updateHeight); /* when scrollbars (dis)appear */
    updateHeight();
  }
  {
    // workaround regression in Monaco 0.32.0 https://github.com/microsoft/monaco-editor/issues/2947
    // This creates a context key that is enabled only when the editor is focused.
    const focused_key_name = `__isEditorFocused-${pg_editor_num}`;
    pg_editor_num++;
    //
    ed.addCommandFocused = (keybinding, handler) => {
      return ed.addCommand(keybinding, handler, focused_key_name);
    };
    const ctxkey = ed.createContextKey(focused_key_name, false);
    ed.onDidBlurEditorWidget(() => ctxkey.set(false));
    ed.onDidFocusEditorText(() => ctxkey.set(true));
  }
  return ed;
}

// ---------------------------------------------------------------------------
// Visibility state

class Vis {
  #ref;
  #curr;
  constructor() {
    this.#ref = {};
    this.#curr = {};
  }
  // Execute f(ref[name]) when ref[name] is being updated (w.r.t. curr[name])
  inc_update(name, f) {
    // (store value with JSON.stringify to compare elements) // TODO: better way?
    let str = JSON.stringify(this.#ref[name]);
    if (this.#curr[name] !== str) {
      this.#curr[name] = str;
      f(this.#ref[name]);
    }
  }
  // Force an update of curr[name] 
  force_update(name) {
    this.#curr[name] = null;
  }
  get(name) {
    return this.#ref[name];
  }
  set(name, v) {
    this.#ref[name] = v;
  }
}

// ---------------------------------------------------------------------------
// UI - Main playground cell class

// Editor theme for each UI theme
const editor_theme = {
  "light": "ciao-light",
  "dark": "ciao-dark"
};

/* A playground cell with an IDE layout */
class PGCell {
  constructor(cproc) {
    this.editor = null;
    this.toplevel = null;
    this.previewEd = null; // TODO: extend to multiple editor buffers
    // Autosave
    this.autosave_timer = null; // timer
    this.autosave_redo = false; // needs redo
    //
    this.debugging = false; // TODO: fixme
    this.cproc = cproc; // a ToplevelProc
    //
    this.vis = new Vis(); // visibility state
  }

  /* Executed by ToplevelProc on (re)start */
  // TODO: one cproc may have several pg attached! (just read/write to the top one)
  async on_cproc_start() {
    this.#cancel_autosave();
    if (this.is_R) {
      if (this.get_auto_action() === 'load') {
        if (this.pgset !== null) await this.pgset.load_all_code();
        //this.cproc.comint = this.toplevel; // (re)attach to this pg comint // TODO: remove this line if everything is OK
      }
    } else {
      await process_code(this);
    }
  }

  async set_code_and_process(code) {
    pers_set_code(code);
    this.set_editor_value(code);
    this.#cancel_autosave();
    if (!this.is_R) { // TODO: treat is_R == true case
      await process_code(this);
    }
  }

  set_auto_action(action) {
    // TODO: set a field in the PGCell instead
    playgroundCfg.auto_action = action;
  }
  get_auto_action() {
    // TODO: set a field in the PGCell instead
    return playgroundCfg.auto_action;
  }

  /* ---------------------------------------------------------------------- */
  /* Setup layout */

  async setup(base_el, cell_data, pgset) {
    this.pgset = pgset;
    this.cell_data = cell_data;
    //
    if (this.cell_data.kind === 'full' || this.cell_data.kind === 'miniplayground') {
    } else {
      this.is_R = true;
    }
    if (this.is_R) {
      base_el.classList.add("lpdoc-runnable-container");
      base_el.replaceChildren();
    }
    //
    if (!this.is_R) {
      if (this.cell_data.kind === 'full') {
      } else if (this.cell_data.kind === 'miniplayground') {
        setup_mini_pg(base_el);
      } else {
        return; // TODO: what is this case?
      }
    }
    // Configurable layout
    if (!this.is_R) {
      this.splits = [];
      this.vis.set('layout', Layout.create(playgroundCfg.window_layout));
    }
    // Header
    if (!this.is_R) {
      if (playgroundCfg.with_header) setup_header(base_el);
    }
    // Menu
    if (this.is_R) {
      this.#setup_menu_R(base_el);
    } else {
      this.#setup_menu(base_el);
    }
    // Editor
    let initial_code = null;
    if (this.is_R) {
      if (this.cell_data.kind == 'exercise') {
        initial_code = this.cell_data['hint'];
      } else if (this.cell_data.kind == 'code' || this.cell_data.kind == 'exfilter' || this.cell_data.kind == 'exfilterex') {
        initial_code = this.cell_data['focus'];
      }
    } else {
      initial_code = this.cell_data['focus'];
    }
    if (initial_code !== null) {
      this.#setup_editor(initial_code);
    } else {
      this.editor_el = null;
    }
    // Toplevel
    this.#setup_toplevel();
    // Preview
    this.#setup_preview();
    // Setup window layout
    this.#setup_layout(base_el);
    // Start cell (if needed)
    if (this.is_R) {
      if (this.cell_data.kind == 'query') {
        await this.enable_response({onequery: true, autoresize:true});
        await this.cproc.ensure_started(this.toplevel);
      } else if (this.cell_data.kind == 'code') {
        await this.enable_response({noprompt: true, autoresize:true, noshrink: true});
        await this.cproc.ensure_started(this.toplevel);
      } else if (this.cell_data.kind == 'jseval') { // (expects an async function in 'jscode')
        let f = Function('"use strict";return (' +
                         this.cell_data['jscode'] +
                         ')')();
        await f(this);
      }
    } else {
      await this.cproc.ensure_started(this.toplevel);
    }
    // Write (without evaluating) default query (once started)
    if (this.is_R) {
      if (this.cell_data.kind == 'query') {
        this.toplevel.clear_output();
        this.toplevel.print_prompt();
        this.toplevel.display(this.cell_data['query']);
      }
    }
  }

  /* Editor menu (menubar) */
  #setup_menu(base_el) {
    let menu_el = elem_cn('div', 'main-menu');
    //
    if (playgroundCfg.has_layout_button) this.#setup_layout_button(menu_el);
    // (file options)
    if (playgroundCfg.has_new_button) this.#setup_new_button(menu_el);
    if (playgroundCfg.has_open_button) this.#setup_open_button(menu_el);
    if (playgroundCfg.has_save_button) this.#setup_save_button(menu_el);
    if (playgroundCfg.has_examples_button) this.#setup_examples_button(menu_el);
    // (actions)
    if (playgroundCfg.has_load_button) this.#setup_load_button(menu_el);
    // (advanced actions)
    const adv_list = [];
    if (playgroundCfg.has_toggle_on_the_fly_button) adv_list.push({ k:'toggle_on_the_fly', n:'Toogle on-the-fly' });
    if (playgroundCfg.has_run_tests_button) adv_list.push({ k:'test', n:'Run tests (C-c u)' });
    if (playgroundCfg.has_debug_button) adv_list.push({ k:'debug', n:'Debug (C-c d)' });
    if (playgroundCfg.has_doc_button) adv_list.push({ k:'doc', n:'Preview documentation (C-c D)' });
    if (playgroundCfg.has_acheck_button) adv_list.push({ k:'acheck', n:'Analyze and check assertions (C-c V)' });
    if (playgroundCfg.has_acheck_button) adv_list.push({ k:'acheck_output', n:'Analyze and check assertions (w/ output)' });
    if (playgroundCfg.has_spec_button) adv_list.push({ k:'spec', n:'Specialize code (C-c O)' });
    if (adv_list.length > 0) {
      let do_action = {};
      do_action['toggle_on_the_fly'] = toggle_on_the_fly;
      do_action['test'] = run_tests;
      do_action['debug'] = debug;
      do_action['doc'] = gen_doc_preview;
      do_action['acheck'] = acheck;
      do_action['acheck_output'] = acheck_output;
      do_action['spec'] = spec_preview;
      const adv_button =
            new DropdownButton(menu_el,
                               "Advanced actions",
                               elem_from_str("<span>More...</span>"),
                               adv_list,
                               value => {
                                 (async() => {
                                   await do_action[value](this);
                                 })();
                               });
      adv_button.btn_el.classList.add('menu-button');
      adv_button.btn_el.style.height = '100%';
    }

    // (right menu part)
    const right_menu_el = elem_cn('div', 'right-menu');
    menu_el.appendChild(right_menu_el);

    if (playgroundCfg.has_share_button) this.#setup_share_button(right_menu_el);

    //
    base_el.appendChild(menu_el);
  }

  /* Editor menu (lpdocPG === 'runnable') */
  #setup_menu_R(base_el) {
    const menu_el = elem_cn('div', 'lpdoc-runnable-buttons');
    this.status_el = null; // TODO: set status_el to null before
    if (this.cell_data.kind == 'query') { // menu for running queries
      menu_el.appendChild(btn('lpdoc-runnable-button', "Run query", "<span>&#9654;</span>", (() => {
        this.toplevel.treat_enter().then(() => {});
      })));
    } else if (this.cell_data.kind == 'code' || this.cell_data.kind == 'exercise' || this.cell_data.kind == 'exfilter' || this.cell_data.kind == 'exfilterex') {
      this.status_el = elem_cn('span', 'lpdoc-runnable-statusmark');
      let btn_l;
      let btn_c;
      if (this.cell_data.kind == 'code') { // menu for loading (focused) code
        btn_l = "Load";
        btn_c = (() => {
          this.with_response(load_code).then(() => {});
        });
      } else if (this.cell_data.kind == 'exfilter') { // menu for exfilter
        btn_l = "Show analysis";
        btn_c = (() => {
          this.with_response(run_exfilter).then(() => {});
        });
      } else if (this.cell_data.kind == 'exfilterex') { // menu for exfilter
        btn_l = "Submit answer";
        btn_c = (() => {
          this.with_response(run_exfilter_exercise).then(() => {});
        });
      } else if (this.cell_data.kind == 'exercise') { // menu for running tests
        btn_l = "Run tests";
        btn_c = (() => {
          this.with_response(run_tests).then(() => {});
        });
      }
      let btn_el = btn('lpdoc-runnable-button', btn_l, '', btn_c);
      btn_el.appendChild(this.status_el);
      menu_el.appendChild(btn_el);
      //
      menu_el.appendChild(btn('lpdoc-runnable-button', "Load in playground", "<span>&#8599;</span>", (() => {
        this.load_in_playground();
      })));
    }
    //
    base_el.appendChild(menu_el);
  }

  /* The code editor (creates editor_el and editor) */
  #setup_editor(text) {
    if (this.is_R) {
      this.editor_el = elem_cn('div', 'lpdoc-runnable-editor-container');
      this.editor = create_pg_editor(this.editor_el, text, 'editor', {autoresize: true});
      this.editor.getModel().onDidChangeContent(e => {
        this.set_code_status('unknown');
      });
      this.set_code_status('unknown'); // set code status (if applicable)
    } else {
      this.editor_el = elem_cn('div', 'editor-container');
      this.editor = create_pg_editor(this.editor_el, text, 'editor', {});
      add_emacs_bindings(this.editor);
      add_playground_bindings(this.editor, this);
      // Save to local storage when content changes (with a delay)
      this.editor.getModel().onDidChangeContent(e => {
        this.autosave_redo = true;
        this.#sched_autosave();
      });
    }
  }

  /* Comint */
  #setup_toplevel() {
    if (this.is_R) {
      this.toplevel_el = elem_cn('div', 'lpdoc-runnable-comint');
    } else {
      this.toplevel_el = elem_cn('div', 'comint-container');
      this.toplevel = new Comint(this.toplevel_el, this, {}); // commit for toplevel
    }
  }

  /* Preview */
  #setup_preview() {
    if (this.is_R) {
      this.preview_el = elem_cn('div', 'lpdoc-runnable-preview');
    } else {
      this.preview_el = elem_cn('div', 'preview-container');
    }
  }

  /* Help footer */
  #setup_help_footer(base_el) {
    const el = btn('lpdoc-runnable-help', "Copy the solution", "&#9733; Show solution", () => {
      let sol = this.cell_data['solution'];
      (async() => {
        await this.set_code_and_process(sol);
      })();
    });
    this.help_el = el;
    base_el.appendChild(this.help_el);
  }

  /* Setup internal layout */
  #setup_layout(base_el) {
    if (this.is_R) {
      if (this.editor_el !== null) base_el.appendChild(this.editor_el);
      base_el.appendChild(this.toplevel_el);
      base_el.appendChild(this.preview_el);
      // Help footer
      if (this.cell_data.kind == 'exercise' || this.cell_data.kind == 'exfilterex') {
        this.#setup_help_footer(base_el);
      }
    } else {
      this.layout_el = elem_cn('div', 'playground');
      base_el.appendChild(this.layout_el);
      //
      this.vis.set('narrow', (window.matchMedia('(max-width: 750px)').matches ? true : false));
      this.update_inner_layout(); // (initial setup)
      window.matchMedia('(max-width: 750px)').addEventListener('change', () => {
        this.vis.set('narrow', (window.matchMedia('(max-width: 750px)').matches ? true : false));
        this.update_inner_layout();
      });
    }
  }

  /* Update (internal) layout (incrementally) */
  update_inner_layout() {
    if (this.is_R) return;
    let update_dim = false;
    // (Re)create layout if narrow changes
    this.vis.inc_update('narrow', (st) => {
      this.vis.force_update('layout');
    });
    // (Re)create window layout if needed
    this.vis.inc_update('layout', (layout) => {
      this.#destroy_splits(); // remove split views before wiping out layout_el
      //
      let narrow = this.vis.get('narrow');
      let el = this.#gen_layout(layout.get_ls(narrow));
      el.style.height = '100%'; // TODO: better way?
      //
      this.layout_el.replaceChildren();
      this.layout_el.appendChild(el);
      //
      update_dim = true;
    });
    this.toplevel.update_inner_layout();
    if (update_dim) {
      this.update_dimensions();
    }
  }

  #gen_layout(s) {
    let e;
    if (Array.isArray(s)) {
      let el1 = this.#gen_layout(s[1]);
      let el2 = this.#gen_layout(s[2]);
      e = this.#setup_split(s[0], el1, el2);
    } else {
      switch(s) {
      case 'E': e = this.editor_el; break;
      case 'P': e = this.preview_el; break;
      case 'T': e = this.toplevel_el; break;
      }
    }
    return e;
  }

  /* Destroy splits */
  #destroy_splits() {
    for (const s of this.splits) { s.destroy(); }
    this.splits = [];
  }

  /* Create a split resizable div (s directon, el1, el2 elems) */
  #setup_split(s, el1, el2) {
    let opts = {};
    let el = document.createElement("div");
    if (s === 'h') {
      opts.direction = 'horizontal';
      opts.cursor = 'col-resize';
      el.classList.add('split-horiz');
    } else if (s === 'v') {
      opts.direction = 'vertical';
      opts.cursor = 'row-resize';
      el.classList.add('split-vert');
    }
    el.appendChild(el1);
    el.appendChild(el2);
    opts.gutterSize = 8;
    opts.onDrag = (sizes) => {
      this.update_dimensions();
    };
    this.splits.push(Split([el1, el2], opts));
    return el;
  }

  /* ---------------------------------------------------------------------- */

  /* Make version visible */
  show_version(str) {
    let info_match = str.match(/.*^(Ciao.*$).*/m);
    if (info_match != null && info_match.length == 2) {
      [...document.getElementsByClassName("lpdoc-footer")].forEach(node => {
        node.innerHTML = "Generated with LPdoc | <span style='color:var(--face-checked-assrt)'>RUNNING</span> " + info_match[1];
      });
    }
    if (toplevelCfg.statistics) console.log(str);
  }

  /* ---------------------------------------------------------------------- */

  /* Set window layout (not visible until update_inner_layout() is called) */
  set_window_layout(modifs) {
    this.vis.set('layout', Layout.create(modifs));
  }

  show_toplevel(m) { 
    if (this.is_R) return; /* (do nothing) */
    this.vis.get('layout').t = m;
    this.update_layout_sel_button_marks();
  }

  show_preview(m) {
    if (this.is_R) {
      if (m === false) {
        this.preview_el.style.display = "none";
      } else {
        this.preview_el.style.display = "block";
      }
    } else {
      // TODO: mode is not preserved when going from false to true
      if (m === true && this.vis.get('layout').p !== false) return; // keep previous mode
      this.vis.get('layout').p = m;
      this.update_layout_sel_button_marks();
    }
  }

  async enable_response(opts) {
    if (this.toplevel === null) {
      const e = this.toplevel_el;
      e.className = '';
      e.style.marginTop = '5px';
      this.toplevel = new Comint(e, this, opts);
    }
  }

  /* ---------------------------------------------------------------------- */

  /* Update layout of editors (after redimensioning) */
  update_dimensions() {
    if (this.editor !== null) this.editor.layout();
    if (this.toplevel !== null) this.toplevel.update_dimensions();
    if (this.previewEd !== null) this.previewEd.layout();
  }

  /* ---------------------------------------------------------------------- */

  /* Change focus (editor <-> toplevel). */
  change_focus() {
    if (this.editor.hasWidgetFocus()) {
      this.toplevel.editor.focus();
    } else {
      this.editor.focus();
    }
  }

  /* ---------------------------------------------------------------------- */

  /* Schedule autosave */
  #sched_autosave() {
    if (this.autosave_timer !== null) return; // Already set, do nothing
    this.autosave_timer = setTimeout(() => {
      this.#do_autosave().then(() => {});
    }, playgroundCfg.autosave_delay);
  }

  #cancel_autosave() {
    if (this.autosave_timer === null) return; // No timer, do nothing
    clearTimeout(this.autosave_timer);
    this.autosave_timer = null;
  }

  async #do_autosave() {
    this.autosave_redo = false;
    // cleanup URL encoded info on changes
    let prune_idx = -1;
    let url = document.URL;
    if (url.includes('?')) prune_idx = url.indexOf('?');
    if (url.includes('#')) prune_idx = url.indexOf('#');
    if (prune_idx > -1) {
      url = url.slice(0, prune_idx);
      history.replaceState(undefined, undefined, url);
    }
    // update local storage
    pers_set_code(this.get_editor_value());
    // process if on-the-fly is set
    if (playgroundCfg.on_the_fly) {
      if (this.cproc.state !== QueryState.READY) {
        this.autosave_redo = true; /* cproc not ready, try again later... */
      } else {
        /* Note that autosave_redo may become 'true' during await */
        await process_code(this);
      }
    }
    this.autosave_timer = null; // Mark timer as done
    if (this.autosave_redo) this.#sched_autosave(); // Reschedule if needed
  }

  /* ---------------------------------------------------------------------- */
  /* Marks and code status (on the editor side) */

  set_code_status(st) {
    let txt = null;
    if (this.cell_data.kind == 'code') {
      switch(st) {
      case 'failed': txt = '&#10008;'; break;
      case 'checked': txt = '&#10004;'; break;
      default: txt = '?';
      }
    } else if (this.cell_data.kind == 'exercise' || this.cell_data.kind == 'exfilterex') {
      switch(st) {
      case 'failed': txt = '&#128576; &#10008;'; break;
      case 'checked': txt = '&#128571; &#10004;'; break;
      default: txt = '&#129300; ?';
      }
    } else if (this.cell_data.kind == 'exfilter') {
      txt = '&#129300; ?';
    }
    if (txt !== null) {
      let sty;
      switch(st) {
      case 'failed': sty = 'lpdoc-runnable-status-failed'; break;
      case 'checked': sty = 'lpdoc-runnable-status-checked'; break;
      default: sty = 'lpdoc-runnable-status-unknown';
      }
      this.set_code_status_(sty, txt);
    }
  }
  set_code_status_(className, text) {
    const e = this.status_el;
    if (e === null) return;
    e.className = 'lpdoc-runnable-statusmark';
    e.classList.add(className);
    e.innerHTML = text;
  }

  /* Post-process warning/error messages after load */ // TODO: generalize
  mark_errs(out, err) {
    let msgs = parse_error_msg(err); // obtain object with parsed errors
    let file = this.curr_mod_path();
    let markers = create_markers(file, msgs); // create monaco markers
    //
    if (this.is_R) {
      let has_errs = (markers.length !== 0);
      if (this.cell_data.kind == 'code' || this.cell_data.kind == 'exfilter') { // menu for loading (focused) code
        this.set_code_status(has_errs ? 'failed' : 'checked');
      } else if (this.cell_data.kind == 'exercise') { /* run tests */
        const regex = /Passed: [0-9]* \((?<passed>[0-9\.]*%)\)/;
        let str = out+err;
        const found = str.match(regex);
        if (found !== null && found.groups.passed !== "100.00%") {
          has_errs |= true;
        }
        this.set_code_status(has_errs ? 'failed' : 'checked');
      }
      // show toplevel only on errors // TODO: not for queries!
      this.toplevel_el.className = has_errs ? '' : 'comint-echo-hidden';
      this.toplevel.update_dimensions();
    }
    // Mark warnings and errors in the editor
    // TODO: line numbers needs adjustments! shown code is not the compiled one
    monaco.editor.setModelMarkers(this.editor.getModel(), 'errors', markers);
  }

  // Extract range from srcdbg_info
  //
  // TODO: this is an approximation similar to what is implemented in
  //   ciao-debugger.el, we'd need to identify goal locations (at
  //   compile time).
  srcdbg_info_to_range(info) {
    const model = this.editor.getModel();
    let search_range = new monaco.Range(info.ln0, 1, info.ln1+1, 1);
    let text = model.getValueInRange(search_range);
    // Tokenize the search region and find matches.
    // See debugger_tr.pl for the meaning of num (it included substrings)
    let tokens = monaco.editor.tokenize(text, 'ciao-prolog');
    var cnt = 0;
    for (let row = 0; row < tokens.length; row++) {
      let line = model.getLineContent(info.ln0+row);
      for (let tk = 0; tk < tokens[row].length; tk++) {
        var offset = tokens[row][tk].offset;
        var next_offset;
        if (tk == tokens[row].length-1) {
          next_offset = line.length;
        } else {
          next_offset = tokens[row][tk+1].offset;
        }
        let txt = line.slice(offset, next_offset);
        // console.log(`(${row}) tk ${tk} ${offset} ${txt} ${tokens[row][tk].type}`);
        let type = tokens[row][tk].type;
        switch(type) {
        case 'predefined.operator.ciao-prolog': break;
        case 'type.identifier.ciao-prolog': break; // TODO: fix name (should be vars)
        case 'string-single.ciao-prolog': break; // TODO: fix name (should be quoted atom)
        case 'operator.ciao-prolog': break;
        case 'source.ciao-prolog': 
          // amend wrong tokenizer // TODO: fixme
          if (txt.endsWith('.')) {
            txt = txt.slice(0,-1);
            next_offset--;
          }
          break;
        case 'pred-name.ciao-prolog': break;
        default: continue; // skip this token
        }
        // Increment for each (non-overlapping) occurrence in 'txt'
        // (this is what we require for ciao-debugger.el)
        var pos = 0;
        while (pos < txt.length) {
          pos = txt.indexOf(info.pred, pos);
          if (pos === -1) break;
          cnt++; // found one occurrence
          pos += info.pred.length; // move forward
        }
        if (cnt === info.num) {
          return new monaco.Range(info.ln0+row, offset+1, info.ln0+row, next_offset+1);
        }
      }
    }
    return search_range;
  }

  /* mark source debug info (unmark if info === null or source is not visible) */
  /* Note: based on ciao-debugger.el:ciao-debug-display-line */
  mark_srcdbg_info(info) {
    let decs = [];
    if (info !== null && info.src === this.curr_mod_path()) {
      var cl;
      switch(info.port) {
      case '  Call: ': cl = 'ciao-face-debug-call'; break;
      case '  Exit: ': cl = 'ciao-face-debug-exit'; break;
      case '  Redo: ': cl = 'ciao-face-debug-redo'; break;
      case '  Fail: ': cl = 'ciao-face-debug-fail'; break;
      default: cl = 'ciao-face-debug-expansion'; break; // TODO: unknown port
      }
      // see debugger_lib.pl
      // TODO: ciao-face-debug-expansion is used differently
      // TODO: missing ciao-face-debug-breakpoint
      let range = this.srcdbg_info_to_range(info);
      // // mark the whole line // TODO: not working? wrong monaco version?
      decs.push({
        range: new monaco.Range(range.startLineNumber, 1, range.startLineNumber, 1),
        options: {
          isWholeLine: true,
          className: cl+"-bg"
        }
      });
      // and the token
      decs.push({
        range: range,
        options: {
          isWholeLine: false,
          // after: { content: "..." }, // TODO: mark the goal, add bindings?
          inlineClassName: cl
        }
      });
      this.editor.revealLine(range.startLineNumber);
    }
    if (this.dbg_decorations !== undefined) {
      this.dbg_decorations.clear();
      this.dbg_decorations = undefined;
    }
    if (decs.length > 0) {
      this.dbg_decorations = this.editor.createDecorationsCollection(decs);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Code editor and toplevel process */

  /* Get editor value (text) */
  get_editor_value() {
    return this.editor.getModel().getValue();
  }
  /* Set editor value (text) */
  set_editor_value(text) {
    this.editor.getModel().setValue(text);
  }

  /* return completed code */
  complete_code() {
    let code = this.get_editor_value();
    if (this.is_R) {
      code = (this.cell_data['preamble'] + " " +  // TODO: if preamble has only one line, this fixes line problems
              code + '\n' +
              this.cell_data['postamble'] + "\n");
    } else {
      if (playgroundCfg.amend_on_save) {
        /* TODO: horrible hack: add module if none if found, works better than 'user' modules */
        let matches = code.match(/:-\s*module\(/g); // (do not wait for '.')
        if (matches === null) {
          // code = ":- module(_,_,[assertions]). " + code; // assertions needed for acheck, etc.
          code = ":- module(_,_). " + code;
        }
      }
    }
    return code;
  }

  options_exfilter() {
    let opts = this.cell_data['opts'];    
    return opts;
  }

  solution_exercise() {
    let sol = this.cell_data['solution'];    
    return sol;
  }
  curr_mod_name() { // just the name
    if (this.is_R) {
      return this.cell_data.modname;
    } else {
      return guess_mod_name(this.get_editor_value());
    }
  }
  curr_mod_name_ext() { // name and extension
    return this.curr_mod_name()+'.pl';
  }
  curr_mod_base() { // full path without extension
    return '/'+this.curr_mod_name();
  }
  curr_mod_path() { // full path with extension
    return '/'+this.curr_mod_name_ext();
  }

  /* ---------------------------------------------------------------------- */

  /* Save current code into the worker file system (possibly "amending it") */
  async upload_code_to_worker() {
    if (!this.cproc.check_not_running()) return;
    let code = this.complete_code();
    let file = this.curr_mod_path();
    await this.cproc.w.writeFile(file, code);
  }

  /* ---------------------------------------------------------------------- */
  /* Menu buttons */

  update_layout_sel_button_marks() {
    const filter = (k) => {
      return this.vis.get('layout').enabled_modif(k); 
    };
    if (this.layout_sel_button !== undefined) this.layout_sel_button.update_marks(filter);
  }

  #setup_layout_button(menu_el) {
    const btn =
          new DropdownButton(menu_el,
                             "Change layout",
                             layout_svg.cloneNode(true),
                             layout_modif_list,
                             value => {
                               this.vis.get('layout').toggle(value);
                               this.update_layout_sel_button_marks();
                               this.update_inner_layout();
                             });
    btn.btn_el.classList.add('menu-button');
    btn.btn_el.style.height = '100%';
    this.layout_sel_button = btn;
    this.update_layout_sel_button_marks();
  }

  #setup_new_button(menu_el) {
    // new file (reset)
    const el = btn('menu-button', "New code", "New", () => {
      new_code(this).then(() => {}); // TODO: use "async () => { ... }" instead?
    });
    menu_el.appendChild(el);
  }

  #setup_open_button(menu_el) { // open file (upload)
    // (implicit label association)
    const label_el = document.createElement('label');
    const file_el = elem_from_str(`<input type="file" accept=".pl" class="file-upload">`);
    label_el.appendChild(file_el);
    label_el.appendChild(document.createTextNode("Open"));
    menu_el.appendChild(label_el);
    file_el.addEventListener('change', (e) => { handle_file_upload(e, file_el, this); }, false);
  }

  #setup_save_button(menu_el) { // save file
    const el = elem_cn('button', 'menu-button');
    el.onclick = () => { 
      let name = this.curr_mod_name_ext(); // obtain name with extension
      let file = new Blob([this.get_editor_value()], { type: 'text/plain' });
      a_el.href = URL.createObjectURL(file);
      a_el.download = name;
    };
    const a_el = elem_from_str(`<a href="" style="text-decoration: none; color: inherit;">Save</a>`);
    el.appendChild(a_el);
    menu_el.appendChild(el);
    this.save_button = el;
  }
  click_save_button() { // click the 'a' element
    this.save_button.firstElementChild.click(); // click the 'a' element
  }

  #setup_examples_button(menu_el) {
    const examples_button =
          new DropdownButton(menu_el,
                             "Select example",
                             elem_from_str("<span>Examples &#128214;</span>"),
                             playgroundCfg.example_list,
                             value => {
                               (async() => {
                                 let dir = await this.cproc.w.get_ciao_root();
                                 await open_example(this, dir + '/' + value);
                               })();
                             });
    examples_button.btn_el.classList.add('menu-button');
    examples_button.btn_el.style.height = '100%';
  }

  #setup_load_button(menu_el) { // load into toplevel
    const el = btn('menu-button', "Press C-c l to load into top level", "Load &nbsp;&#9654", () => {
      load_code(this).then(() => {}); // TODO: use "async () => { ... }" instead?
    }); 
    menu_el.appendChild(el);
  }

  #setup_share_button(menu_el) {
    const el = elem_cn('button', 'menu-button');
    el.title = 'Copy a link to this code';
    el.appendChild(share_svg.cloneNode(true));
    const msg_el = document.createTextNode("Share!");
    el.appendChild(msg_el);
    el.onclick = () => { handle_share(el, msg_el, this); };
    menu_el.appendChild(el);
  }

  /* ---------------------------------------------------------------------- */

  // execute command on response view
  async with_response(f) { /* pre: this.is_R */
    if (!this.cproc.check_not_running()) return;
    await this.enable_response({noprompt: true, autoresize:true, noshrink: true});
    await this.cproc.ensure_started(this.toplevel);
    //
    this.toplevel.clear_output(); // TODO: customize?
    await f(this);
    this.toplevel.reveal_first(); // TODO: customize?
    if (!playgroundCfg.runnable_keep_alive) {
      this.cproc.shutdown();
    }
  }

  /* ---------------------------------------------------------------------- */

  // redirect to playground
  load_in_playground() { /* pre: this.is_R */
    let code = this.complete_code();
    window.open(urlPREFIX+'/playground/index.html#' + encodeURI(code)); // open playground in new tab
  }

  // Setup cell with dynamic preview (TODO: experimental)
  async setup_dynpreview(opts) { /* pre: this.is_R */
    let render_pred = opts.render_pred;
    // extend dependencies and init queries (before start)
    if (opts.depends !== undefined) this.cproc.push_depends(opts.depends);
    if (opts.on_init !== undefined) this.cproc.push_on_init(opts.on_init);
    // assign an identifier in pgset // TODO: hardwired!
    if (pgset.dynpreview === undefined) {
      pgset.dynpreview = [];
    }
    const id = pgset.dynpreview.length;
    pgset.dynpreview.push(this);
    // create a dummy console comint (this cell has no output)
    this.toplevel = new ConsoleComint(this);
    // start
    await this.cproc.ensure_started(this.toplevel);
    // 
    window.dynpreview_visit = (id,state) => { // push state and render
      const pg = pgset.dynpreview[id];
      if (opts.state_hash === true) {
        push_state_to_hash(state);
        window.scrollTo(0,0);
      }
      (async() => {
        await pg.cproc.muted_query_dumpout(render_pred+"("+id+",'"+state+"')"); // TODO: json state?
      })();
    };
    window.dynpreview_render = (id,html) => {
      const pg = pgset.dynpreview[id];
      pg.show_preview(true);
      pg.update_inner_layout();
      const e = pg.preview_el;
      e.innerHTML=html;
    }
    // 
    const read_state_and_render = async() => {
      const state = (opts.state_hash === true) ? read_state_from_hash() : '';
      await this.cproc.muted_query_dumpout(render_pred+"("+id+",'"+state+"')"); // TODO: json state?
    };
    await read_state_and_render();
    if (opts.state_hash === true) addEventListener('hashchange', event => { read_state_and_render().then(() => {}); });
  }
}

function handle_file_upload(event, file_el, pg) {
  let allowedExtensions = /(\.pl)$/i;
  if (!allowedExtensions.exec(file_el.value)) {
    alert('Invalid file type (.pl expected).');
    file_el.value = '';
    return false;
  } else {
    const reader = new FileReader();
    reader.onload = (event) => {
      (async() => {
        await pg.set_code_and_process(event.target.result);
      })();
    };
    reader.readAsText(event.target.files[0]);
    // fileName = '/' + file_el.value.split(/(\\|\/)/g).pop(); // obtain name
  }
}

// Mini-playgrond (e.g, for website)
function setup_mini_pg(el) {
  playgroundCfg = Object.assign({...playgroundCfg}, miniPlaygroundCfg); // TODO: local cfg?
  el.style.width='100%';
  el.style.height='250px'; // TODO: customize?
  el.style.display='flex';
  el.style.marginBottom='24px';
  el.style.flexFlow='column';
}

async function open_example(pg, path) {
  var str = await pg.cproc.w.readFile(path);
  await pg.set_code_and_process(str);
}  

function handle_share(btn_el, msg_el, pg) {
  let value = pg.get_editor_value();
  navigator.clipboard.writeText(code_to_URL(value)).then(() => { // success
    let prev = msg_el.textContent;
    msg_el.textContent = 'Copied!';
    btn_el.style.color = 'var(--face-checked-assrt)';
    setTimeout(() => {
      msg_el.textContent = prev;
      btn_el.style.color = null;
    }, 500);
  }).catch(err => {
    console.log('Something went wrong', err);
  });
}

const github_hash = '#https://github.com/';

/* Initial editor value (splash, URI encoded, URL from a CDN, etc.) */
async function initial_editor_value() {
  // Try from github
  if (document.location.hash.startsWith(github_hash)) {
    return await fetch_from_github();
  }
  // Extract from URL
  {
    let code = code_from_URL();
    if (code !== null) return code;
  }
  // Try from persistent store
  {
    let code = pers_get_code();
    if (code !== null) return code;
  }
  // Just show splash code
  return playgroundCfg.splash_code;
}

async function fetch_from_github() {
  /* Use https://cdn.jsdelivr.net CDN to fetch the file */
  //let url = 'https://github.com/USER/REPO/blob/BRANCH/RELPATH';
  let p = document.location.hash.substring(github_hash.length);
  let gh_user = p.substring(0, p.indexOf('/')); p = p.substring(p.indexOf('/')+1);
  let gh_repo = p.substring(0, p.indexOf('/blob/')); p = p.substring(p.indexOf('/blob/')+'/blob/'.length);
  let gh_branch = p.substring(0, p.indexOf('/')); p = p.substring(p.indexOf('/')+1);
  let gh_relpath = p;
  let url = `https://cdn.jsdelivr.net/gh/${gh_user}/${gh_repo}@${gh_branch}/${gh_relpath}`;
  let res = await fetch(url);
  let txt = await res.text();
  return txt;
}

async function fetch_from_worker() {
  /* Use https://cdn.jsdelivr.net CDN to fetch the file */
  //let url = 'https://github.com/USER/REPO/blob/BRANCH/RELPATH';
  let p = document.location.hash.substring(github_hash.length);
  let gh_user = p.substring(0, p.indexOf('/')); p = p.substring(p.indexOf('/')+1);
  let gh_repo = p.substring(0, p.indexOf('/blob/')); p = p.substring(p.indexOf('/blob/')+'/blob/'.length);
  let gh_branch = p.substring(0, p.indexOf('/')); p = p.substring(p.indexOf('/')+1);
  let gh_relpath = p;
  let url = `https://cdn.jsdelivr.net/gh/${gh_user}/${gh_repo}@${gh_branch}/${gh_relpath}`;
  let res = await fetch(url);
  let txt = await res.text();
  return txt;
}

// (for dynpreview)
function push_state_to_hash(state) {
  const hash = (state === '') ? window.location.pathname : "#"+encodeURI(state);
  history.pushState('','',hash);
}

// (for dynpreview)
function read_state_from_hash() {
  let state='';
  if (document.URL.includes('#')) { // Code in the URL
    let value = document.location.hash.substring(1); // strip off leading #
    state = decodeURI(value); // decode URI
  }
  return state;
}

// ---------------------------------------------------------------------------

function update_editor_theme() {
  monaco.editor.setTheme(editor_theme[get_actual_theme()]);
}

// Called when theme changes
{ 
  const prev = update_theme_hook;
  update_theme_hook = () => { // TODO: better way to extend hooks?
    prev(); 
    if (typeof monaco !== 'undefined') { /* monaco already loaded */
      update_editor_theme();
    }
  }
};

// ---------------------------------------------------------------------------
// Playground actions on code

/* New code (reset editor contents) */
async function new_code(pg) {
  let text = "Discard the current code?";
  // TODO: use custom dialog, make default to cancel
  if (confirm(text) == true) {
    await pg.set_code_and_process(playgroundCfg.splash_code);
  }  
}

/* Process code (load, doc, etc.) */
async function process_code(pg) {
  let pmuted = null;
  if (playgroundCfg.on_the_fly) pmuted = pg.cproc.set_muted(true); // TODO: mute in on_the_fly; make it optional?
  switch(pg.get_auto_action()) {
  case 'load': await load_code(pg); break;
  case 'doc': await gen_doc_preview(pg); break;
  case 'test': await run_tests(pg); break;
  case 'acheck': await acheck(pg); break;
  case 'acheck_output': await acheck_output(pg); break;
  case 'spec': await spec_preview(pg); break;
  case 'exfilter': await run_exfilter(pg); break;
  case 'exfilter_exercise': await run_exfilter_exercise(pg); break;
  }
  if (pmuted !== null) pg.cproc.muted = pmuted;
}

/* Load */
async function load_code(pg) {
  let q;
  if (!pg.cproc.muted) {
    pg.show_toplevel(true);
    pg.update_inner_layout();
  }
  const mod = pg.curr_mod_path();
  if (toplevelCfg.statistics) console.log(`{loading '${mod}'}`);
  if (toplevelCfg.custom_load_query !== undefined) {
    q = toplevelCfg.custom_load_query(mod);
  } else {
    q = "use_module('" + mod + "')";
  }
  await pg.toplevel.do_query(q, {msg:'Loading'}); // TODO: this last 'await' here should not be needed but it does not work otherwise... WHY? A problem with CiaoPromiseProxy? (JFMC)
  pg.set_auto_action('load');
}

/* Exfilter */
async function run_exfilter(pg) {
  const mod = pg.curr_mod_path();
  const modbase = pg.curr_mod_base();
  // Heuristic to determine if the filtering output comes from a ciaopp output file or from top-level messages
  const opts = pg.options_exfilter().split(",");
  if (opts.includes("V") === true) {
    if (opts.includes("output=on") === true) {
      var kind = 'editor';
    } else {
      var kind = 'toplevel';
    }
  } else {
    var kind = 'editor';
  }
  await pg.toplevel.do_query("filter_analyze(\"" + mod + "\",\"" + opts +"\")", {msg:'Analyzing'});
  var str = await pg.cproc.w.readFile(modbase+'.txt');
  if (str !== null) {
    str = str.trim(); // TODO: this should be done by exfilter
    await show_text_highlight(pg, str, kind);
  } 
  pg.set_auto_action('exfilter');
}

/* Exfilter */
async function run_exfilter_exercise(pg) {
  const mod = pg.curr_mod_path();
  const modbase = pg.curr_mod_base();
  // Heuristic to determine if the filtering output comes from a ciaopp output file or from top-level messages
  const opts = pg.options_exfilter().split(",");
  if (opts.includes("solution=errors") === true) {
    var kind = 'toplevel';
  } else {
    var kind = 'editor';
  }
  const sol = pg.solution_exercise();
  await pg.toplevel.do_query("filter_analyze_exercise_mode(\"" + mod + "\",\"" + sol + "\",\""+ opts + "\")", {msg:'Analyzing answer'});
  var str = await pg.cproc.w.readFile(modbase+'.txt');
  if (str !== null) {
    str = str.trim(); // TODO: this should be done by exfilter
    let msgs = parse_error_msg("{Reading\n"+str+"\n}"); // note: surround by {Reading ... } so that the parser understands it
    await show_text_highlight(pg, str, kind);
    if (str == "Correct"){
      pg.set_code_status('checked');
      var preview = pg.preview_el; 
      preview.replaceChildren();
    } else if (str == "Incorrect") {
      pg.set_code_status('failed');
      var preview = pg.preview_el; 
      preview.replaceChildren();
    } else if (msgs.errors.length !== 0 || msgs.warnings.length !== 0) {
      pg.set_code_status('failed');
    } else if (str.match(/:\-\s*false/) !== null) {
      pg.set_code_status('failed');
    } else {
      pg.set_code_status('checked');
    }            
  }
  pg.set_auto_action('exfilter_exercise');
}

/* Gen doc and preview */
async function gen_doc_preview(pg) {
  await gen_doc(pg);
  await preview_doc(pg);
  pg.set_auto_action('doc');
}

/* Run optimizations and preview */
async function spec_preview(pg) {
  await opt_mod(pg);
  await preview_co(pg);
  pg.set_auto_action('spec');
}

/* Toggle on-the-fly mode */
async function toggle_on_the_fly(pg) {
  // TODO: show status
  playgroundCfg.on_the_fly = !playgroundCfg.on_the_fly;
}

/* Run tests */
async function run_tests(pg) {
  if (!pg.cproc.muted) {
    pg.show_toplevel(true);
    pg.update_inner_layout();
  }
  const mod = pg.curr_mod_path();
  // await pg.upload_code_to_worker(); // TODO: do not load, just save to fs
  const pmuted = pg.cproc.set_muted(true); // TODO: mute in on_the_fly; make it optional?
  await pg.toplevel.do_query("use_module('" + mod + "')", {no_treat_outerr: true}); // TODO: this should not be needed, but sometimes (when there is some ':- test') code is not available anymore after run_tests_in_module/1, why? // (do a muted query so that code status is not affected, run_tests_in_modules does use module also
  pg.cproc.muted = pmuted;
  // await pg.cproc.muted_query_dumpout("use_module(library(unittest))"); // (done by special_query.depends)
  await pg.toplevel.do_query("run_tests_in_module('" + mod + "')", {msg:'Testing'}); // TODO: this last 'await' here should not be needed but it does not work otherwise... WHY? A problem with CiaoPromiseProxy? (JFMC)
  pg.set_auto_action('test');
}

/* Debug code (it loads the libraries needed and starts the debugger) */
async function debug(pg) {
  if (!pg.cproc.muted) {
    pg.show_toplevel(true);
    pg.update_inner_layout();
  }
  const mod = pg.curr_mod_path();
  const modname = pg.curr_mod_name();
  // TODO: make debugger work in playground
  if (!pg.debugging) {
    await pg.toplevel.do_query("display_debugged", {});
    await pg.toplevel.do_query("debug_module_source('" + modname + "')", {});
    await pg.toplevel.do_query("trace", {});
    pg.debugging = true; // change debugging status
  } else {
    await pg.toplevel.do_query("nodebug_module('" + modname + "')", {});
    await pg.toplevel.do_query("nodebug", {});
    pg.debugging = false; // change debugging status
  }
  await pg.toplevel.do_query("use_module('" + mod + "')", {});
}

/* Generate documentation */
/* (requires 'lpdoc' bundle) */
async function gen_doc(pg) {
  const modbase = pg.curr_mod_base();
  // await pg.cproc.muted_query_dumpout("clean_mods(['"+modbase+"'])"); // (timestamps do not have the right resolution)
  await pg.toplevel.do_query("doc_cmd('"+modbase+"', [], clean(intermediate))", {}); // (clean mod above is not enough)
  await pg.toplevel.do_query("doc_cmd('"+modbase+"', [], gen(html))", {msg:'Generating documentation'});
  pg.set_auto_action('doc');
}

/* Analyze and check assertions */
/* (requires 'ciaopp' bundle) */
async function acheck(pg) {
  await discard_preview(pg);
  if (!pg.cproc.muted) {
    pg.show_toplevel(true);
    pg.update_inner_layout();
  }
  const modbase = pg.curr_mod_base();
  if (pg.get_auto_action() !== 'acheck') await pg.toplevel.do_query("set_menu_flag(ana, output, off)", {});
  await pg.toplevel.do_query("auto_check_assert('"+modbase+"')", {msg:'Checking assertions'});
  pg.set_auto_action('acheck');
}
async function acheck_output(pg) { // (shows output, which can be slower)
  const modbase = pg.curr_mod_base();
  if (pg.get_auto_action() !== 'acheck_output') await pg.toplevel.do_query("set_menu_flag(ana, output, on)", {});
  await pg.toplevel.do_query("auto_check_assert('"+modbase+"')", {msg:'Checking assertions'});
  await preview_co(pg);
  pg.set_auto_action('acheck_output');
}

/* Optimize (spec) module */
/* (requires 'ciaopp' bundle) */
async function opt_mod(pg) {
  const modbase = pg.curr_mod_base();
  await pg.toplevel.do_query("auto_optimize('"+modbase+"')", {msg:'Specializing'});
  pg.set_auto_action('spec');
}

// Preview the documentation generated for the current module
async function preview_doc(pg) {
  const modbase = pg.curr_mod_base();
  var str = await pg.cproc.w.readFile(modbase+'.html/index.html');
  if (str !== null) {
    const d = extract_lpdoc_main_el(str);
    await show_lpdoc_html(pg, d);
  }
}
// Extract main div element from the html string of a LPdoc .html file
function extract_lpdoc_main_el(str) {
  let d = document.createElement('template');
  d.innerHTML = str;
  d = d.content.querySelector('.lpdoc-main');
  return d;
}
// Show LPdoc generated element d in preview (experimental: update lpdoc runnable code)
// TODO: mathjax (if enabled)
async function show_lpdoc_html(pg, d) {
  pg.show_preview('tall'); // use tall preview
  var preview = pg.preview_el; // TODO: do not change style dynamically for this preview_el
  //preview.className = 'preview-container-lpdoc';
  preview.replaceChildren();
  preview.style.fontFamily = null;
  preview.style.overflow = 'auto';
  preview.appendChild(d);
  /* enable code runnable */ // TODO: experimental!
  if (preview_pgset == null) preview_pgset = new PGSet();
  await preview_pgset.setup_runnable();
  update_dimensions();
  if (preview_pgset.cproc.state === QueryState.READY) { // TODO: schedule run?
    await preview_pgset.load_all_code();
  }
  pg.update_inner_layout();
}

// Preview _co.pl contents for the current module
async function preview_co(pg) {
  const modbase = pg.curr_mod_base();
  var str = await pg.cproc.w.readFile(modbase+'_co.pl');
  if (str !== null) {
    await show_text_preview(pg, str);
  }
}

// Show raw (no highlighted) text in a PRE environment
async function show_text(pg, d) {
  pg.show_preview('tall'); // use tall preview
  var preview = pg.preview_el; // TODO: do not change style dynamically for this preview_el
  //preview.className = 'preview-container-lpdoc';
  preview.replaceChildren();
  var el = document.createElement('pre');
  el.innerText = d;
  // TODO: use read-only editor container (with syntax highligh)
  el.className = 'lpdoc-codeblock';
  el.style.height = '100%';
  el.style.margin = '0px';
  el.style.border = null;
  el.style.borderRadius = null;
  el.style.overflowX = null;
  el.style.overflow = 'auto';
  preview.appendChild(el);
  pg.update_inner_layout();
}

// Discard preview contents and hide
async function discard_preview(pg) {
  pg.show_preview(false); 
  var preview = pg.preview_el; 
  preview.replaceChildren();
}

// Show highlighted text in a read-only editor view (playground)
async function show_text_preview(pg, d) {
  pg.show_preview('tall'); 
  var preview = pg.preview_el; 
  preview.replaceChildren();
  var el = elem_cn('div', 'editor-container'); //document.createElement('pre');
  el.style.height = '100%'; // (Needed because this is inside another div) TODO: better way?
  preview.appendChild(el);
  pg.previewEd = create_pg_editor(el, d, 'editor',  {});
  add_emacs_bindings(pg.previewEd);
  pg.previewEd.updateOptions({ readOnly: true, lineNumbers: 'off' });
  pg.update_inner_layout();
}

// Show highlighted text in a read-only editor view (for lpdoc-runnable)
async function show_text_highlight(pg, d, kind) {
  pg.show_preview('tall'); // use tall preview
  var preview = pg.preview_el; 
  preview.replaceChildren();
  var el = elem_cn('pre', 'lpdoc-codeblock');
  el.style.height = '100%';
  el.style.marginTop = '5px';
  el.style.border = null;
  el.style.borderRadius = null;
  el.style.overflowX = null;
  el.style.overflow = 'hidden'; // TODO: better way?
  preview.appendChild(el);
  var previewEd = create_pg_editor(el, d, kind, {autoresize: true}); // TODO: the reference to this editor is lost
  previewEd.updateOptions({ readOnly: true, lineNumbers: 'off' });
  pg.update_inner_layout();
}

// ---------------------------------------------------------------------------

/**
 * Guess the module name from the code (no extension, no path). It
 * checks if the module name is available in a module declaration
 * `:- module(name,...).`, otherwise uses `draft` as module name.
 *
 * @param {string} code - String containing the Prolog code to scan.
 * @returns {string} - Name of the file
 */
function guess_mod_name(code) {
  let matches = code.match(/:-\s*module\(([a-z][_a-zA-Z0-9]*)\s*,/); // (do not wait for '.')
  if (matches != null && matches.length == 2) {
    return matches[1];
  } else {
    return 'draft'; // default module name
  }
}

// ---------------------------------------------------------------------------

// [deprecated]
// /**
//  * Update URL to include the current code in the editor
//  * @param {string} value - String containing the code in the editor
//  */
// function changeUrl(value) {
//   let s = '#' + encodeURI(value);
//   history.replaceState(undefined, undefined, s);
// }

/**
 * Encode the code given in value as a playground URL
 * @returns {string} Shareable link including the code in the editor.
 */
function code_to_URL(value) {
  let url = document.URL;
  if (url.includes('#') || url.includes('?code=')) {
    // url = url.slice(0, url.indexOf('#'));
    return url; // content hasn't changed
  }
  // return url + '#' + encodeURI(value); // [deprecated]
  return url + '?code=' + encodeURIComponent(value);
}

/**
 * Extract the code given in the current document URL (null otherwise)
 */
function code_from_URL() {  
  // Code in '#' [deprecated] (legacy links)
  if (document.URL.includes('#')) {
    return decodeURI(document.location.hash.substring(1)); // (decode, without #)
  }
  // Code in ?code= param
  const params = new URLSearchParams(document.location.search);
  let code = params.get("code");
  if (code !== null) return code;
  // Code not in URL
  return null;
}

// =========================================================================== 
// Monaco Editor configuration for a Emacs mode

/* Adds some Emacs edition key bindings */
function add_emacs_bindings(editor) {
  const KM = monaco.KeyMod;
  const KC = monaco.KeyCode;

  /*
    Bindings by default:
    - Move cursor to line start (C-a)
    - Move cursor to line end (C-e)
    - Move cursor up (C-p)
    - Move cursor down (C-n)
    - Move cursor right (C-f)
    - Move cursor left (C-b)
    - Delete left character (C-h)
    - Kill selected text (C-k)
    - Insert line below (C-o)
    - Move to line (Cmd-g)
  */

  // Find key binding (C-s and C-r)
  editor.addCommandFocused(KM.WinCtrl | KC.KeyS, () => {
    editor.trigger('editor', 'actions.find');
  });
  editor.addCommandFocused(KM.WinCtrl | KC.KeyR, () => {
    editor.trigger('editor', 'actions.find');
  });

  // Select all binding (C-x C-p)
  editor.addCommandFocused(KM.chord(KM.WinCtrl | KC.KeyX, KM.WinCtrl | KC.KeyP), () => {
    // editor.getAction('editor.action.selectAll').run();
    editor.trigger('editor', 'editor.action.selectAll');
  });

  // Insert line after binding (C-m)
  editor.addCommandFocused(KM.WinCtrl | KC.KeyM, () => {
    editor.trigger('editor', 'editor.action.insertLineAfter');
  });

  // Undo binding (C-z and C-x u)
  editor.addCommandFocused(KM.WinCtrl | KC.KeyZ, () => {
    editor.trigger(null, 'undo');
  });
  editor.addCommandFocused(KM.chord(KM.WinCtrl | KC.KeyX, KC.KeyU), () => {
    editor.trigger(null, 'undo');
  });

  // Tranform selected text to upper case binding (C-x C-u)
  editor.addCommandFocused(KM.chord(KM.WinCtrl | KC.KeyX, KM.WinCtrl | KC.KeyU), () => {
    editor.trigger('editor', 'editor.action.transformToUppercase');
  });

  // Tranform selected text to lower case binding (C-x C-l)
  editor.addCommandFocused(KM.chord(KM.WinCtrl | KC.KeyX, KM.WinCtrl | KC.KeyL), () => {
    editor.trigger('editor', 'editor.action.transformToLowercase');
  });

  // Delete right word (M-d)
  editor.addCommandFocused(KM.WinCtrl | KC.KeyD, () => {
    editor.trigger(null, 'deleteWordRight');
  });

  // Page Up (M-v)
  editor.addCommandFocused(KM.chord(KC.Escape, KC.KeyV), () => {
    editor.trigger(null, 'cursorPageUp');
  });
  // Page Down (C-v)
  editor.addCommandFocused(KM.WinCtrl | KC.KeyV, () => {
    editor.trigger(null, 'cursorPageDown');
  });

  // Delete left word (M-backspace)
  editor.addCommandFocused(KM.chord(KC.Escape, KC.Backspace), () => {
    editor.trigger(null, 'deleteWordLeft');
  });

  // Comment line (M-;)
  editor.addCommandFocused(KM.chord(KC.Escape, KC.Semicolon), () => {
    editor.trigger(null, 'editor.action.commentLine');
  });
}

/* Common playground bindings */
function add_playground_bindings(editor, pg) {
  const KM = monaco.KeyMod;
  const KC = monaco.KeyCode;

  // Save file to local file-system (C-x C-s)
  editor.addCommandFocused(KM.chord(KM.WinCtrl | KC.KeyX, KM.WinCtrl | KC.KeyS), () => {
    pg.click_save_button(); // click the 'a' element
  });

  // Go to the other window (C-x o)
  editor.addCommandFocused(KM.chord(KM.WinCtrl | KC.KeyX, KC.KeyO), () => {
    pg.change_focus();
  });

  // Save and run code (C-c l)
  if (playgroundCfg.has_load_button) {
    editor.addCommandFocused(KM.chord(KM.WinCtrl | KC.KeyC, KC.KeyL), () => {
      load_code(pg).then(() => {});
    });
  }

  // Run tests in current module (C-c u)
  if (playgroundCfg.has_run_tests_button) {
    editor.addCommandFocused(KM.chord(KM.WinCtrl | KC.KeyC, KC.KeyU), () => {
      run_tests(pg).then(() => {});
    });
  }

  // Debug source code (C-c d)
  if (playgroundCfg.has_debug_button) { // debug
    editor.addCommandFocused(KM.chord(KM.WinCtrl | KC.KeyC, KC.KeyD), () => {
      debug(pg).then(() => {});
    });
  }

  // Document source code (C-c D)
  if (playgroundCfg.has_doc_button) {
    editor.addCommandFocused(KM.chord(KM.WinCtrl | KC.KeyC, KM.Shift | KC.KeyD), () => {
      gen_doc_preview(pg).then(() => {});
    });
  }

  // Analyze and check assertions (C-c V)
  if (playgroundCfg.has_acheck_button) {
    editor.addCommandFocused(KM.chord(KM.WinCtrl | KC.KeyC, KM.Shift | KC.KeyV), () => {
      acheck(pg).then(() => {});
    });
  }
}

// =========================================================================== 
// Error parser and handler

/**
 * An error.
 * @typedef {Object} Error
 * @property {string} lines - The file where the error comes from.
 * @property {string} msg - Message containing a description of the error.
 */

/**
 * A warning.
 * @typedef {Object} Warning
 * @property {string} lines - The file where the warning comes from.
 * @property {string} msg - Message containing a description of the warning.
 */

/**
 * Message parsed
 * @typedef {Object} MsgObject
 * @property {string} file - The file where the message comes from.
 * @property {Error[]} errors - Array containing all the errors found in the file.
 * @property {Warning[]} warnings - Array containing all the warnings found in the file.
 */

// Constants to distinguish between errors and warnings
const ERROR = 0;
const WARNING = 1;

/**
 * Parses the message received from the Prolog side when loading the code and returns
 * it in a sorted object.
 * @param {string} msg - Message generated when loading file.
 * @returns {MsgObject} - Object containing all the info from the message.
 */
// TODO: this parser is incomplete; it does not deal correctly with 'file'
function parse_error_msg(msgs) {
  let file = undefined;
  let warnings = [];
  let errors = [];

  const regexp = /{[^{}]*\b(WARNING|ERROR|Reading|In|Compiling|Checking|Loading)\b([^{}]+)}/g; 
  const w_regexp = /(Reading|In|Compiling|Checking|Loading)/g; 

  msgs.match(regexp)?.forEach(e =>  {
    let lines = undefined;
    let msg = undefined;    
    if (e.match(w_regexp)) {
      e.split('\n').filter(line => line.includes('WARNING') || line.includes('ERROR'))
      .forEach(line => {
	let errmsg = line.slice(line.indexOf(':') + 2);
        if (line.includes('lns')) {
          lines = errmsg.slice(errmsg.indexOf('(') + 5, errmsg.indexOf(')'));
          msg = errmsg.slice(errmsg.indexOf(')') + 2);
        } else {
          msg = errmsg;   
        }
        if (line.includes('WARNING')) {
          warnings.push({
            file: file,
            lines: lines,
            msg: msg
          });
        } else if (line.includes('ERROR')) {
          errors.push({
            file: file,
            lines: lines,
            msg: msg
          });
        } else {
          return;
        }
      });
    } else {
      const errmsg = e.slice(e.indexOf(':') + 2);
      if (e.includes('lns')) {
        lines = errmsg.slice(errmsg.indexOf('(') + 5, errmsg.indexOf(')'));
        msg = errmsg.slice(errmsg.indexOf(')') + 2, errmsg.indexOf('}') - 1);
      } else {
        msg = errmsg.slice(0, errmsg.indexOf('}') - 1);  
      }
      if (e.includes('WARNING')) {
        warnings.push({
          file: file,
          lines: lines,
          msg: msg
        });
      } else if (e.includes('ERROR')) {
        errors.push({
          file: file,
          lines: lines,
          msg: msg
        });
      }         
    }
  });
    
  return { warnings: warnings, errors: errors };
}

/**
 * Generates an array containing all the needed markers for Monaco (only for the input file).
 * @param {MsgObject} msgs - Object containing warnings and errors from the file.
 * @returns {monaco.editor.IMarkerData[]} - Array containing markers for Monaco.
 */
function create_markers(file, msgs) {
  let markers = [];
  add_markers(file, msgs.errors, markers, ERROR);
  add_markers(file, msgs.warnings, markers, WARNING);
  return markers;
}

/**
 * Loops through the elements of the `array` to add the content to `markers` in 
 * the right format.
 * @param {Error[]|Warning[]} array - Array of Error or Warning with the elements to loop.
 * @param {monaco.editor.IMarkerData[]} markers - Array of markers to be filled.
 * @param {number} type - Especifies whether it is an Error or a Warning.
 */
function add_markers(file, array, markers, type) {
  // loop all array
  array.forEach(e => {
    if (e.file !== undefined && e.file !== file) return; // not this file
    if (e.lines === undefined) return; // general error (no lines defined)

    // lines parameter defined as: 'startLine-endLine'
    let startLine = e.lines.slice(0, e.lines.indexOf('-'));
    let endLine = e.lines.slice(e.lines.indexOf('-') + 1);

    // add to the markers array
    markers.push({
      severity: (type === ERROR) ? monaco.MarkerSeverity.Error : monaco.MarkerSeverity.Warning,
      startLineNumber: parseInt(startLine),
      startColumn: 0,
      endLineNumber: parseInt(endLine),
      endColumn: 1000,
      message: e.msg
    });
  });
};

/* =========================================================================== */
/* Comint (for interacting with a ToplevelProc) */

class Comint {
  constructor(container, pg, opts) {
    this.vis = new Vis(); // visibility state

    this.prompt = '?- ';
    this.promptval = ' ? ';
    this.single_query_output = ( opts.onequery === true ? true : false ); // clean output for each query

    this.with_prompt = ( opts.noprompt === true ? false : true ); // interactive
    this.echo_el = elem_cn('span', 'comint-echo'); /* see enable_response */
    this.pg = pg; // associated pgcell
    this.needs_clean_output = true; // queue an output clean
    this.#reset_ring();

    let comint_editor_el = elem_cn('div', 'comint-editor-container');
    //
    const linebtn = (title, text, cmd) => {
      return btn('comint-button', title, text, () => {
        this.#send_line(cmd).then(()=>{});
      });
    }
    this.next_button = linebtn("Next solution", "Next", ';');
    this.stop_button = linebtn("Stop query", "Stop", '');
    this.abort_button = btn('comint-button', "Abort query", "&#10005; Abort", () => {
      const cproc = this.pg.cproc;
      cproc.abort().then(() => {});
    });
    this.abort_button.classList.add('comint-button-abort');
    //
    this.creep_button = linebtn("Continue execution", "Creep", 'c');
    this.leap_button = linebtn("Continue until next spypoint", "Leap", 'l');
    this.skip_button = linebtn("Skip children calls", "Skip", 's');
    this.retry_button = linebtn("Retry this call", "Retry", 'r');
    this.fail_button = linebtn("Force failure", "Fail", 'f');
    //
    this.control_el = elem_cn('div', 'comint-control');
    this.control_el.appendChild(this.next_button);
    this.control_el.appendChild(this.stop_button);
    this.control_el.appendChild(this.creep_button);
    this.control_el.appendChild(this.leap_button);
    this.control_el.appendChild(this.skip_button);
    this.control_el.appendChild(this.retry_button);
    this.control_el.appendChild(this.fail_button);
    this.control_el.appendChild(this.echo_el);
    this.control_el.appendChild(this.abort_button);
    this.control_el.style.display = "none"; // (hidden by default)
    //
    container.replaceChildren();
    container.appendChild(comint_editor_el);
    container.appendChild(this.control_el);

    this.editor = create_pg_editor(comint_editor_el, '{...}', 'toplevel', opts);
    if (!this.with_prompt) this.editor.updateOptions({ readOnly: true });
    this.set_keymap();
  }

  /* ---------------------------------------------------------------------- */

  /* Update layout of editors */
  update_dimensions() {
    this.editor.layout();
  }

  /* Update (internal) layout (incrementally) */
  update_inner_layout() {
    // Display/hide buttons based on query state
    //  - "Abort query" if QueryState.RUNNING
    //  - "Next" and "Stop" if QueryState.VALIDATING
    //  - Debug buttons if QueryState.DBGTRACE
    const cproc = this.pg.cproc;
    // TODO: when debugging is activated, replace abort by 'stop' (as C-c)
    this.vis.set('abort_button', (cproc !== undefined && cproc.state === QueryState.RUNNING));
    this.vis.set('nextstop_btns', (cproc !== undefined && cproc.state === QueryState.VALIDATING));
    this.vis.set('debug_btns', (cproc !== undefined && cproc.state === QueryState.DBGTRACE));
    this.vis.inc_update('abort_button', (st) => {
      this.abort_button.style.display = st ? "inline-block" : "none";
    });
    this.vis.inc_update('nextstop_btns', (st) => {
      this.next_button.style.display = st ? "inline-block" : "none";
      this.stop_button.style.display = st ? "inline-block" : "none";
    });
    this.vis.inc_update('debug_btns', (st) => {
      this.creep_button.style.display = st ? "inline-block" : "none";
      this.leap_button.style.display = st ? "inline-block" : "none";
      this.skip_button.style.display = st ? "inline-block" : "none";
      this.retry_button.style.display = st ? "inline-block" : "none";
      this.fail_button.style.display = st ? "inline-block" : "none";
    });
    // Show control button menu if needed
    this.vis.set('control', (this.vis.get('abort_button') || this.vis.get('nextstop_btns') || this.vis.get('debug_btns')));
    this.vis.inc_update('control', (st) => {
      this.#show_control(st);
    });
  }

  #show_control(st) {
    if (st) { // show control
      if (this.control_show_timer !== undefined) return;
      // show control after a brief delay
      this.control_show_timer = setTimeout(() => {
        this.control_el.style.display = "inline-block";
        setTimeout(() => { // then reveal toplevel end line after a delay // TODO: better way?
          this.reveal_end();
        }, 0);
        this.update_dimensions();
      }, 100);
    } else { // hide control
      if (this.control_show_timer !== undefined) {
        clearTimeout(this.control_show_timer); // cancel timeout
        this.control_show_timer = undefined;
      }
      if (this.control_el.style.display !== "none") {
        this.control_el.style.display = "none";
        this.update_dimensions();
      }
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Current input query */

  /* Get the current query text (removing the prompt mark) */
  #current_input() {
    let line = this.editor.getPosition().lineNumber;
    let content = this.editor.getModel().getLineContent(line);

    if (content.slice(0, this.prompt.length) === this.prompt) { // normal single line query
      return content.slice(this.prompt.length);
    } else {
      if (content.slice(-1) === '.') { // several line query
        // obtain code from prompt to '.'
        line--;
        while (line !== 0 && content.slice(0, this.prompt.length) !== this.prompt) {
          content = this.editor.getModel().getLineContent(line) + '\n' + content;
          line--;
        }
        return content.slice(3);
      } else {
        return content;
      }
    }
  }

  /* Get the current solution validation text */
  #current_inputVal() {
    let line = this.editor.getPosition().lineNumber;
    if (line !== this.editor.getModel().getLineCount()) {
      return ''; // Like 'Enter' if not the last line
    } else { // Whatever comes after the last ' ? ' in the line (promptval)
      let text = this.editor.getModel().getLineContent(line);
      let i = text.lastIndexOf(this.promptval);
      if (i === -1) {
        return ''; // TODO: promptval not found, just ''?
      } else {
        return text.slice(i + this.promptval.length);
      }
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Output (basic) */

  /* Clear comint output */
  clear_output() {
    this.editor.getModel().setValue("");
    this.needs_clean_output = false;
  }
  /* Write at the end of the current editor position */
  display(text) {
    this.move_to_end();
    var p = this.editor.getPosition();
    var ro = this.editor.getRawOptions().readOnly;
    if (ro) this.editor.updateOptions({ readOnly: false }); // TODO: better way?
    this.editor.trigger('keyboard', 'type', {
      text: text
    });
    if (ro) this.editor.updateOptions({ readOnly: ro });
  }
  /* Moves cursor to the end */
  move_to_end() {
    const nLines = this.editor.getModel().getLineCount();
    this.editor.setPosition({
      lineNumber: nLines,
      column: this.editor.getModel().getLineLength(nLines) + 1
    });
  }
  /* Moves cursor to the end of first line */
  move_to_first_line_end() {
    this.editor.setPosition({
      lineNumber: 1,
      column: this.editor.getModel().getLineLength(1) + 1
    });
  }
  /* Reveal the beginning of the editor */
  reveal_first() {
    this.editor.revealLine(1);
  }
  /* Reveal the end of the editor (scrolling down) */
  reveal_end() {
    this.editor.revealLine(this.editor.getModel().getLineCount());
  }

  /* Clear all text before the current line */
  clear_text_above() {
    let text = this.#current_input();
    this.clear_output();
    this.#add_prompt();
    this.display(text);
  }

  /* ---------------------------------------------------------------------- */
  /* Output (derived) */

  print_out(str) {
    this.display(str);
  }
  print_sol(str) {
    this.display('\n'+str);
  }
  print_msg(str) {
    this.display(str);
  }

  /* ---------------------------------------------------------------------- */
  /* Output (for interactive) */

  #add_prompt() {
    this.display(this.prompt);
  }
  print_prompt() {
    /* Clean output if needed, write the prompt, move to end */
    if (this.needs_clean_output) {
      this.clear_output();
    }
    this.pg.mark_srcdbg_info(null); /* TODO: better place? */
    if (!this.with_prompt) return; /* (skip in non-interactive) */
    this.#add_prompt();
  }
  print_promptval() {
    if (!this.with_prompt) return; /* (skip in non-interactive) */
    this.display(this.promptval);
  }
  display_status(str) { // toplevel:display_status/1
    if (!this.with_prompt) return; /* (skip in non-interactive) */
    if (str === 'silent') return; /* skip this status */
    this.display('\n');
    this.display(str);
    if (!this.single_query_output) this.display('\n');
  }
  display_status_new_prompt(str) { /* show status and a new prompt */
    this.display_status(str);
    if (this.single_query_output) {
      this.move_to_first_line_end();
      this.reveal_first();
    } else {
      this.print_prompt();
      // this.reveal_end(); // TODO: needed?
    }
  }
  set_log(text) {
    const e = this.echo_el;
    if (e !== null) {
      e.className = 'comint-echo';
      e.classList.add(text === '' ? 'comint-echo-hidden' : 'comint-echo-running');
      e.innerHTML = text === '' ? '' : text+' ...';
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Command ring (input) */

  /* Reset/initialize input ring. */
  #reset_ring() {
    this.ring = [''];
    this.ringCurr = 0;
  }

  /* Add text to the ring array containing previous queries done by the user. */
  #ring_push(text) {
    this.ring.push('');
    this.ringCurr = this.ring.length - 1;
    this.ring[this.ringCurr - 1] = text;
    //
    this.outputMarker = text; // TODO: always called after #ring_push, is it OK here?
  }

  /* Move through previous queries. It writes the previous query, if any. */
  #ring_up() {
    if (this.ringCurr === 0) { // No more ring
      return;
    }
    let curr = this.#current_input();
    if (this.ringCurr === this.ring.length - 1) { // Save current edit
      this.ring[this.ringCurr] = curr;
    }
    this.ringCurr--;
    if (curr === '' || curr === this.outputMarker) {
      this.outputMarker = this.ring[this.ringCurr];
      this.#delete_curr_query(); // delete query at the current line
      this.display(this.ring[this.ringCurr]);
    } else {
      return;
    }
  }

  /* Move through previous queries. It goes down to next query, if any. */
  #ring_down() {
    if (this.ringCurr >= this.ring.length - 1) { // No more elements
      return;
    }
    this.ringCurr++;

    if (this.#current_input() === this.outputMarker) {
      this.outputMarker = this.ring[this.ringCurr];
      this.#delete_curr_query(); // delete query at the current line
      this.display(this.ring[this.ringCurr]);
    }

    if (this.ringCurr === this.ring.length - 1) {
      // Clear current edit (only for saving memory)
      this.ring[this.ringCurr] = "";
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Other movement */

  /* Avoid moving the cursor to the prompt. */
  #treat_line_start() {
    let lineNumber = this.editor.getPosition().lineNumber;
    this.editor.setPosition({
      lineNumber: lineNumber,
      column: (this.editor.getModel().getLineContent(lineNumber).slice(0, this.prompt.length) === this.prompt) ? this.prompt.length+1 : 0
    });
  }

  /* Avoid moving the cursor to the prompt. */
  #treat_left_arrow() {
    let actualPos = this.editor.getPosition();
    if (actualPos.column == this.prompt.length+1 &&
        this.editor.getModel().getLineContent(actualPos.lineNumber).slice(0, this.prompt.length) === this.prompt) {
      return;
    } else {
      this.editor.setPosition({
        lineNumber: actualPos.lineNumber,
        column: actualPos.column - 1
      });
    }
  }

  /* ---------------------------------------------------------------------- */

  /* Enter is pressed (get input and treat it) */
  async treat_enter() {
    const cproc = this.pg.cproc;
    if (!cproc.check_not_running()) return;
    if (cproc.comint !== this) {
      // Deal with previously running queries (not in this comint)
      await this.#ensure_no_pending_query();
    }
    let text;
    if (cproc.is_waiting_for_line()) {
      text = this.#current_inputVal();
      this.display('\n');
      this.reveal_end();
    } else {
      text = this.#current_input();
      // if (text === '') return; // TODO: make it optional? disallow empty prompt lines
      if (text !== '') this.#ring_push(text); // Add to ring if not empty
      if (this.single_query_output) { // only one query at a time in output
        this.clear_output();
        this.#add_prompt();
        if (text === '') {
          // do nothing
        } else {
          // clean output
          this.display(text);
          this.display('\n');
          this.reveal_end();
        }
      } else {
        // Duplicate text if input is not from last line
        if (this.editor.getPosition().lineNumber !== this.editor.getModel().getLineCount()) {
          this.display(text);
        }
        this.display('\n');
        this.reveal_end();
      }
    }
    await this.#treat_enter_(text);
  }

  async #treat_enter_(text) {
    const cproc = this.pg.cproc;
    if (cproc.is_waiting_for_line()) {
      if (!cproc.check_not_locked(this)) return; // TODO: not possible?
      await cproc.send_line(this, text);
    } else {
      // Perform query
      if (text === '') {
        if (!this.single_query_output) { // show prompt again
          this.print_prompt();
          this.reveal_end(); // scroll down
        }
      } else {
        if (text.slice(-1) !== '.') { // query is malformed
          this.display(`\
{SYNTAX ERROR: Malformed query. It must end with a period.}
{NOTE: Press Shift+Enter to continue a query in the next line.}
`);
          this.display_status_new_prompt('silent');
        } else {
          let q = text.slice(0, -1);
          await cproc.run_query(this, q, {});
        }
      }
    }
  }

  // Cancel any query pending for validation of debugging
  async #ensure_no_pending_query() {
    const cproc = this.pg.cproc;
    if (cproc.state === QueryState.VALIDATING) { // If validating, just accept and continue
      // TODO: do this in the ciao-emacs mode? or remove this feature?
      await cproc.comint.#send_line('');
    }
    if (cproc.state === QueryState.DBGTRACE) {
      // await cproc.comint.#send_line('a'); // abort // TODO: fix 'abort' (it should not end the engine)
      // workaround: leap and try ending the query gracefully
      await cproc.comint.#send_line('l');
      await this.#ensure_no_pending_query();
    }
  }

  /* ---------------------------------------------------------------------- */

  /* Emacs key bindings and custom for comint */
  set_keymap() {
    // Constants
    const KM = monaco.KeyMod;
    const KC = monaco.KeyCode;

    add_emacs_bindings(this.editor);

    if (this.with_prompt) {
      // Ring up (up arrow)
      this.editor.addCommandFocused(KC.UpArrow, () => {
        this.#ring_up();
      });
      // Ring up (C-p)
      this.editor.addCommandFocused(KM.WinCtrl | KC.KeyP, () => {
        this.#ring_up();
      });
      // Ring down (down arrow)
      this.editor.addCommandFocused(KC.DownArrow, () => {
        this.#ring_down();
      });
      // Ring down (C-n)
      this.editor.addCommandFocused(KM.WinCtrl | KC.KeyN, () => {
        this.#ring_down();
      });
      // Clean screen (C-l)
      this.editor.addCommandFocused(KM.WinCtrl | KC.KeyL, () => {
        this.clear_text_above();
      });
      // Move cursor to the beginning of line, avoid the prompt
      this.editor.addCommandFocused(KM.WinCtrl | KC.KeyA, () => {
        this.#treat_line_start();
      });
      // Move left, avoid the prompt
      this.editor.addCommandFocused(KC.LeftArrow, () => {
        this.#treat_left_arrow();
      });
      // Treat the enter binding to run the written query (Enter)
      this.editor.addCommandFocused(KC.Enter, () => {
        this.treat_enter().then(() => {});
      });
      // Other playground commands
      add_playground_bindings(this.editor, this.pg);
    }

    // Abort running query (C-c C-c)
    this.editor.addCommandFocused(KM.chord(KM.WinCtrl | KC.KeyC, KM.WinCtrl | KC.KeyC), () => {
      const cproc = this.pg.cproc;
      if (cproc.state === QueryState.RUNNING) {
        this.display('C-c C-c\n');
        cproc.abort().then(() => {});
      }
    });
  }

  /* ---------------------------------------------------------------------- */

  /* Go to the end of the current line */
  // TODO: unused?
  #go_to_line_end() {
    let line = this.editor.getPosition().lineNumber;
    let length = this.editor.getModel().getLineLength(line); // length of the line

    this.editor.setPosition({
      lineNumber: line,
      column: length + 1
    });
  }

  /**
   * Get line with the closest prompt.
   * @returns {number} Number of the closest line with the prompt.
   */
  #get_line_with_prompt() {
    const currentLine = this.editor.getPosition().lineNumber;
    if (this.editor.getModel().getLineContent(currentLine).slice(0, this.prompt.length) === this.prompt) {
      return currentLine;
    } else {
      let lineWithPrompt = currentLine - 1;
      while (lineWithPrompt !== 0 && 
          this.editor.getModel().getLineContent(lineWithPrompt).slice(0, this.prompt.length) !== this.prompt) {
        lineWithPrompt--;
      }
      return lineWithPrompt;
    }
  }

  /* ---------------------------------------------------------------------- */

  /* Delete text at the current prompt */
  #delete_curr_query() {
    if (this.single_query_output) { // only one query at a time in output
      this.clear_output();
      this.#add_prompt();
    } else {
      // Discard the current query content (if any)
      this.move_to_end();
      let line = this.editor.getPosition().lineNumber;
      this.editor.executeEdits('', [{
        range: new monaco.Range(this.#get_line_with_prompt(), 4, line + 1, 1),
        text: null
      }]);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Queries and validation */

  /* Send validation or dbgcmd text */
  async #send_line(text) {
    const cproc = this.pg.cproc;
    if (!cproc.is_waiting_for_line()) {
      console.log('bug: not validating/debugging');
      return;
    }
    if (!cproc.check_not_locked(this)) return; // TODO: not possible?
    this.display(text);
    this.display('\n');
    this.reveal_end();
    await cproc.send_line(this, text);
  }

  /* Send a query (optionally) printing it */
  /*  - opts.msg (optional): log message */
  async do_query(q, opts) {
    const cproc = this.pg.cproc;
    if (cproc.state === QueryState.RUNNING) {
      console.log('bug: already running'); // TODO: treat_enter too fast?
      return; // TODO: query is lost!
    }
    await this.#ensure_no_pending_query();
    //
    if (this.with_prompt && !cproc.muted) this.#add_query(q);
    await cproc.run_query(this, q, opts);
  }

  /**
   * Add query to output (like if the user wrote it)
   */
  #add_query(q) {
    let text = q + ".";
    this.#ring_push(text); // Add to ring // TODO: make optional
    this.#delete_curr_query();
    this.display(text);
    this.display('\n');
    this.reveal_end();
  }
}

// Console based Comint (reduced functionality)
class ConsoleComint {
  constructor(pg) {
    this.pg = pg; // associated pgcell
    this.with_prompt = false;
  }
  set_log(str) {
    if (str == '') return;
    console.log('[LOG: '+str+']');
  }
  //
  update_dimensions() {}
  update_inner_layout() {}
  //
  display_status_new_prompt(str) {}   
  print_promptval() {}
  //
  print_out(str) {
    console.log(str);
  }
  print_sol(str) {
    console.log('\n'+str);
  }
  print_msg(str) {
    console.log(str);
  }
  // async #send_line(text) // (not yet)
}

// ===========================================================================
/* Code persistence (in web local storage) */

/**
 * Obtain the value of the item with the key `code`, containing the
 * most recent code stored in the local storage.
 * @return {string} - Latest code stored in the local storage or null if it is
 * empty or there was an error.
 */
function pers_get_code() {
  const k = playgroundCfg.storage_key;
  if (k === null) return null;
  try {
    return window.localStorage.getItem(k);
  } catch (e) {
    // Swallow up any security exceptions...
    return null;
  }
}

/**
 * Store the `value` passed as a parameter in the key `code` in the
 * local storage.
 * @param {string} value - Code to store in the local storage
 * @returns {boolean} - True if it was stored correctly or false if there was an 
 * error.
 */
function pers_set_code(value) {
  const k = playgroundCfg.storage_key;
  if (k === null) return true;
  try {
    window.localStorage.setItem(k, value);
    return true;
  } catch (e) {
    // Swallow up any security exceptions...
    return false;
  }
}

/**
 * Delete the item `code` in the local storage.
 * @returns {boolean} - True if it was stored correctly or false if there was an
 * error.
 */
function pers_remove_code() {
  const k = playgroundCfg.storage_key;
  if (k === null) return true;
  try {
    window.localStorage.removeItem(k);
    return true;
  } catch (e) {
    // Swallow up any security exceptions...
    return false;
  }
}

// ---------------------------------------------------------------------------
// Set of playground cells

class PGSet {
  constructor() {
    this.cells = [];
    this.cproc = new ToplevelProc(urlPREFIX+'/ciao/'); // (shared)
  }

  async setup(base_el, text) { // standalone playground
    // Show splash screen? As heuristic, we do this only if editor
    // value is the same as the splash_code. Otherwise we assume
    // that the user is already programming and do not need it.
    if (text === playgroundCfg.splash_code) {
      show_splash(base_el);
    }
    let i = 0;
    let cell_data = { kind:'full', focus:text };
    this.cells[i] = new PGCell(this.cproc);
    await this.cells[i].setup(base_el, cell_data, this);
  }

  async setup_runnable() { // playground cells for an LPdoc document
    let i = 0;
    for (let node of [...document.getElementsByClassName("lpdoc-codeblock-runnable")]) {
      let txt = node.innerText;
      // TODO: we need to ammend wrong double quotes generated from LPdoc code code blocks (fix in lpdoc!)
      txt = txt.replace(/\u201D/g, "''"); // &rdquo;
      //
      const cell_data = scan_runnable(txt);
      cell_data.modname = "code_"+i;
      const el = document.createElement('div');
      node.replaceWith(el);
      this.cells[i] = new PGCell(this.cproc);
      await this.cells[i].setup(el, cell_data, this);
      i += 1;
    }
  }

  // Update layout of editors
  update_dimensions() {
    for (const x of this.cells) {
      x.update_dimensions();
    }
  }

  async load_all_code() {
    for (const x of this.cells) {
      if (x.cell_data !== undefined && x.cell_data.kind == 'code') {
        await x.with_response(load_code);
      }
    }
  }
}

function scan_runnable(text) {
  let cell_data = {};
  // TODO: ugly regexp based solution, syntax is fixed
  // hint+solution regexp
  const re_hs = /(.*)^%![\s]*\\begin{hint}(.*)^%![\s]*\\end{hint}[\s]*^%![\s]*\\begin{solution}(.*)^%![\s]*\\end{solution}[\s]*(.*)/sgm;
  // focus regexp
  const re_f = /(.*)^%![\s]*\\begin{focus}(.*)^%![\s]*\\end{focus}[\s]*(.*)/sgm;
  // miniplayground regexp
  const re_mp = /(.*)^%![\s]*\\begin{miniplayground}(.*)^%![\s]*\\end{miniplayground}[\s]*(.*)/sgm;
  // query regexp
  //const re_q = /(.*)^%![\s]*\\begin{query}[\s]*\?-[\s]*(.*)^%![\s]*\\end{query}[\s]*(.*)/sgm;
  const re_q = /[\s]*\?-[\s]*(.*)/sgm;
  // jseval regexp
  const re_jse = /(.*)^%![\s]*\\begin{jseval}(.*)^%![\s]*\\end{jseval}[\s]*(.*)/sgm;
  // dynpreview regexp
  const re_dynpreview = /(.*)^%![\s]*\\begin{dynpreview}(.*)^%![\s]*\\end{dynpreview}[\s]*(.*)/sgm;
  // exfilter exercises
  const re_exfilter_ex = /(.*)^%![\s]*\\begin{code}(.*)^%![\s]*\\end{code}[\s]*^%![\s]*\\begin{opts}(.*)^%![\s]*\\end{opts}[\s]*^%![\s]*\\begin{solution}(.*)^%![\s]*\\end{solution}[\s]*(.*)/sgm;
  // exfilter
  const re_exfilter = /(.*)^%![\s]*\\begin{code}(.*)^%![\s]*\\end{code}[\s]*^%![\s]*\\begin{opts}(.*)^%![\s]*\\end{opts}[\s]*(.*)/sgm;
  //  
  let match;
  match = re_hs.exec(text);
  if (match !== null) {
    cell_data.kind = 'exercise';
    cell_data['preamble'] = match[1].trim();
    cell_data['hint'] = match[2].trim();
    cell_data['solution'] = match[3].trim();
    cell_data['postamble'] = match[4].trim();
    return cell_data;
  }
  match = re_f.exec(text);
  if (match !== null) {
    cell_data.kind = 'code';
    cell_data['preamble'] = match[1].trim();
    cell_data['focus'] = match[2].trim();
    cell_data['postamble'] = match[3].trim();
    return cell_data;
  }
  match = re_exfilter_ex.exec(text);
  if (match !== null) {
    cell_data.kind = 'exfilterex';
    cell_data['preamble'] = match[1].trim(); 
    cell_data['focus'] = match[2].trim();
    cell_data['opts'] = match[3].trim();
    cell_data['solution'] = match[4].trim();
    cell_data['postamble'] = match[5].trim();
    return cell_data;
  }
  match = re_exfilter.exec(text);
  if (match !== null) {
    cell_data.kind = 'exfilter';
    cell_data['preamble'] = match[1].trim(); 
    cell_data['focus'] = match[2].trim();
    cell_data['opts'] = match[3].trim();
    cell_data['postamble'] = match[4].trim();
    return cell_data;
  }
  match = re_mp.exec(text);
  if (match !== null) {
    cell_data.kind = 'miniplayground';
    cell_data['preamble'] = match[1].trim();
    cell_data['focus'] = match[2].trim();
    cell_data['postamble'] = match[3].trim();
    return cell_data;
  }
  match = re_jse.exec(text);
  if (match !== null) {
    cell_data.kind = 'jseval';
    //cell_data['preamble'] = match[1].trim();
    cell_data['jscode'] = match[2].trim();
    //cell_data['postamble'] = match[3].trim();
    return cell_data;
  }
  match = re_dynpreview.exec(text); // (expand as jseval)
  if (match !== null) {
    cell_data.kind = 'jseval';
    cell_data['jscode'] = "async(pg) => { await pg.setup_dynpreview("+match[2].trim()+"); }";
    return cell_data;
  }
  match = re_q.exec(text);
  if (match !== null) {
//    cell_data['preamble'] = match[1].trim();
//    cell_data['query'] = match[2].trim();
//    cell_data['postamble'] = match[3].trim();
    cell_data.kind = 'query';
    cell_data['query'] = match[1].trim();
    return cell_data;
  }
  // Assume all is the hint
  cell_data.kind = 'code';
  cell_data['preamble'] = '';
  cell_data['focus'] = text;
  cell_data['postamble'] = '';
  return cell_data;
}

// ===========================================================================
// Setup mathjax (dynamically)

// TODO: integrate or move closer to lpdoc.js?

function setup_mathjax() {
  window.MathJax = {
    tex: {
      inlineMath: [['$', '$']],
      macros: {
        infin: "{\\infty}",
        empty: "{\\emptyset}"
      }
    },
    options: {
      renderActions: {
        /* add a new named action not to override the original 'find' action */
        find_script_mathtex: [10, function (doc) {
          for (const node of document.querySelectorAll('script[type^="math/tex"]')) {
            const display = !!node.type.match(/; *mode=display/);
            const math = new doc.options.MathItem(node.textContent, doc.inputJax[0], display);
            const text = document.createTextNode('');
            node.parentNode.replaceChild(text, node);
            math.start = { node: text, delim: '', n: 0 };
            math.end = { node: text, delim: '', n: 0 };
            doc.math.push(math);
          }
        }, '']
      }
    }
  };
  
  (function() {
    let script = document.createElement('script');
    script.src = urlPREFIX+'/node_modules/mathjax/es5/tex-svg.js';
    script.async = true;
    document.head.appendChild(script);
  })();
}

// ===========================================================================
// UI - cover window

// A cover div (just in case it needs time to load).  There is a fade
// in animation (see CSS for 'covermsg') so that quick loads are not
// disturbed by messages.

var cover_div = null;

function show_cover() {
  window.addEventListener('DOMContentLoaded', (event) => {
    cover_div = elem_from_str("<div id='cover'><span id='covermsg'>Loading ... This can take a few minutes on slow connections.</span></div>");
    document.body.appendChild(cover_div);
  });
}
function hide_cover() {
  if (cover_div !== null) {
    cover_div.remove();
    cover_div = null;
  }
}

// ===========================================================================
// UI - splash modal dialog

function show_splash(base_el) {
  modal_alloc(base_el);
  const m = modal_elm();
  m.replaceChildren();
  const key_handler = (e) => {
    if (e.keyCode == 27 || e.keyCode == 32 || e.keyCode == 13 || e.keyCode == 81) {
      close_modal();
    }
  };
  const close_modal = () => {
    modal_visible(false);
    m.replaceChildren();
    window.removeEventListener('keydown', key_handler);
  };
  window.addEventListener('keydown', key_handler);
  //
  const splash = elem_from_str(`
<div style='padding: 24px;'>
<img src="/playground/images/ciao.png"
     style="display:block; margin-left:auto; margin-right:auto;"
     height="64px"
     alt="Ciao logo">
<h2 style='text-align:center'>Welcome to the Ciao Prolog Playground!</h2>

<p><a href="/"><b>Ciao</b></a> is a modern <b>Prolog</b> system
designed to write safe, correct, and efficient Prolog programs. You can
use this code <b>playground</b> to learn more about it.</p>

<p>Under the hood, a <a href="/ciao/build/doc/ciao.html/"><b>richly featured</b></a> Ciao system compiled to <a
href="https://en.wikipedia.org/wiki/WebAssembly"><b>WebAssembly</b></a>
is running fully locally inside your browser!</p>
</div>
`);
  // Big close button
  const el = btn('big-button', "Start Coding", "Start Coding", () => {
    close_modal();
  });
  const btn_w = elem_cn('div', 'big-button-wrapper');
  btn_w.appendChild(el);
  splash.appendChild(btn_w);
  const disclaimer = elem_from_str(`
<div class="disclaimer">
Please consult the current playground <a
href="/ciao/build/doc/ciao_playground.html/ciao_playground_using.html#Current%20playground%20limitations">limitations</a> and
consider <a href="/install.html">native installation</a> if needed.
</div>`);
  splash.appendChild(disclaimer);
  //
  m.appendChild(splash);
  modal_visible(true);
}

// ===========================================================================
// UI - Playground header

/* Header (with top-right menu) */
function setup_header(base_el) {
  let header_el = elem_cn('div', 'header');
  let right_header_el = elem_cn('ul', 'right-header');
  header_el.appendChild(right_header_el);
  /* assume / points to https://ciao-lang.org */
  header_el.appendChild(elem_from_str(`\
    <div class="title">
      <a href="/">
        <img id="logo" src="/playground/images/ciao.png" alt="Ciao logo">
      </a>
      <h1>${playgroundCfg.title}</h1>
    </div>`));
  base_el.appendChild(header_el);

  const theme_button = new_theme_button(right_header_el);
  theme_button.highlight(theme_get_value());

  function a(href, text) {
    const el0 = document.createElement('li');
    const el = document.createElement('a');
    el.href=href;
    el.appendChild(text);
    el0.appendChild(el);
    return el0;
  }
  // right_header_el.appendChild(a("/ciao/build/doc/ciao_playground.html/", "Manual"));
  right_header_el.appendChild(a("/ciao/build/doc/ciao_playground.html/ciao_playground_embedding.html", document.createTextNode("Embed")));
  right_header_el.appendChild(a("/ciao/build/doc/ciao.html/", document.createTextNode("Docs")));
  right_header_el.appendChild(a("/ciao/build/doc/ciao_playground.html/ciao_playground_using.html", help_svg.cloneNode(true)));
  if (playgroundCfg.with_github_stars) {
    setup_github_stars(right_header_el);
  } else {
    right_header_el.appendChild(a("https://github.com/ciao-lang/ciao", github_svg.cloneNode(true)));
  }
}

// ===========================================================================

var pgset = null; // (collection of playgrounds for this document)
var preview_pgset = null; // (experimental for lpdoc preview)

// Update editor dimensions (do not use monaco automaticLayout!)
function update_dimensions() {
  if (preview_pgset !== null) preview_pgset.update_dimensions();
  if (pgset !== null) pgset.update_dimensions();
}
window.addEventListener("resize", update_dimensions);

if (lpdocPG === 'runnable') setup_mathjax();
if (lpdocPG === 'playground') show_cover();

window.onload = function () {
  if (lpdocPG === 'playground') hide_cover();
  // Set CSS theme as soon as possible to avoid flickering
  // Editor theme is selected on creation. It will be updated if needed.
  update_theme_hook();

  if (lpdocPG !== 'raw') {
    pgset = new PGSet();
    (async() => {
      if (lpdocPG === 'runnable') { // LPdoc with runnable code
        await pgset.setup_runnable();
      } else { // Full playground
        const base_el = document.body;
        const text = await initial_editor_value();
        await pgset.setup(base_el, text);
      }
      update_dimensions();
    })();
  }
};
