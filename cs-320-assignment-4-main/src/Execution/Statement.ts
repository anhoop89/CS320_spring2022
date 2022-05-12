// This code is all new, so read through it carefully!

import { Stmt, Value } from "../AST";
import { exprToString } from "../SyntaxAnalysis"; // used in error messages

// To implement our print statement, we pull in a function from our *runtime*,
// which provides primitive operations for interacting with the host platform
// our code is running on. In this case, it gives us a way to write values out
// to a section of the webpage.
import { printLine } from "../Library/Runtime";

// Some of our statements modify the current scope.
import { Scope, namesInScope, declare, update, undeclare, ScopeError } from "./Scope";

// Some of our statements contain expressions.
import { interpretExpr } from "./Expression";
import { assertNum, DynamicTypeError } from "./TypeAssertions";

// This is the error type for our "assert" statements, represented by the
// AssertStmt node type.
export class AssertionError extends Error { }


// This function is similar to interpretExpr, but note one very important
// difference: it has a void return type instead of Value. This is the defining
// difference between an *expression* and a *statement*, and the reason why we
// separate them into two AST types.
export function interpretStmt(
  scope: Scope,
  stmt: Stmt
): void {
  switch (stmt.tag) {
    case "varDecl": {
      // To declare a variable, we have to interpret the provided expression in
      // order to obtain the initial value of the variable.
      const initialValue: Value = interpretExpr(scope, stmt.initialExpr);
      declare(stmt.name, initialValue, scope);
      break;
    }

    case "varUpdate": {
      // Similarly, to update a variable, we have to interpret the provided
      // expression in order to obtain the new value of the variable.
      const initialValue: Value = interpretExpr(scope, stmt.newExpr);
      update(stmt.name, initialValue, scope);
      break;
    }

    case "print": {
      const printValue: Value = interpretExpr(scope, stmt.printExpr);
      printLine(printValue);
      break;
    }

    case "assert": {
      const assertValue: Value = interpretExpr(scope, stmt.condition);
      if (assertValue === 1)
        throw new DynamicTypeError("DynamicTypeError");
      if (assertValue == false)
        throw new AssertionError("AssertionError");
      break;
    }

    case "block": {
      // **This is a very important pattern to pay attention to!**

      // In this line, we save a copy of the variable names that are currently
      // *in scope*. This includes any variable previously declared outside of
      // this block.
      const outerScopeVarNames: Set<string> = namesInScope(scope);

      // Now we execute each statement of the array, which might add new
      // variable names into scope.
      for (const blockStmt of stmt.blockStmts)
        interpretStmt(scope, blockStmt);

      // Finally, to "clean up", we **remove** every variable that was out of
      // scope when the block began.
      for (const varName of scope.keys())
        if (!outerScopeVarNames.has(varName))
          undeclare(varName, scope);
          
      break;
    }

    case "if": {
      // The same pattern of "cleaning up" applies to an if statement: any
      // variables declared within the true branch or false branch are out of
      // scope after the end of the branch.
      const outerScopeVarNames: Set<string> = new Set(scope.keys());

      const conditionValue: Value = interpretExpr(scope, stmt.condition);
      if (conditionValue)
        interpretStmt(scope, stmt.trueBranch);
      else if (stmt.falseBranch != null)
        interpretStmt(scope, stmt.falseBranch);

      for (const varName of scope.keys())
        if (!outerScopeVarNames.has(varName))
          undeclare(varName, scope);

      break;
    }

    case "for": {
      const outerScopeVarNames: Set<string> = namesInScope(scope); 
      
      const initialValue: Value = interpretExpr(scope, stmt.initialExpr);
      assertNum(initialValue);
      for (declare(stmt.name, initialValue, scope); 
           interpretExpr(scope, stmt.condition);
           interpretStmt(scope, stmt.update))
      {
          interpretStmt(scope, stmt.body);
      }  

      for (const varName of scope.keys())
        if (!outerScopeVarNames.has(varName)) 
          undeclare(varName, scope);       
    break;
    }
  }
}

