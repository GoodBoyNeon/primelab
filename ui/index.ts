import { millerRabin, fermat, sieve, getPrimeFactors } from '../index.js'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const cli = yargs(hideBin(process.argv))

const testAlgorithms = ['miller-rabin', 'fermat'] as const
type TestAlgorithm = (typeof testAlgorithms)[number]

function handleResult(number: number, probability: number, raw: boolean) {
  const MAX_SAFE_INPUT = 3_037_000_499
  if (number > MAX_SAFE_INPUT) {
    console.log(`Error: ${number} exceeds the maximum supported value of ${MAX_SAFE_INPUT}`)
    process.exit(1)
  }
  if (probability === -1) {
    console.log(`${number} is neither prime nor composite.`)
  } else if (probability === 0) {
    console.log(`${number} is composite.`)
  } else {
    console.log(
      `${number} is ${probability !== 1 ? 'probably ' : ''}prime\n:: Confidence : ${raw ? probability * 100 : (probability * 100).toFixed(4)}%`,
    )
  }
}

cli
  .command(
    'test <number>',
    'Check the primality of a number.',
    (yargs) => {
      return yargs
        .positional('number', {
          type: 'number',
          demandOption: true,
          describe: 'The number to test',
        })
        .option('algorithm', {
          alias: ['alg'],
          type: 'string',
          default: 'miller-rabin' as TestAlgorithm,
          choices: testAlgorithms,
          describe: 'The primality testing algorithm.',
        })
        .option('iterations', {
          alias: ['iter', 'i'],
          type: 'number',
          default: 10,
          describe: 'Number of test iterations.',
        })
        .option('raw', {
          type: 'boolean',
          describe: 'Whether to show exact probability without rounding.',
        })
    },
    (argv) => {
      const { number, algorithm, iterations, raw } = argv

      console.log(`Testing ${number} with ${algorithm} for ${iterations} iteration${iterations === 1 ? '' : 's'}...`)

      switch (algorithm) {
        case 'miller-rabin': {
          const probability = millerRabin(number, iterations)
          handleResult(number, probability, raw ?? false)
          break
        }
        case 'fermat': {
          const probability = fermat(number, iterations)
          handleResult(number, probability, raw ?? false)
          break
        }
      }
    },
  )
  .command(
    'sieve <n>',
    'Generate a list prime numbers upto n using the sieve of Eratosthenes!',
    (yargs) =>
      yargs.positional('n', {
        type: 'number',
        demandOption: true,
        describe: 'The upper bound, inclusive.',
      }),
    (argv) => {
      const { n } = argv
      console.log(sieve(n).join('\n'))
    },
  )
  .command(
    'factorize <n>',
    'Get the prime factors of n',
    (yargs) =>
      yargs
        .positional('n', {
          type: 'number',
          describe: 'The number to factorize',
          demandOption: true,
        })
        .option('display', {
          alias: ['d'],
          type: 'string',
          choices: ['default', 'compact', 'raw'],
          default: 'default',
          describe: 'Choose the format of the factors',
        }),
    (argv) => {
      const { n, display } = argv

      const factors = getPrimeFactors(n)

      switch (display) {
        case 'default':
          console.log(factors.join(' × '))
          break
        case 'compact':
          let str = ''
          let i = 0
          while (i < factors.length) {
            let step = 0
            while (factors[i + step] === factors[i]) {
              step += 1
            }
            if (step > 1) str += `${factors[i]}^${step} × `
            else str += `${factors[i]} × `
            i += step
          }
          console.log(str.trim().slice(0, str.length - 2))
          break
        case 'raw':
          console.log(factors)
          break
      }
    },
  )
  .demandCommand(1)
  .strict()

cli.parse()
