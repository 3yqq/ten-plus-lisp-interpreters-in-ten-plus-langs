// main.ts
import { tokenize } from "./token";
import { parseExpr } from "./parser";
import { evalExpr } from "./eval";
import { Env } from "./env";
import { Obj } from "./obj";
import { Expr } from "./ast";

const exprs: string[] = [
  // "(define r 1)",
  // "(define func (lambda (x) (define r 2) (+ x r)))",
  // "(func 2)",
  // "(display r)",
  // "(define r 1)",
  // "(define func (lambda (x) (+ x r)))",
  // "(func 2)",
  // '(define a "Hah")',
  // "{what is the number [a]}",
  // "(define a 2)",
  // "(define fa (lambda (x) (+ x a)))",
  // "(fa 2)",
  // "((lambda (x) (+ x 1)) 2)",
  // "(define f (lambda (x) (+ 2 x)))",
  // "(f 4)",
  // "(define f 20)",
  // "(define higher_levelFunction (lambda (x) (lambda (y)  (display x) (+  y x f))))",
  // "(define add2 (higher_levelFunction 2))",
  // "(add2 4)",
  // "x",
  // "f",
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
  // "(define oneAddOneForm (cons (quote +) `(1 1 )))",
  // "(eval oneAddOneForm)",
  // "(cons `+ `(1 1))",
  // "(quote 1)",
  // "(define 世界 1)",
  // "(display 世界)",
  // "(define temp (cons `a `(1 1)))",
  // "(cons `(a b) `(b c d))", // "(cons `(a b) `(b c d))" is wrong
  // "(cons `(a b) `c)",
  // "(cons `a `3)",
  // "(define shit (quote + 1 1))",
  // "(eval shit)",
  // "",
  // '(define a "sanyan"',
  // "{你好 [a] Hah hello world!}",
  // '(define m "hello, world")',
  // '"hello, world"',
  // '(+ "hello " "world")',
  // '(display (+ "hello" " world!"))',
  // "(display (+ 1 1))",
  // "(display {你好})",
  // '(define a "s")',
  // "(define lst (list 1 a (+ 2 3) (lambda (x) (+ x 2))))",
  // "(get lst 1)",
  // "(set lst 1 2)",
  // "(push lst 100)",
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
  // "\"The following expressions is OOP of this language: bind expressions to item of dict. lambda doesn't work because lambda is bound with local env. bind works because it's using global env\"",
  // '"that might be the reason why react can be written by both binding expressions to obj and class"',
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
  // '(randChoice 1 2 "Hah")',
  // "(return 1)",
  // "(_displayFuncDepth)",
  // "(define f (lambda (x) (_displayFuncDepth) (return x) (display 2) ))",
  // "(f 4)",
  // "(define f (lambda (x) (if x (return x)) (+ x 1)))",
  // "(f 0)",
  // "(f 1)",
  // "(+ 11 2)",
  // "(+ 1 2)",
  // "(if 1 0)",
  // "(define x 3)",
  // "(define f (lambda () (define x 2))) ",
  // "x",
  // "(begin (display 1) (display 2))",
  // '(class A "a" "b")',
  // "(instance A temp)",
  // "(getItem temp a)",
  // "(setItem temp a 2)",
  // "(getItem temp a)",
  // "temp",
  // "",
  // "(getItem temp a)",
  // "(setMethod A m (lambda (x) (+ x (getItem this a)) ))",
  // "(callMethod temp m 2)",
  // "(subclass A subclassOfA c)",
  // "(instance subclassOfA temp2)",
  // '(setItem temp2 "c" 3)',
  // '(getItem temp2 "a")',
  // '(callMethod temp2 "m" 2)',
  // "(+ 2 a)",
  // "(- 2 a)",
  // "(and 1 0 2)",
  // "(or 1 0)",
  // "(for (define a 3)(> a 0)(define a (- a 1)) (if (< a 2) (return 100)) (display a))",
  // "(for (define a 3)(> a 1)(define a (- a 1)) (display a))",
  // "(** 2 3)",
  // "(define arr (array 2 2 3))",
  // "(setArr (** 2 3) arr 0 0  0)",
  // "(getArr arr 0 0 0)",
  // "arr",
  // "(define a 1)",
  // "(LLM ha a)", // The reason why this works is that ha is undefined and I treat it as plain literal.
  // "(AI 你好 a )",
  // "(= 1 2)",
  // "(= 1 1)",
  // "(define d 10)",
  // "(let (define a 2) (+ 1 a))",
  // "(switch 10 (1 2) ((+ 5 5) 3) (7 10))",
  // "(concat (list 1 2) (list 3 5))",
  // "(define a 1)",
  // "(define b (++ a ))",
  // "b",
  // "a",
  // "(-- a)",
  // "a",
  // "(define a 5)",
  // "(+= a 3)",
  // "a",
  // "(-= a 3)",
  // "(*= a 4)",
  // "(/= a 4)",
  // '(format "hello, $0, $1, 1" "sanyan" "world" 1)',
  // '(macro "hAha" "haha")',
  // '"hAha"',
  // "(define hAha 2)",
  // "haha",
  // "{define a 1}",
  // "a",
  // "{+ 1 a}",
  // "(a)(a)",
  // '(define a "世界")',
  // "(define b 1)",
  // "你好{a}        ,{b}次,不显示括号里的东西(define c 1)",
  // "{c}",
  // "{define a 1}",
  // "(define f (lambda (x) (update a x)))",
  // "{f 2}",
  // "{a}",
  // "{list 1 2 3}",
  "{}",
];

const results: any[] = [];

const globalEnv = new Env();

function getExpr(expr: string, start: number, startChar: string): number {
  if (startChar === "(") {
    const startOfExpr = start;
    let leftBraceCount = 1;
    let rightBraceCount = 0;

    let i = start + 1;
    for (; leftBraceCount > rightBraceCount && i < expr.length; i++) {
      if (expr[i] === ")") rightBraceCount++;
      else if (expr[i] === "(") leftBraceCount++;
    }

    return expr[i - 1] === ")" ? i - 1 : -1;
  }
  if (startChar === "{") {
    const startOfExpr = start;
    let leftBraceCount = 1;
    let rightBraceCount = 0;

    let i = start + 1;
    for (; leftBraceCount > rightBraceCount && i < expr.length; i++) {
      if (expr[i] === "}") rightBraceCount++;
      else if (expr[i] === "{") leftBraceCount++;
    }

    return expr[i - 1] === "}" ? i - 1 : -1;
  }
  return -1;
}

export function evalExpression(env: Env, expr: string): string {
  try {
    let result: string = "";
    for (let i = 0; i < expr.length; i++) {
      if (expr[i] === "(" || expr[i] === "{") {
        const end = getExpr(expr, i, expr[i]);
        if (end === -1) {
          return "Error: Any '('/'{' should be matched with a ')'/'}'.";
        }
        const tokenizedExpr: string[] = tokenize(env, expr.slice(i, end + 1));
        const ast: Expr = parseExpr(tokenizedExpr);
        const exprResult: Obj = evalExpr(env, ast);
        if (expr[i] === "{") {
          if (exprResult.name !== "ErrorObj") result += exprResult.value;
          else result += "[ERROR]";
        }
        i = end;
      } else {
        result += expr[i];
      }
    }
    return result;
  } catch (error) {
    return "Error: Invalid input.";
  }
}

for (const expr of exprs) {
  // const result = evalExtractedExpressions(globalEnv, expr);
  const result = evalExpression(globalEnv, expr);
  globalEnv.cleanup();
  const resultStr = result.toString();
  results.push(resultStr);
  console.log(results[results.length - 1]);
}
