mod utils;

mod factorization;
mod next_prime;
mod prev_prime;
mod primality;
mod sieve;

// ---> Public API <---
pub use factorization::{factorize, with_sieve::factorize_with_sieve};
pub use next_prime::next_prime;
pub use prev_prime::prev_prime;
pub use primality::{fermat, miller_rabin};
pub use sieve::sieve_of_eratosthenes;
