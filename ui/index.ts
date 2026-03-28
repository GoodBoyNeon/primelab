import { getPrimalityProbability } from '../index.js'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const cli = yargs(hideBin(process.argv))

const testAlgorithms = ['miller-rabin'] as const
type TestAlgorithm = (typeof testAlgorithms)[number]

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

      switch (algorithm) {
        case 'miller-rabin': {
          const MAX_SAFE_INPUT = 3_037_000_499
          const probability = getPrimalityProbability(number, iterations)

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
      }
    },
  )
  .demandCommand(1)
  .strict()

cli.parse()
