use serde::Serialize;

#[derive(Serialize)]
pub struct PrimalityResponse {
  pub number: u32,
  pub iterations: u32,
  pub is_prime: bool,
  pub is_composite: bool,
  pub is_probable_prime: bool,
  pub confidence: Option<f64>,
}
