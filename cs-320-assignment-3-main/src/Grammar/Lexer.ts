import { Lexer, Rules } from "moo";
import { compileLexer } from "../Library/Parsing";

const lexingRules: Rules = {
  _: /[ \t]+/,
  hex:/-?\$+[0-9A-Fa-f]+/,
  char:/\'+\\*?[.|0-9|A-Za-z|\\|\']+\'/,
  float: /-?\d+(?:\.\d*)?/,
  name: /[A-Za-z]\w*/,
  plus: /\+/,
  times: /\*/,
  exponent: /\^/,
  dash: /-/,
  parenL: /\(/,
  parenR: /\)/,
  equal: /=/,
  comma: /,/,

};
// something is wrong. How can I set up a new rule named Hex ????


export const lexer: Lexer = compileLexer(lexingRules);

