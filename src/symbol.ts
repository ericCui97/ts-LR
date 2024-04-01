import { is_string_literal } from "./utils";

/*
 * Sym 类，叫sym 只是因为js已经有了Symbol，意思就是Symbol
 * 含义是 符号类：包括终结符和非终结符，term 代表是否为终结符
 */
class Sym {
  constructor(private name: string | null, private terminal: boolean = false) {
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

  public static from_sym(source: Sym) {
    // todo
  }
}
