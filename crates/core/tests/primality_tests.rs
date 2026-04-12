use primelab_core::test_primality;

#[test]
fn test_edge_cases() {
  assert!(test_primality(0).is_composite());
  assert!(test_primality(1).is_composite());
  assert!(test_primality(2).is_prime());
}

#[test]
fn test_small_primes() {
  let primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
  for &p in primes.iter() {
    assert!(test_primality(p).is_prime());
  }
}

#[test]
fn test_small_composites() {
  let composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20];
  for &n in composites.iter() {
    assert!(test_primality(n).is_composite())
  }
}
