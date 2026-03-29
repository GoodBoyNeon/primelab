pub fn sieve_of_eratosthenes(n: u32) -> Vec<u32> {
  let mut vector: Vec<bool> = vec![true; (n + 1) as usize];
  vector[0] = false;
  vector[1] = false;

  for i in 2..=((n as f64).sqrt() as u32) {
    for multiple in ((i * i)..=n).step_by(i as usize) {
      vector[multiple as usize] = false;
    }
  }

  let mut prime_vec: Vec<u32> = Vec::new();

  for (pos, e) in vector.iter().enumerate() {
    if *e {
      prime_vec.push(pos as u32);
    }
  }

  prime_vec
}
