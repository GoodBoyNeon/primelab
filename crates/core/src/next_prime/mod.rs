use crate::primality::miller_rabin;

pub fn next_prime(n: u32) -> u32 {
  let mut num = if n < 2 { 2 } else { n + 1 };
  if num > 2 && num.is_multiple_of(2) {
    num += 1;
  }
  while miller_rabin::test(num, 15) < 0.99 {
    num += 2;
  }
  num
}
