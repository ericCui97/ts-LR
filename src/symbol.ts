

/*
 * Sym 类，叫sym 只是因为js已经有了Symbol，意思就是Symbol
 * 含义是 符号类：包括终结符和非终结符，term 代表是否为终结符
 */

import { is_string_literal } from "./utils";

export class Sym {
  public value: PrimitiveType = null;
  public name: string = "";
  public terminal: boolean = false;
  constructor(name: string, terminal: boolean = false) {
    if (typeof this.name !== "string") {
      throw new Error("name must be string in sym");
    }
    this.name = name;
    this.terminal = terminal;
    // pass
  }

  public to_string() {
    return !!this.name ? this.name : "anonymous";
  }

  public equal(right: Sym | string | null) {
    if (typeof right === "string" || right === null) {
      return this.name === right;
    } else {
    }
    if (right instanceof Sym) {
      return this.name === right.name;
    }
    throw new Error(`Symbol cannot be compared to a ${typeof right}`);
  }

  public not_equal(right: Sym) {
    return right !== this;
  }
  // 判断是否是字符串字面量 类似 “hello”
  get is_literal() {
    return is_string_literal(this.name ?? "");
  }
  // 判断是否是空/epsilon
  get is_epsilon() {
    if (this.terminal) {
      return false;
    } else if (this.name === "") {
      return true;
    } else if (
      ["%empty", "%e", "%epsilon", "\u03b5", "<empty>"].includes(
        this.name ?? ""
      )
    ) {
      return true;
    }
    return false;
  }
  // 将name hash
  get hash() {
    let hash = 0;
    if (this.name) {
      for (let i = 0; i < this.name.length; i++) {
        // 使用字符的Unicode编码和简单的位操作来生成哈希值
        hash = (hash << 5) - hash + this.name.charCodeAt(i);
        // 可选的：将哈希值限制在一个范围内，例如32位整数
        hash |= 0; // 转换为32位整数（丢弃小数部分）
      }
    }
    return hash;
  }
}

export function load_symbol(source: Sym | string | any[]) {
  if (source instanceof Sym) {
    return source;
  }
  if (typeof source === "string") {
    const _sym = new Sym(source);
    if (_sym.is_literal) {
      _sym.terminal = true;
      if (_sym.name === '""' || _sym.name === "''") {
        _sym.terminal = false;
        _sym.name = "";
      }

      try {
        _sym.value = eval(_sym.name ?? "");
      } catch {}
    } else if (source === "#" || source === "$") {
      _sym.terminal = true;
    }
    return _sym;
  } else if (Array.isArray(source)) {
    if (source.length === 0) {
      throw new Error(`bad symbol:[]`);
    }
    if (source.length === 1) {
      return new Sym(source[0]);
    } else if (source[0].length === 2) {
      return new Sym(source[0], source[1]);
    } else {
      const _sym = new Sym(source[0], source[1]);
      _sym.value = source[2];
      return _sym;
    }
  }
  throw new Error(`bad symbol:${source}`);
}
