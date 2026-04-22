use std::time::Duration;

/// Lightweight telemetry logger.
/// Can be toggled off later or replaced with `log`/`tracing`.
pub fn log_timing(label: &str, duration: Duration) {
  if cfg!(debug_assertions) {
    println!(
      "[telemetry] {:<20} {:>8.3} ms",
      label,
      duration.as_secs_f64() * 1000.0
    );
  }
}
