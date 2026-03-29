use crate::primality::util::base_cases;
use crate::utils::arithmetic::mod_exp;
use rand::RngExt;

pub fn test(n: u32, iterations: u32) -> f64 {
  if let Some(result) = base_cases(n) {
    return result;
  }

  for _i in 0..iterations {
    let a = rand::rng().random_range(2..(n - 1));

    if mod_exp(a as i64, n - 1, n as i64) != 1 {
      return 0.0;
    }
  }
  1.0 - (0.5f64).powi(iterations as i32)
}
