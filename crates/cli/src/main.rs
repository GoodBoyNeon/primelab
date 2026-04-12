use clap::{Parser, Subcommand, ValueEnum};
use primelab_core::{
  PrimalityAlgorithm, PrimalityOptions, factorize, next_prime, prev_prime, sieve_of_eratosthenes,
  test_primality_with,
};

#[derive(Parser)]
#[command(
  name = "primelab",
  version,
  about = "PRIMELAB CLI - Tool for all things prime!"
)]
struct Cli {
  #[command(subcommand)]
  command: Commands,
}

#[derive(Subcommand)]
enum Commands {
  /// Test whether a number is a prime number.
  IsPrime {
    #[arg()]
    n: u32,
    /// Algorithm used for determining primality.
    #[arg(short, long, default_value = "miller-rabin")]
    algorithm: PrimalityAlgorithm,

    /// Number of iterations. Greater = Higher Confidence
    #[arg(short, long, default_value = "15")]
    iterations: u32,
  },
  /// Get the prime factors of a number.
  Factorize {
    #[arg()]
    n: u32,
    #[arg(short, long, default_value = "default")]
    display: FactorizeFormat,
  },
  /// Get the next consecutive prime number.
  NextPrime {
    #[arg()]
    n: u32,
  },
  /// Get the prime number just smaller than a given number.
  PrevPrime {
    #[arg()]
    n: u32,
  },
  /// Generate sieve upto n.
  Sieve {
    #[arg()]
    n: u32,
  },
}

#[derive(ValueEnum, Clone)]
enum FactorizeFormat {
  Default,
  Raw,
  Compact,
}

fn main() {
  let cli = Cli::parse();

  match cli.command {
    Commands::IsPrime {
      n,
      algorithm,
      iterations,
    } => {
      let res = test_primality_with(
        n,
        PrimalityOptions {
          algorithm,
          iterations,
        },
      );

      if res.is_definitely_prime() {
        println!("{} is a prime number.", n);
      } else if res.is_composite() {
        println!("{} is a composite number.", n);
      } else if res.is_probable_prime() {
        println!(
          "{} is probably prime. Confidence: {:0.4}%",
          n,
          res.confidence().unwrap() * 100.0
        )
      }
    }
    Commands::Factorize { n, display } => {
      let factors = factorize(n);

      match display {
        FactorizeFormat::Default => {
          println!(
            "{}",
            factors
              .iter()
              .map(|f| f.to_string())
              .collect::<Vec<String>>()
              .join(" × ")
          )
        }
        FactorizeFormat::Compact => {
          let mut str: Vec<String> = Vec::new();
          let mut i = 0;
          while i < factors.len() {
            let mut step = 0;
            while i + step < factors.len() && factors[i + step] == factors[i] {
              step += 1
            }
            if step > 1 {
              str.push(format!("{}^{}", factors[i], step));
            } else {
              str.push(format!("{}", factors[i]));
            }
            i += step;
          }
          println!("{}", str.join(" × "))
        }
        FactorizeFormat::Raw => {
          let factors = factorize(n);
          for f in &factors {
            println!("{}", f);
          }
        }
      }
    }
    Commands::NextPrime { n } => {
      println!("{}", next_prime(n));
    }
    Commands::PrevPrime { n } => {
      println!("{}", prev_prime(n));
    }
    Commands::Sieve { n } => {
      let sieve = sieve_of_eratosthenes(n);
      println!(
        "{}",
        sieve
          .iter()
          .map(|p| p.to_string())
          .collect::<Vec<String>>()
          .join(", ")
      );
    }
  }
}
