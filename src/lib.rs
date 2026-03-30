#![deny(clippy::all)]

mod factorization;
mod primality;
mod sieve;
mod utils;

use napi_derive::napi;

#[napi]
pub fn miller_rabin(n: u32, iterations: u32) -> f64 {
  primality::miller_rabin::test(n, iterations)
}

#[napi]
pub fn fermat(n: u32, iterations: u32) -> f64 {
  primality::fermat::test(n, iterations)
}

#[napi]
pub fn sieve(n: u32) -> Vec<u32> {
  sieve::sieve_of_eratosthenes(n)
}

#[napi]
pub fn get_prime_factors(n: u32) -> Vec<u32> {
  factorization::factorize(n)
}

#[napi]
pub fn get_prime_factors_with_prime(n: u32, prime: &[u32]) -> Vec<u32> {
  factorization::with_sieve::factorize_with_sieve(n, prime)
}
