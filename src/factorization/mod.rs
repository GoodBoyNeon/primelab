pub mod with_sieve;
use crate::{factorization::with_sieve::factorize_with_sieve, sieve::sieve_of_eratosthenes};

pub fn factorize(n: u32) -> Vec<u32> {
  let sieve = sieve_of_eratosthenes(n);
  factorize_with_sieve(n, &sieve)
}
