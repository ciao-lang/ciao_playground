# Changelog

## [1.23.0] - 2024-3-04

### Added

 - Add debugger support.
 - Menu buttons for analysis (w/ and w/o output).
 - A simple on-the-fly button under the More menu.

### Improved

 - Towards relocatable URL for playgrounds. The auxiliary `lpdoc.js`
   loaded in HTML backend of LPdoc is extended to automatically load
   the playground when needed. It will attept several locations: local
   URL, and then `https://ciao-lang.org`. Note that due to CORS
   limitations, serving from `file:///` is not fully working.
 - Build and distribute ciaopp library cache.
 - More flexible installation of custom playgrounds.
 - Updated documentation.
 - Upgraded to Monaco Editor 0.38.
 - Recolor port in toplevel while debugging.
 - Patterns for warning/error parsing.

### Fixed

 - Use `?code=` in URL for "load in playground" links from active
   logic documents.
 - Fixed error location from CiaoPP.
 - Workaround new `addCommand` behavior in Monaco >=0.32 ()
 - Hide previous analysis output in acheck.
 - Allow CORS in local server.
 - Fix syntax highlight for `=:=`.
 - Trim results of exfilter (in active logic documents).

## [1.22.0] - 2023-04-27

### Added

 - User's manual (including use of LPdoc and exfilter, examples with
   links to playground in LaTeX, etc.)

### Fixed

 - No need to use the "triple backtick with spaces" trick.
 - Fix bug when asking for more solutions and not typing ; nor just Enter.
 - Fixed bug with the file name when downloading the code from the
   playground.
 - `build.sh`: stop if `emcc` is not found.
 - Fix code sharing links (encodeURIComponent, ?code=... instead of
   URL hash)
 - Update all examples to new playground links.

### Improved

 - Appearance:
   - Change layout when the screen is too small for two columns.
   - Align the top and bottom buttons, fixed the cropped
     logo, cursor hovering over buttons.
   - Rearrange UI: removed error container, moved Load into toplevel
     button to the top and added an Abort query button.
   - Added beta symbol to title.
   - Slightly better code highlight in playground preview.
   - Highlight analysis results and messages (for exfilter).
 - Interaction:
   - Add classic predicates to toplevel when loading.
   - Notify when the toplevel is ready to use (all dependencies have
     been loaded).
   - Add the abort query functionality (with button and C-c):
     terminate current worker and restart it.
   - Display Abort button only when a query is running.
   - Add timeout for queries.
   - Redirected error messages to the toplevel.
   - Add "Run tests in module" and "Debug source" buttons and
     functionalities.
   - On-the-fly button
 - Editing:
   - Add the Emacs key binding C-c l to load buffer into toplevel.
   - Add ability to resize the editors with a split panel (just like
     in the CiaoPP Playground).

## [0.0.1] - 2022-07-4

Initial release.
