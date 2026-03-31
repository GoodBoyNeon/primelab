pub fn mod_exp(x: i64, n: u32, m: i64) -> i64 {
  if n == 0 {
    1
  } else if n.is_multiple_of(2) {
    let y = mod_exp(x, n / 2, m);
    (y * y) % m
  } else {
    (x % m * mod_exp(x, n - 1, m)) % m
  }
}

pub fn decompose_factors(n: u32) -> (u32, u32) {
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
