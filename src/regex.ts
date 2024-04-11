export function validate_pattern(pattern: RegExp) {
  try {
    const reg = new RegExp(pattern);
    return true;
  } catch {
    return false;
  }
}
const PATTERN_WHITESPACE = /[ \t\r\n]+/;
const PATTERN_COMMENT1 = /[#].*/;
const PATTERN_COMMENT2 = /\/\/.*/;
const PATTERN_COMMENT3 = /\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//;
const PATTERN_MISMATCH = /./;
const PATTERN_NAME = /\w+/;
const PATTERN_GNAME = /\w(?:\w|\@)*[']*/;
const PATTERN_STRING1 = /'(?:\\.|[^'\\])*'/;
const PATTERN_STRING2 = /"(?:\\.|[^"\\])*"/;
const PATTERN_NUMBER = /\d+(\.\d*)?/;
const PATTERN_CINTEGER = /(0x)?\d+[uUlLbB]*/;
const PATTERN_REPLACE = /(?<!\\)\{\s*[a-zA-Z_]\w*\s*\}/;
const PATTERN_EPSILON = '\u03b5';
const PATTERN_GMACRO = /[%]\s*\w+/;
const PATTERN_OPERATOR = /[\+\-\*\/\?\%]/;

const strip = (str: string) =>
  str
    .split('')
    .filter(
      (char) => char === '\r' || char === '\t' || char === ' ' || char === '\n'
    )
    .join('');

// 预定义的 词法规则

const lex_rules = `
    O = [0-7]
    D = [0-9]
    NZ = [1-9]
    L = [a-zA-Z_]
    A = [a-zA-Z_0-9]
    H = [a-fA-F0-9]
    HP = (0[xX])
    E = ([Ee][+-]?{D}+)
    P = ([Pp][+-]?{D}+)
    FS = (f|F|l|L)
    IS = (((u|U)(l|L|ll|LL)?)|((l|L|ll|LL)(u|U)?))
    CP = (u|U|L)
    SP = (u8|u|U|L)

    WHITESPACE = \s+
    WS = \s+
    EOL = [\n]+
    WSEOL = {WS}|{EOL}
    COMMENT1 = [#].*
    COMMENT2 = \/\/.*
    COMMENT3 = \/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/
    COMMENT = {COMMENT1}|{COMMENT2}|{COMMENT3}
    NAME = {L}{A}*
    STRING1 = '(?:\\.|[^'\\])*'
    STRING2 = "(?:\\.|[^"\\])*"
    STRING = {STRING1}|{STRING2}
    DIGIT = [0-9]
    DIGITS = {DIGIT}+
    HEX = {HP}{H}+
    DEC = {NZ}{D}*
    INTEGER = ({HEX}|{DEC})(({IS}|{CP})?)
    FLOAT = {DIGITS}((\.{DIGITS})?)({E}?)({FS}?)
    NUMBER = {INTEGER}|{FLOAT}
`;
type RegexBuildParams = {
  code: string;
  capture: boolean;
};

function is_string_numeric(str: string) {
  const pattern = /^[-+]?[0-9]*\.?[0-9]+$/;
  return pattern.test(str);
}
const regex_build = ({ code, capture }: RegexBuildParams) => {
  const defined = new Map();
  let line_num = 0;
  for (let line of code.split('\n')) {
    line_num++;
    line = strip(line);

    if (line.length === 0 || line.startsWith('#')) continue;

    let pos = [...line].findIndex((char) => char === '=');
    if (pos < 0) {
      throw new Error(`${line_num}: not a valid rule`);
    }
    const head = strip(line.substring(0, pos));
    const body = strip(line.substring(pos + 1));

    if (!head) {
      throw new Error(`${line_num}: empty rule name`);
    } else if (is_string_numeric(head[0])) {
      throw new Error(`${line_num}:invalid rule name`);
    } else if (head.indexOf('<') > 0 || head.indexOf('>') > 0) {
      throw new Error(`${line_num}:invalid rule name`);
    }
    let pattern = [];
    try {
      pattern = regex_expand(defined, body, !capture);
    } catch (e: any) {
      throw new Error(`${line_num}:${e.message}`);
    }
    // todo
  }
};

function regex_expand(macros: Map<any, any>, pattern: string, guarded = true) {
  let output = [];
  let pos = 0;
  let size = pattern.length;
  while (pos < size) {
    let ch = pattern[pos];
    if (ch === '\\') {
      output.push(pattern.slice(pos, pos + 2));
      pos += 2;
      continue;
    } else if (ch !== '{') {
      output.push(ch);
      pos += 1;
      continue;
    }
    let p2 = pattern.indexOf('}', pos);
    if (p2 < 0) {
      output.push(ch);
      pos += 1;
      continue;
    }
    let p3 = p2 + 1;
    let name = pattern.slice(pos + 1, p2).trim();
    if (name === '') {
      output.push(pattern.slice(pos, p3));
      pos = p3;
      continue;
    }
    if (!isNaN(name[0])) {
      output.push(pattern.slice(pos, p3));
      pos = p3;
      continue;
    }
    if (name.includes('<') || name.includes('>')) {
      throw new Error('invalid pattern name "' + name + '"');
    }
    if (!(name in macros)) {
      throw new Error('{' + name + '} is undefined');
    }
    if (guarded) {
      output.push('(?:' + macros[name] + ')');
    } else {
      output.push(macros[name]);
    }
    pos = p3;
  }
  return output.join('');
}
