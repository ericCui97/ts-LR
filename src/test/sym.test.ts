import { Sym, load_symbol } from "../symbol";

describe("Sym class", () => {
  test("constructor with name", () => {
    const sym = new Sym("test");
    expect(sym.name).toBe("test");
    expect(sym.terminal).toBe(false);
    expect(sym.to_string()).toBe("test");
  });

  test("constructor with name and terminal", () => {
    const sym = new Sym("test", true);
    expect(sym.name).toBe("test");
    expect(sym.terminal).toBe(true);
  });

  test("equal with string", () => {
    const sym = new Sym("test");
    expect(sym.equal("test")).toBe(true);
    expect(sym.equal("notTest")).toBe(false);
  });

  test("equal with Sym", () => {
    const sym1 = new Sym("test");
    const sym2 = new Sym("test");
    const sym3 = new Sym("notTest");
    expect(sym1.equal(sym2)).toBe(true);
    expect(sym1.equal(sym3)).toBe(false);
  });

  test("not_equal with Sym", () => {
    const sym1 = new Sym("test");
    const sym2 = new Sym("notTest");
    expect(sym1.not_equal(sym2)).toBe(true);
  });

  test("is_literal", () => {
    const sym1 = new Sym('"hello"');
    const sym2 = new Sym("'world'");
    const sym3 = new Sym("test");
    expect(sym1.is_literal).toBe(true);
    expect(sym2.is_literal).toBe(true);
    expect(sym3.is_literal).toBe(false);
  });

  test("is_epsilon", () => {
    const sym1 = new Sym("");
    const sym2 = new Sym("%empty");
    const sym3 = new Sym("%e");
    const sym4 = new Sym("%epsilon");
    const sym5 = new Sym("\u03b5");
    const sym6 = new Sym("<empty>");
    const sym7 = new Sym("test");
    expect(sym1.is_epsilon).toBe(true);
    expect(sym2.is_epsilon).toBe(true);
    expect(sym3.is_epsilon).toBe(true);
    expect(sym4.is_epsilon).toBe(true);
    expect(sym5.is_epsilon).toBe(true);
    expect(sym6.is_epsilon).toBe(true);
    expect(sym7.is_epsilon).toBe(false);
  });

  test("hash", () => {
    const sym1 = new Sym("test");
    const sym2 = new Sym("test");
    expect(sym1.hash).toBe(sym2.hash);
    const sym3 = new Sym("notTest");
    expect(sym1.hash).not.toBe(sym3.hash);
  });

  test("from with Sym", () => {
    const sym1 = new Sym("test");
    const sym2 = load_symbol(sym1);
    expect(sym1).toEqual(sym2);
  });

  test("from with string literal", () => {
    const sym = load_symbol('"hello"');
    expect(sym.name).toBe('"hello"');
    expect(sym.terminal).toBe(true);
    expect(sym.value).toBe("hello");
  });

  test("from with string special characters", () => {
    const sym1 = load_symbol("#");
    const sym2 = load_symbol("$");
    expect(sym1.name).toBe("#");
    expect(sym1.terminal).toBe(true);
    expect(sym2.name).toBe("$");
    expect(sym2.terminal).toBe(true);
  });

  test("from with array", () => {
    const sym1 = load_symbol(["test"]);
    expect(sym1.name).toBe("test");
    expect(sym1.terminal).toBe(false);
    const sym2 = load_symbol(["test", true]);
    expect(sym2.name).toBe("test");
    expect(sym2.terminal).toBe(true);
    const sym3 = load_symbol(["test", false, "value"]);
    expect(sym3.name).toBe("test");
    expect(sym3.terminal).toBe(false);
    expect(sym3.value).toBe("value");
  });

  test("from with bad input", () => {
    // @ts-ignore
    expect(() => load_symbol(123)).toThrow();
    expect(() => load_symbol([])).toThrowError();
  });
});
