#!/bin/sh

# # (fetch externals)
# ciao custom_run ciao_playground fetch_externals
# # (build and install ciaowasm)
# ciao build --bin ciaowasm
# ciao build --grade=wasm ciaowasm
# ciao install --grade=wasm -x ciaowasm
# # (install wasm builds)
# ciao install --grade=wasm ciaowasm # (if not done before)
# ciao install --grade=wasm core
# ciao install --grade=wasm builder
# ciao install --grade=wasm ciaodbg
# # (build and install ciao_playground, including docs)
# ciao build --bin ciao_playground
ciao build --docs ciao_playground
ciao install ciao_playground 
ciao custom_run ciao_playground dist
