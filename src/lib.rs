#![deny(clippy::all)]

use napi_derive::napi;
use rand::RngExt;

#[napi]
pub fn get_primality_probability(n: u32, iterations: u32) -> f64 {
  // Base cases
  if n < 2 {
    return -1.0;
  }
  if n == 2 || n == 3 {
    return 1.0;
  }
  if n % 2 == 0 {
    return 0.0;
  }

  let (k, m) = decompose_factors(n);

  let signed_n = n.into();

  for _i in 0..iterations {
    let a = rand::rng().random_range(2..(n - 1));
    let b0 = mod_exp(a.into(), m, signed_n);

    if b0 != -1 && b0 != 1 {
      let b = bn(b0, signed_n, k);

      if b != -1 {
        return 0.0;
      }
    }
  }
  return 1.0 - (0.25f64).powi(iterations as i32);
}

fn mod_exp(x: i64, n: u32, m: i64) -> i64 {
  if n == 0 {
    1
  } else if n.is_multiple_of(2) {
    let y = mod_exp(x, n / 2, m);
    (y * y) % m
  } else {
    (x % m * mod_exp(x, n - 1, m)) % m
  }
}

fn bn(b: i64, m: i64, k: u32) -> i64 {
  if k == 0 || b == 1 || b == -1 {
    b
  } else {
    let bnext = mod_exp(b, 2, m);
    bn(bnext, m, k - 1)
  }
}

fn decompose_factors(n: u32) -> (u32, u32) {
  let mut k = 0;
  let m: u32;

  loop {
    if (n - 1).is_multiple_of(u32::pow(2, k + 1)) {
      k += 1;
    } else {
      m = (n - 1) / u32::pow(2, k);
      break;
    }
  }
  (k, m)
}
