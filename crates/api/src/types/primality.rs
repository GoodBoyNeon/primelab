use serde::Deserialize;
use std::str::FromStr;

#[derive(Deserialize, Clone)]
pub enum PrimalityAlgorithm {
  Fermat,
  MillerRabin,
}

impl FromStr for PrimalityAlgorithm {
  type Err = String;

  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s.to_lowercase().as_str() {
      "miller-rabin" | "miller_rabin" => Ok(Self::MillerRabin),
      "fermat" => Ok(Self::Fermat),
      _ => Err(format!("Invalid algorithm: {}", s)),
    }
  }
}

pub struct PrimalityOptions {
  pub algorithm: PrimalityAlgorithm,
  pub iterations: u32,
}

pub struct PrimalityResult {
  pub algorithm: PrimalityAlgorithm,
  pub verdict: PrimalityVerdict,
}

pub enum PrimalityVerdict {
  Prime,
  Composite,
  ProbablePrime { confidence: f64 },
}

impl PrimalityResult {
  // Returns true if ProbablePrime
  pub fn is_probable_prime(&self) -> bool {
    matches!(self.verdict, PrimalityVerdict::ProbablePrime { .. })
  }
  // Returns true if Prime
  pub fn is_prime(&self) -> bool {
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
