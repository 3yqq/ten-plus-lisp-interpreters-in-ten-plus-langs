#include "ast.h"
#include "env.h"
#include "eval.h"
#include "obj.h"
#include "token.h"
#include <iostream>
#include <string>
#include <vector>

Env globalEnv;

Obj evalExpression(const std::string &expr) {
  std::vector<std::string> tokenizedExpr = tokenize(expr);
  if (tokenizedExpr.empty()) {
    // all expressions are comment.
    return ErrorObj("Lexer Error");
  }
  Expr ast = parseExpr(tokenizedExpr);
  if (ast.type == ExprType::ERROR) {
    return ErrorObj("Parsing Error");
  } else {
    Obj result = evalExpr(globalEnv, ast);
    return result;
  }
}

int main() {
  std::vector<std::string> exprs = {
      "(define r 1)", "(define fn (lambda (x) (define r 2) (+ x r)))", "(fn 2)",
      "(display r)",
      // "(define a \"ha\")",
      // "{what is the number [a]}",
      // "(define a 2)",
      // "(define fa (lambda (x) (+ x a)))",
      // "(fa 2)",
      // "((lambda (x) (+ x 1)) 2)",
      // "(define f (lambda (x) (+ 2 x)))",
      // "(f 4)",
      // "(define higher_levelFunction (lambda (x) (lambda (y) (+  y x 2))))",
      // "(define add2 (higher_levelFunction 2))",
      // "(add2 4)",
      // "(define r 2)",
      // "(define with_r_2 (lambda (x) (+ r x)))",
      // "(with_r_2 10)",
      // "(define r 10)",
      // "(with_r_2 10)",
      // "(if (> -1 0) 2 1)",
      // "(if 0 2 1)", // 0 is consider as TRUE
      // "(define r 10)",
      // "(set! r 2)",
      // "(define e (quote + 1 2))",
      // "(eval e)",
      // "(define qe (quote 1))",
      // "(eval qe)",
      // "(eval (car `(1)))",
      // "(eval (car `(1 1 1 )))",
      // "(eval (cdr `(1 + 1 1)))",
      // "(eval (car `((+ 1  1)) ))",
      // "(cdr (quote 1 2 3))",
      // "(cons `1 `(1 1))",
      // "(cons (quote +) `(1 1 ))",
      // "(cons `+ `(1 1))",
      // "(define 世界 1)",
      // "(display 世界)",
      // "(define temp (cons `a `(1 1)))",
      // "(cons `(a b) `(b c d))", // "(cons `(a b) `(b c d))" is wrong
      // "(cons `(a b) `c)",
      // "(cons `a `3)",
      // "(define shit (quote + 1 1))",
      // "(eval shit)",
      // "{你好 [a] haha hello world!}",
      // '(define m "hello, world")',
      // '"hello, world"',
      // '(+ "hello " "world")',
      // '(display (+ "hello" " world!"))',
      // "(display (+ 1 1))",
      // "(display {你好})",
      // '(define a "s")',
      // "(define lst (list 1 a (+ 2 3) (lambda (x) (+ x 2))))",
      // "(get 1 lst)",
      // "(set 1 2 lst)",
      // "(push 100 lst)",
      // "lst",
      // '(define d (dict "a" 1 "b" 2 "c" 3 "def" "def" "0" (+ 1 2)))',
      // '(get d "a")',
      // '(set d "a" 100)',
      // "(bind a (+ 1 1) (define b 2))",
      // "(update a 1)",
      // "(+ b 2)",
      // "(bind a (define c 2))",
      // "(update a 2)",
      // "(+ c 1)",
      // "\"The following expressions is OOP of this language: bind expressions
      // " "to item of dict. lambda doesn't work because lambda is bound with
      // local " "env. bind works because it's using global env\"",
      // "\"that might be the reason why react can be written by both binding "
      // "expressions to obj and class\"",
      // '(define d (dict "f" 0 "b" 2))',
      // '(set d "f" 0)',
      // '(bind (get d "f") (set d "b"  ( + (get d "b" ) 1) ) )',
      // '(update (get d "f") 0)',
      // '(display (get d "b"))',
      // '(update (get d "f") 0)',
      // '(get d "b")',
      // '(str "; " (+ 1 1) (lambda (x) (+ x 1)))',
      // "(define f (lambda (x) (if x (begin (display x) (f (- x 1)) ) 0)))",
      // "(f 2)",
      // "(if 0 1 2)",
      // "(define d 2)",
      // "(while d (display d) (update d (- d 1)))",
      // "(random 1 2)",
      // "(randInt 1 3)",
      // '(randChoice 1 2 "haha")',
      // "(return 1)",
      // "(_displayFuncDepth)",
      // "(define f (lambda (x) (_displayFuncDepth) (return x) (display 2) ))",
      // "(f 4)",
      // "(define f (lambda (x) (if x (return x)) (+ x 1)))",
      // "(f 0)",
      // "(f 1)",
      // "(+ 11 a b ",
      // "(+ 1)",
      // "(if 1)",
      // "(define x 3)",
      // "(define f (lambda () (define x 2))) ",
      // "x",
      // '(class A "a" "b")',
      // "(instance A temp)",
      // "(getItem temp a)",
      // "(setItem temp a 2)",
      // "(getItem temp a)",
      // '(setMethod A m (lambda (x) (+ x (getItem this a)) ))',
      // '(callMethod temp m 2)',
      // '(subclass A subclassOfA c)',
      // '(instance subclassOfA temp2)',
      // '(setItem temp2 "c" 3)',
      // '(getItem temp2 "a")',
      // '(callMethod temp2 "m" 2)',
      // "(+ 2 a)",
      // "(- 2 a)",
      // "(and 1 0 2)",
      // "(or 1 0)",
      // "(for (define a 3)(> a 0)(define a (- a 1)) (if (< a 2) (return 100)) "
      // "(display a))",
      // "(for (define a 3)(> a 1)(define a (- a 1)) (display a))",
      // "(** 2 3)",
      // "(define arr (array 2 2 3))",
      // "(setArr (** 2 3) arr 0 0  0)",
      // "(getArr arr 0 0 0)",
      // "arr",
  };

  std::vector<std::string> results;

  for (const auto &expr : exprs) {
    Obj result = evalExpression(expr);
    results.push_back(result.toString());
    std::cout << results.back() << std::endl;
  }

  return 0;
}