import { Base, Comparable, Hashable } from "./base";
import { Sym, load_symbol } from "./symbol";

/**
 *  Vector 符号表
 * vector = [sym1, sym2, ...]
 */
export class Vector implements Base, Comparable, Hashable {
  public m: Sym[];
  private __hash__: string = '';

  constructor(vector: any[]) {
    this.m = this.load_vector(vector);
  }

  private load_vector(vector: any[]) {
    let epsilon = true;
    let output = [];

    const temp = vector.map(item => load_symbol(item));
    for (const it of temp) {
      if (!it.is_epsilon) {
        epsilon = false;
        break;
      }
    }

    if (!epsilon) {
      for (const item of temp) {
        output.push(item);
      }
    }
    return output;
  }

  hash() {
    //todo
    if (this.__hash__) {
      return this.__hash__;
    }
    return '';
  }

  get length() {
    return this.m.length;
  }

  public get_item(index: number) {
    return this.m[index];
  }

  public contains(key: number | Sym) {
    if (typeof key === 'number') {
      return key < this.length;
    }
    for (const it in this.m) {
      // @ts-ignore
      if (it === key) {
        return true;
      }
    }
    return false;
  }

  get is_empty() {
    return this.m.length === 0;
  }

  leftmost_terminal() {
    for (const it of this.m) {
      if (it.terminal) return it;
    }

    return null;
  }

  rightmost_terminal() {
    for (let i = this.m.length - 1; i >= 0; i--) {
      const it = this.m[i];
      if (it.terminal) return it;
    }
    return null;
  }

  equal(right: Vector): boolean {

    if (this.length !== right.length) return false;
    for (let i = 0; i < this.length; i++) {
      if (!this.m[i].equal(right.get_item(i))) return false;
    }
    return true;
  }

  to_string(): string {
    return this.m.map(item => item.to_string()).join(' ');
  }

  search(sym: Sym, stop = -1) {
    if (stop < 0 || stop >= this.m.length) {


      return this.m.findIndex(item => item === sym);
    }
    for (let i = 0; i < stop; i++) {
      if (this.m[i].equal(sym)) return i;
    }
    return -1;
  }


}