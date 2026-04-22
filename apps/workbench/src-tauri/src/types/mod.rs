use serde::Serialize;

#[derive(Serialize)]
pub struct PrimalityResponse {
  pub is_prime: bool,
  pub is_composite: bool,
  pub is_probable_prime: bool,
  pub confidence: Option<f64>,
}

// impl From<primelab_api::command::TimedResult> for PrimalityResponse {
//   fn from(timed: TimedResult) -> Self {
//     match timed.result {
//       CommandResult::Primality(r) => PrimalityResponse {
//         is_composite: r.is_composite(),
//         is_probable_prime: r.is_probable_prime(),
//         is_definitely_prime: r.is_definitely_prime(),
//         confidence: r.confidence(),
//         elapsed_ms: timed.elapsed.as_millis(),
//       },
//       _ => unreachable!("Expected Primality result"),
//     }
//   }
// }
