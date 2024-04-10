// 使用ts实现 类似python的魔法方法

export interface Base {
    to_string?(): string;
}


export interface Comparable {
     equal?(right:any): boolean;
     not_equal?(right:any): boolean;
     less_than?(right:any): boolean;
     less_than_or_equal?(right:any): boolean;
     greater_than?(right:any): boolean;
     greater_than_or_equal?(right:any): boolean;
}


export interface Hashable {
     hash(): string;
}