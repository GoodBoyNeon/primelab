use primelab_core::{factorize, next_prime, prev_prime, sieve_of_eratosthenes};

use crate::{
  router::resolve_primality,
  telemetry::log_timing,
  types::primality::{PrimalityAlgorithm, PrimalityOptions, PrimalityResult},
};
use std::time::{Duration, Instant};

pub enum Command {
  IsPrime { n: u32 },
  IsPrimeWith { n: u32, opts: PrimalityOptions },
  Factorize { n: u32 },
  NextPrime { n: u32 },
  PrevPrime { n: u32 },
  Sieve { n: u32 },
}

pub enum CommandResult {
  Primality(PrimalityResult),
  Factorization(Vec<u32>),
  NextPrime(u32),
  PrevPrime(u32),
  Sieve(Vec<u32>),
}

pub struct TimedResult {
  pub result: CommandResult,
  pub elapsed: Duration,
}

impl Command {
  pub fn execute(self) -> CommandResult {
    match self {
      Command::IsPrime { n } => {
        let start = Instant::now();
        let result = resolve_primality(
          n,
          PrimalityOptions {
            algorithm: PrimalityAlgorithm::MillerRabin,
            iterations: 15,
          },
        );
        log_timing("is_prime", start.elapsed());
        CommandResult::Primality(result)
      }
      Command::IsPrimeWith { n, opts } => {
        let start = Instant::now();
        let result = resolve_primality(n, opts);

        log_timing("is_prime_with", start.elapsed());
        CommandResult::Primality(result)
      }
      Command::Factorize { n } => {
        let start = Instant::now();
        let result = factorize(n);

        log_timing("factorize", start.elapsed());
        CommandResult::Factorization(result)
      }
      Command::NextPrime { n } => {
        let result = next_prime(n);
        CommandResult::NextPrime(result)
      }
      Command::PrevPrime { n } => {
        let result = prev_prime(n);
        CommandResult::NextPrime(result)
      }
      Command::Sieve { n } => {
        let result = sieve_of_eratosthenes(n);
        CommandResult::Sieve(result)
      }
    }
  }
}
