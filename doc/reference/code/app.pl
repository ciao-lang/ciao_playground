:- module(app, [app/3], [assertions,predefres(res_steps)]).

:- pred app(Xs, Ys, Zs) : ( list(Xs), list(Ys) ) => list(Zs) .
  
app([],     Ys, Ys).
app([X|Xs], Ys, [X|Zs]) :-
  app(Xs, Ys, Zs).
