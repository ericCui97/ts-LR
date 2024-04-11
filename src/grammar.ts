/**
 * 语法类： （终结符，非终结符，产生式）
 */

import { Base, Comparable } from "./base";
import { Production } from "./production";
import { Sym, load_symbol } from "./symbol";
import { Token } from "./token";

export class Grammar implements Base, Comparable {
    production: Production[] = [];
    symMap = new Map();
    terminal = new Map();
    rule = {};
    precedence = {}       // # str -> prec
    assoc = {}             //# str -> one of (None, 'left', 'right')
    _anchor = {}           //# str -> (filename, linenum)
    _dirty = false
    scanner = []           // scanner rules
    start = null

    reset() {
        this.production = [];
        this.symMap.clear();
        this.terminal.clear();
        this.rule = {};
        this.precedence = {}
        this.assoc = {}
        this._anchor = {}
        this._dirty = false
        this.scanner = []


    }

    private _symbol_name(sym: Sym) {
        if (sym instanceof Sym) {
            return sym.name;
        }
        if (typeof sym === 'string') {
            return sym;
        }
        throw new Error("sym is not a Sym instance");
    }

    get length() {
        return this.production.length
    }

    get_item(index: number) {
        return this.production[index]
    }

    contains(key: any) {
        if (typeof key === 'number') {
            return 0 <= key && key < this.length
        }
        else if (typeof key === 'string') {
            return this.symMap.has(key)
        } else if (key instanceof Sym) {
            return this.symMap.has(this._symbol_name(key))
        } else if (key instanceof Production) {
            for (const p in this.production) {
                if (this.production[p].equal(key)) {
                    return true;
                }
            }
        }
        return false;
    }

    insert(index:number,production:Production){

    }

    search(p:Production,stop=-1){

    }

    remove(index:number){

    }

    pop(index:number=-1){

        
    }

    append(production:Production){

    }

    replace(index:number,source:any){

    }

    update(){


    }

    push_token(token:Token){

    }

    push_precedence(sym:Sym,prec:string,assoc:string){

    }

    push_scanner(obj){

    }

    create_symbol(name:any){
        const s = load_symbol(name);
        if(name!==''){
            if(this.terminal.has(name)){
                s.terminal = true;
            }
        }
        return s;
        
    }

    argument(){
        if(!this.start){
            
        }
    }


}
