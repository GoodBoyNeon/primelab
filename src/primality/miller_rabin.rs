use rand::RngExt;

use crate::utils::arithmetic::decompose_factors;
use crate::utils::arithmetic::mod_exp;

fn bn(b: i64, m: i64, k: u32) -> i64 {
  if k == 0 || b == 1 || b == m - 1 {
    b
  } else {
    let bnext = mod_exp(b, 2, m);
    bn(bnext, m, k - 1)
  }
}

pub fn test(n: u32, iterations: u32) -> f64 {
  // Base cases
  if n < 2 {
    return -1.0;
  }
  if n == 2 || n == 3 {
    return 1.0;
  }
  if n.is_multiple_of(2) {
    return 0.0;
  }

  let (k, m) = decompose_factors(n);

  let signed_n = n.into();

  for _i in 0..iterations {
    let a = rand::rng().random_range(2..(n - 1)); /* n > 4 always due to base cases */
    let b0 = mod_exp(a.into(), m, signed_n);

    if b0 != signed_n - 1 && b0 != 1 {
      let b = bn(b0, signed_n, k);

      if b != signed_n - 1 {
        return 0.0;
      }
    }
  }
  1.0 - (0.25f64).powi(iterations as i32)
}
