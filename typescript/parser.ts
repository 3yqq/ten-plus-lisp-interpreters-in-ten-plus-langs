import { Expr, ExprType, Atom } from "./ast";

export function parseExprs(tokens: string[]): Expr[] {
  const exprs: Expr[] = [];
  while (tokens.length >= 1) {
    exprs.push(parseExpr(tokens));
  }

  return exprs;
}

export function parseExpr(tokens: string[]): Expr {
  try {
    let token = tokens.shift();
    if (!token) {
      throw new Error("Unexpected end of tokens");
    }

    if (token === '"') {
      const expr = new Expr(ExprType.STRING_EXPR, tokens[0] as Atom);
      tokens.shift();
      if (tokens.length > 0) tokens.shift();
      return expr;
    }

    if (token === "{") {
      const lstExpr: Expr[] = [];
      while (tokens[0] !== "}") {
        if (!tokens[0]) {
          throw new Error("Unexpected end of tokens");
        }
        const expr = parseExpr(tokens);
        lstExpr.push(expr);
      }
      tokens.shift(); // remove ')'
      return new Expr(ExprType.PRINTED_EXPR, lstExpr);
    }

    if (token === "(") {
      const lstExpr: Expr[] = [];
      while (tokens[0] !== ")") {
        if (!tokens[0]) {
          throw new Error("Unexpected end of tokens");
        }
        const expr = parseExpr(tokens);
        lstExpr.push(expr);
      }
      tokens.shift(); // remove ')'
      return new Expr(ExprType.LST_EXPR, lstExpr);
    } else {
      return new Expr(ExprType.ATOM, token as Atom);
    }
  } catch (error) {
    return new Expr(ExprType.ERROR, "Parsing Error.");
  }
}
