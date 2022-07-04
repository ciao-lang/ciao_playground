# The Ciao Playground

This bundle implements the Ciao Playground. It supports local
(browser-side) execution of Ciao code based on `ciaowasm` and offers a
code edition based on the [Monaco
Editor](https://microsoft.github.io/monaco-editor/) component.

`ciaowasm` is a Ciao engine compiled to the WebAssembly platform using
[Emscripten](https://emscripten.org), together with a JavaScript
client layer.

## Build instructions

Steps to build this bundle:

 - Install the `ciaowasm` bundle (see `ciaowasm/README.md`)
 - Install external dependencies: `ciao custom_run ciao_playground fetch_externals`
   (which use [NPM](https://www.npmjs.com/))
 - Prepare and pack bundles at the `build/site/` area:
```
ciao install --grade=wasm ciaowasm # (if not done before)
ciao install --grade=wasm core
ciao install --grade=wasm builder
ciao install --grade=wasm ciaodbg
ciao install ciao_playground # (wasm grade not needed)
```
 - Finish the distribution at `build/site/`:
```
ciao custom_run ciao_playground dist
```

You may use the `build.sh` to automate all the steps.

## Usage 

Use `ciao-serve-mt` (`ciao-serve` will not work, see **NOTE** below)
expose the current workspaces to the web server and browse
`http://localhost:8001/playground/`.

**NOTE**: Loading WASM-based applications from single threaded HTTP
servers seem to cause deadlocks in some browsers (it is not our
fault). The `ciao-serve-mt` module wraps a Python3 multi-threaded HTTP
server (which seems to work properly) with a `ciao-serve`-like
interface.

> **NOTE**: When developing, it is sometimes convenient to [bypass your
cache](https://en.wikipedia.org/wiki/Wikipedia:Bypass_your_cache).

## Documentation

This bundle includes an LPdoc [user's manual](doc/reference/) available
as the `ciao_playground` manual (use `ciao build --docs ciao_playground`
to (re)generate it). Browse 
http://localhost:8001/ciao/build/doc/ciao_playground.html to view it.

JavaScript code is documented separatelly using
[JSDoc](https://jsdoc.app). You may generate it using:
```
cd src/; jsdoc -c jsdoc-conf.json
```
The HTML documentation is generated in the `doc-js/` folder.
Install `jsdoc` with `npm install -g jsdoc` (or `npm install
--save-dev jsdoc` locally).
