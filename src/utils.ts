export function is_string_literal(str: string) {
  // 正则表达式，匹配以单引号或双引号开头和结尾的字符串
  // 注意：这里假设字符串中不包含内部的引号，即不考虑转义的情况
  const regex = /^(["'])(?:\\\1|.)*?\1$/;
  return regex.test(str);
}
