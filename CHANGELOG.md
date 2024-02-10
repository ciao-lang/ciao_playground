# Changelog

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
