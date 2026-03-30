use crate::miller_rabin;

/* returns 0 if no previous prime exists [n <= 2] */
pub fn prev_prime(n: u32) -> u32 {
  if n <= 2 {
    return 0;
  }

  let mut num = n - 1;

  if num > 2 && num.is_multiple_of(2) {
    num -= 1;
  }

  while miller_rabin(num, 15) < 0.99 {
    num -= 2;
    if num < 2 {
      return 0;
    }
  }
  num
}
