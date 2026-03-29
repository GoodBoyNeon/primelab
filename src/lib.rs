#![deny(clippy::all)]

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
