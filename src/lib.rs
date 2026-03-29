#![deny(clippy::all)]

mod primality;
mod utils;

use napi_derive::napi;

#[napi]
pub fn miller_rabin(n: u32, iterations: u32) -> f64 {
  primality::miller_rabin::test(n, iterations)
}
