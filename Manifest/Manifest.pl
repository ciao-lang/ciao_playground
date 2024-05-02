:- bundle(ciao_playground).
depends([
    core,
    ciaowasm,
    % (needed for install -x)
    builder,
    ciaodbg_extra
]).
alias_paths([]).
manual('ciao_playground', [main='doc/reference/SETTINGS.pl']).


