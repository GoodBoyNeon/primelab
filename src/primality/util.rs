pub fn base_cases(n: u32) -> Option<f64> {
  if n < 2 {
    return Some(-1.0);
  }
  if n == 2 || n == 3 {
    return Some(1.0);
  }
  if n.is_multiple_of(2) {
    return Some(0.0);
  }
  None
}
