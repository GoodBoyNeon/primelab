use clap::{Parser, Subcommand, ValueEnum};
use primelab_api::{Command, CommandResult};
// use primelab_core::{
//   PrimalityAlgorithm, PrimalityOptions, factorize, next_prime, prev_prime, sieve_of_eratosthenes,
// };
use primelab_api::types::primality::{PrimalityAlgorithm, PrimalityOptions};
use primelab_api::Command::IsPrimeWith;

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
      let res: CommandResult = IsPrimeWith {
        n,
        opts: PrimalityOptions {
          algorithm,
          iterations,
        },
      }
      .execute();

      let primality = match res {
        CommandResult::Primality(p) => p,
        _ => unreachable!(),
      };

      if primality.is_prime() {
        println!("{} is a prime number.", n);
      } else if primality.is_composite() {
        println!("{} is a composite number.", n);
      } else if primality.is_probable_prime() {
        println!(
          "{} is probably prime. Confidence: {:0.4}%",
          n,
          primality.confidence().unwrap() * 100.0
        )
      }
    }
    Commands::Factorize { n, display } => {
      let res = Command::Factorize { n }.execute();

      let factors = match res {
        CommandResult::Factorization(f) => f,
        _ => unreachable!(),
      };

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
          for f in &factors {
            println!("{}", f);
          }
        }
      }
    }
    Commands::NextPrime { n } => {
      let res = match (Command::NextPrime { n }.execute()) {
        CommandResult::NextPrime(p) => p,
        _ => unreachable!(),
      };
      println!("{}", res);
    }
    Commands::PrevPrime { n } => {
      let res = match (Command::PrevPrime { n }.execute()) {
        CommandResult::PrevPrime(p) => p,
        _ => unreachable!(),
      };
      println!("{}", res);
    }
    Commands::Sieve { n } => {
      let sieve = match (Command::Sieve { n }.execute()) {
        CommandResult::Sieve(s) => s,
        _ => unreachable!(),
      };

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
