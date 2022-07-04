#!/bin/sh

# ---------------------------------------------------------------------------

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
ciao install --grade=wasm ciaodbg

# [[website]]
# rm -rf ../../build/site/index.cachedoc; ciao custom_run website dist
ciao build --bin website
ciao install --grade=wasm website

# [[lpdoc]]
ciao install --grade=wasm lpdoc

# [[ciaopp]]
# (switch to lite version if needed)
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

# # [[scasp.html]]
if ciao list | grep sCASP > /dev/null 2>&1; then # has sCASP
    ciao install --grade=wasm sCASP
fi

