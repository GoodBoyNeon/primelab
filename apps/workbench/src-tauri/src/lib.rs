mod types;

use crate::types::PrimalityResponse;
use primelab_api::{
  types::primality::{PrimalityAlgorithm, PrimalityOptions},
  Command::IsPrimeWith,
  CommandResult,
};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn is_prime(n: u32, algorithm: PrimalityAlgorithm, iterations: u32) -> PrimalityResponse {
  let raw = match (IsPrimeWith {
    n,
    opts: PrimalityOptions {
      algorithm,
      iterations,
    },
  }
  .execute())
  {
    CommandResult::Primality(p) => p,
    _ => unreachable!(),
  };

  if raw.is_prime() {
    PrimalityResponse {
      is_prime: true,
      is_composite: false,
      is_probable_prime: true,
      confidence: None,
    }
  } else if raw.is_composite() {
    PrimalityResponse {
      is_prime: false,
      is_composite: true,
      is_probable_prime: false,
      confidence: None,
    }
  } else {
    PrimalityResponse {
      is_prime: false,
      is_composite: false,
      is_probable_prime: true,
      confidence: raw.confidence(),
    }
  }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(tauri::generate_handler![greet, is_prime])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
