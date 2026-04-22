use crate::types::primality::*;
use primelab_core::{fermat, miller_rabin};

pub fn test_primality(n: u32) -> PrimalityResult {
  test_primality_with(
    n,
    PrimalityOptions {
      algorithm: PrimalityAlgorithm::MillerRabin,
      iterations: 15,
    },
  )
}

pub fn test_primality_with(n: u32, opts: PrimalityOptions) -> PrimalityResult {
  match opts.algorithm {
    PrimalityAlgorithm::Fermat => {
      let res = fermat::test(n, opts.iterations);
      if res == 1.0 {
        PrimalityResult {
          algorithm: PrimalityAlgorithm::Fermat,
          verdict: PrimalityVerdict::Prime,
        }
      } else if res == 0.0 {
        PrimalityResult {
          algorithm: PrimalityAlgorithm::Fermat,
          verdict: PrimalityVerdict::Composite,
        }
      } else {
        PrimalityResult {
          algorithm: PrimalityAlgorithm::Fermat,
          verdict: PrimalityVerdict::ProbablePrime { confidence: res },
        }
      }
    }
    PrimalityAlgorithm::MillerRabin => {
      let res = miller_rabin::test(n, opts.iterations);
      if res == 1.0 {
        PrimalityResult {
          algorithm: PrimalityAlgorithm::MillerRabin,
          verdict: PrimalityVerdict::Prime,
        }
      } else if res == 0.0 {
        PrimalityResult {
          algorithm: PrimalityAlgorithm::MillerRabin,
          verdict: PrimalityVerdict::Composite,
        }
      } else {
        PrimalityResult {
          algorithm: PrimalityAlgorithm::MillerRabin,
          verdict: PrimalityVerdict::ProbablePrime { confidence: res },
        }
      }
    }
  }
}
