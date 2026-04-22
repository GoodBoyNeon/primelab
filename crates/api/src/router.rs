use crate::types::primality::*;
use primelab_core::{fermat, miller_rabin};

pub fn resolve_primality(n: u32, opts: PrimalityOptions) -> PrimalityResult {
  let raw = match opts.algorithm {
    PrimalityAlgorithm::MillerRabin => miller_rabin::test(n, opts.iterations),
    PrimalityAlgorithm::Fermat => fermat::test(n, opts.iterations),
  };

  let verdict = if raw == 1.0 {
    PrimalityVerdict::Prime
  } else if raw == 0.0 {
    PrimalityVerdict::Composite
  } else {
    PrimalityVerdict::ProbablePrime { confidence: raw }
  };

  PrimalityResult {
    algorithm: opts.algorithm,
    verdict,
  }
}
