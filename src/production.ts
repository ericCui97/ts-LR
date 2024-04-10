//----------------------------------------------------------------------
// 产生式/生成式：由 head -> body 组成，head 是 symbol，
// budy 是一个 Vector，即 symbol 组成的序列
//----------------------------------------------------------------------

import { Base, Comparable, Hashable } from "./base";
import { Sym, load_symbol } from "./symbol";
import { assert } from "./utils";
import { Vector } from "./vector";


export class Production implements Base, Comparable, Hashable {
    private __hash__: string;
    private is_epsilon: boolean;
    private has_epsilon: boolean;
    private precedence = null;
    private action = null;

    constructor(
        private head: Sym,
        private body: Vector,
        private index = -1
    ) {

    }

    hash(): string {
        // todo

        return '';
    }

    length() {
        return this.body.length;
    }

    get(index: number) {
        return this.body.get_item(index);
    }

    contains(key: Sym) {
        return this.body.contains(key);
    }

    to_string(): string {
        return `${this.head.to_string()}:${this.body.to_string()}`;
    }

    equal(right: Production): boolean {

        if (right instanceof Production) {
            //todo


        } else {
            throw new Error("Production.equal: right is not Production");
        }

        return true;
    }

    search(sym: Sym, stop = -1) {
        return this.body.search(sym, stop);
    }

    rightmost_terminal() {
        return this.body.rightmost_terminal();
    }

    leftmost_terminal() {
        return this.body.leftmost_terminal();
    }

    // 是否是直接左递归

    get is_left_recursion() {
        if (this.body.length === 0) {
            return false;
        }
        return this.head === this.body.get_item(0);
    }

    get is_right_recursion() {
        if (this.body.length === 0) {
            return false;
        }
        return this.head === this.body.get_item(this.body.length - 1);
    }

    private _action_to_string(m: any) {
        if (typeof m === 'string') {
            return m;
        }

        if (!Array.isArray(m)) {
            throw new Error(`production action must be array`);
        }
        let name = m[0] as string;
        let stack = m[1] as string;
        if (name.startsWith('{') && name.endsWith('}')) {
            return `${name.substring(1, name.length - 1)}/${stack}`
        }
        return `${name}/${stack}`
    }

    get is_empty(){
        return this.body.length === 0;
    }

    stringify(){
        // todo
        return ''
    }

    











}