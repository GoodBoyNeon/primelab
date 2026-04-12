#![deny(clippy::all)]
use napi_derive::napi;
use primelab_core::{
  factorize, factorize_with_sieve, next_prime, prev_prime, sieve_of_eratosthenes, test_primality,
  test_primality_with,
};
use primelab_core::{PrimalityAlgorithm, PrimalityOptions};

// #[napi]
// pub fn miller_rabin(n: u32, iterations: u32) -> f64 {
//   primality::miller_rabin::test(n, iterations)
// }
//
// #[napi]
// pub fn fermat(n: u32, iterations: u32) -> f64 {
//   primality::fermat::test(n, iterations)
// }

#[napi]
pub fn is_prime(n: u32) -> f64 {
  is_prime_with(n, PrimalityAlgorithm::MillerRabin, 15)
}
pub fn is_prime_with(n: u32, algorithm: PrimalityAlgorithm, iterations: u32) -> f64 {
  let res = test_primality_with(
    n,
    PrimalityOptions {
      algorithm,
      iterations,
    },
  );
  if res.is_prime() {
    1.0
  } else if res.is_composite() {
    0.0
  } else if res.is_probable_prime() && res.confidence().is_some() {
    res.confidence().unwrap_or(0.0)
  } else {
    0.0
  }
}

#[napi]
pub fn sieve(n: u32) -> Vec<u32> {
  sieve_of_eratosthenes(n)
}

#[napi]
pub fn get_prime_factors(n: u32) -> Vec<u32> {
  factorize(n)
}

#[napi]
pub fn get_prime_factors_with_prime(n: u32, prime: &[u32]) -> Vec<u32> {
  factorize_with_sieve(n, prime)
}

#[napi]
pub fn get_next_prime(n: u32) -> u32 {
  next_prime(n)
}

#[napi]
pub fn get_prev_prime(n: u32) -> u32 {
  prev_prime(n)
}
