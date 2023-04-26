#!/bin/sh

# Helper build script for the Ciao Playground
#
# Use "FORCE_ENG_REBUILD=yes ./build.sh" to force engine rebuild.
# 
# ---------------------------------------------------------------------------

has_bundle() {
    ciao info "$1" > /dev/null 2>&1
}

# ---------------------------------------------------------------------------

if ! has_bundle ciao_playground; then
    cat <<EOF
ERROR: Cannot locate the 'ciao_playground' bundle.

Make sure that Ciao is installed and this bundle enabled and
activated.

EOF
    exit 1
fi

if ! [ -x "$(command -v emcc)" ]; then
    cat <<EOF
ERROR: Could not find 'emcc' in the path. 

Please install and activate emscripten:

  https://emscripten.org/docs/getting_started/downloads.html

Make sure that your installation is enabled in your current shell with:

  # (from your emsdk directory)
  source ./emsdk_env.sh

EOF
    exit 1
fi

# ---------------------------------------------------------------------------
# Install ciaowasm and the playground 

# (fetch externals)
ciao custom_run ciao_playground fetch_externals
# (build and install ciaowasm)
if [ x"$FORCE_ENG_REBUILD" = x"yes" ]; then # make sure engine is rebuilt
    if [ -r ../../core/engine/ciaoengine_common.pl ]; then
        touch ../../core/engine/ciaoengine_common.pl
        rm -rf ../../build/eng/ciaoengwasm/
    else
        cat <<EOF
Cannot locate ciaoengine_common.pl
EOF
        exit 1
    fi
fi
ciao build --bin ciaowasm
ciao build --grade=wasm ciaowasm
ciao install --grade=wasm -x ciaowasm
# (build and install ciao_playground, including docs)
ciao build --bin ciao_playground
# rm -rf ../../build/doc/ciao_playground.*
ciao build --docs ciao_playground
ciao install ciao_playground 
ciao custom_run ciao_playground dist

# ---------------------------------------------------------------------------
# Prepare and install wasm distributions of bundles

# [[main deps]]
# ciao install --grade=wasm core # (done with ciaowasm installation)
ciao install --grade=wasm builder

# [[unit tests]]
if has_bundle ciaodbg; then
    ciao install --grade=wasm ciaodbg
fi

# [[website]]
# rm -rf ../../build/site/index.cachedoc; ciao custom_run website dist
if has_bundle website; then
    ciao build --bin website
    ciao build --grade=wasm website
    ciao install --grade=wasm website
fi

# [[lpdoc]]
if has_bundle lpdoc; then
    ciao install --grade=wasm lpdoc
fi

# [[exfilter]]
if has_bundle exfilter; then
    ciao install --grade=wasm exfilter
fi

# [[ciaopp]]
# (switch to lite version if needed)
if has_bundle ciaopp; then
    ciaopp_lite=`ciao configure --get-flag ciaopp:lite`
    if [ x"$ciaopp_lite" = x"no" ]; then
        echo ":: Temporarily switch to ciaopp lite version"
        ciao clean --bin ciaopp
        ciao configure ciaopp --ciaopp:lite=yes
    fi
    ciao build --bin ciaopp
    ciao install --grade=wasm ciaopp
    # (switch back to non-lite if needed)
    if [ x"$ciaopp_lite" = x"no" ]; then
        echo ":: Going back to non-lite ciaopp version"
        ciao clean --bin ciaopp
        ciao configure ciaopp --ciaopp:lite=no
        ciao build --bin ciaopp # recompile
    fi
    ciao install --grade=wasm typeslib
fi

# # [[scasp.html]]
if has_bundle sCASP; then # has sCASP
    ciao install --grade=wasm sCASP
fi

