pub fn factorize_with_sieve(n: u32, sieve: &[u32]) -> Vec<u32> {
  let mut factors: Vec<u32> = Vec::new();

  for number in sieve {
    if n == 1 {
      return factors;
    } else {
      divide_check_multiple(n, *number, &mut factors)
    };
  }
  factors
}

fn divide_check_multiple(n: u32, d: u32, factors: &mut Vec<u32>) -> Vec<u32> {
  if n.is_multiple_of(d) {
    let result = n / d;
    factors.push(d);
    divide_check_multiple(result, d, factors)
  } else {
    factors.to_vec()
  }
}
