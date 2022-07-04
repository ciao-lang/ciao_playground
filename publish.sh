#!/bin/sh

# Script for publishing

# ---------------------------------------------------------------------------
# Note:
#  - Check ProxyPassMatch rules at
#      /etc/apache2/sites-enabled/apache2-ssl.conf
#      /etc/apache2/sites-enabled/apache2-wwwnode-site.conf

MACHINE=ciao-lang.org
TARGET=/home/ciao/public_html
PERMS=ciao.ciao

# ---------------------------------------------------------------------------
# MACHINE=cliplab.org
# TARGET=/home/clip/public_html/testmh
# PERMS=herme.clip
# ---------------------------------------------------------------------------
# MACHINE=cliplab.org
# TARGET=/home/clip/public_html/test
# PERMS=clip.clip
# ---------------------------------------------------------------------------

echo ":: (Re)Installing in local build dir"
ciao install ciao_playground
ciao custom_run ciao_playground dist
echo ":: Publishing at $MACHINE:$TARGET"
echo "::   Copying playground"
rsync -l -r --delete ../../build/site/playground "$MACHINE:$TARGET"
echo "::   Copying other ciaowasm modules"
rsync -l -r --delete ../../build/site/ciao "$MACHINE:$TARGET"
echo "::   Copying node modules"
rsync -l -r --delete ../../third-party/3rd-npm/node_modules "$MACHINE:$TARGET"
echo "::   Fix documentation dir"
ssh "$MACHINE" \
    "rm -f $TARGET/ciao/build/doc; mkdir -p $TARGET/ciao/build/doc"
echo "::   Copying documentation"
rsync -l -r --delete ../../build/doc/ciao_playground.html "$MACHINE:$TARGET/ciao/build/doc"
## TODO: the current installation of catalog_ui.pl requires a patched lpdoc.css; update manually
# echo "::   Copying other css"
# rsync -l -r --delete ../../build/site/css/lpdoc.css "$MACHINE:$TARGET/css"
echo "::   Fixing permissions"
ssh "$MACHINE" \
    "sudo chown -R $PERMS $TARGET/playground $TARGET/ciao $TARGET/node_modules; \
    sudo chmod -R ugo+rX $TARGET/playground $TARGET/ciao $TARGET/node_modules; \
    sudo chmod -R ug+w $TARGET/playground $TARGET/ciao $TARGET/node_modules"
echo ":: Done"

