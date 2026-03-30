# PrimeLab

A **Prime Number Laboratory** for testing and generating prime numbers, powered by Rust and TypeScript!

## Installation

> Due to the project still being under-development in alpha version, use of it is not recommended unless for testing purposes.

Binaries for the project aren't being shipped yet. You must compile the project and run it using `Node`:

```
# After cloning the repository/downloading the source-code:
yarn build
```

Then run the application using:

```
npx tsx ui/index.ts
```

## Usage

This is currently a CLI app only.

See `tsx ui/index.ts help` for more information.

> For the purposes of this section, `tsx ui/index.ts` is replaced with `primelab` for simplicity.

1. Testing the primality of a number:

```
primelab test <n>
```

- Uses Miller-Rabin by default, for alternative algorithms, see `--alg`

2. Prime number after `n`

```
primelab next-prime <n>
```

3. Prime number before `n`

```
primelab prev-prime <n>
```

4. Prime Factorization

```
primelab factorize <n>
```

- See `--display` for more output formats.

5. Sieve Generation

Generates all prime numbers upto `n`

```
primelab sieve <n>
```

## Mechanics

- Generation: Prime number generation from `2` to `n` using [Sieve of Eratosthenes](https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes)
- Testing: Implements [Miller–Rabin primality test](https://en.wikipedia.org/wiki/Miller%E2%80%93Rabin_primality_test) and [Fermat primality test](https://en.wikipedia.org/wiki/Fermat_primality_test) algorithms to produce a probabilistic determination of the primality of any given number.

## Contributing

All contributions are welcomed under the assumption that it follows the principle direction of this project.
