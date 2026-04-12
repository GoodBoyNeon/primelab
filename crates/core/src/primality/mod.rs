pub mod fermat;
pub mod miller_rabin;
mod util;
use clap::ValueEnum;

#[derive(Clone, ValueEnum)]
pub enum PrimalityAlgorithm {
  Fermat,
  MillerRabin,
}

pub struct PrimalityResult {
  algorithm: PrimalityAlgorithm,
  verdict: PrimalityVerdict,
}

pub enum PrimalityVerdict {
  Prime,
  Composite,
  ProbablePrime { confidence: f64 },
}

impl PrimalityResult {
  // Returns true if either Prime or ProbablePrime
  pub fn is_prime(&self) -> bool {
    !self.is_composite()
  }
  // Returns true if ProbablePrime
  pub fn is_probable_prime(&self) -> bool {
    matches!(self.verdict, PrimalityVerdict::ProbablePrime { .. })
  }
  // Returns true if Prime
  pub fn is_definitely_prime(&self) -> bool {
    matches!(self.verdict, PrimalityVerdict::Prime)
  }
  // Returns true if Composite
  pub fn is_composite(&self) -> bool {
    matches!(self.verdict, PrimalityVerdict::Composite)
  }

  pub fn algorithm(self) -> PrimalityAlgorithm {
    self.algorithm
  }
  pub fn confidence(&self) -> Option<f64> {
    match self.verdict {
      PrimalityVerdict::ProbablePrime { confidence } => Some(confidence),
      _ => None,
    }
  }
}

pub struct PrimalityOptions {
  pub algorithm: PrimalityAlgorithm,
  pub iterations: u32,
}

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
