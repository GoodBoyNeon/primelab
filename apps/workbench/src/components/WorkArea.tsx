import { useApp } from '../context/AppContext'
import MillerRabin from './tools/MillerRabin'
import Fermat from './tools/Fermat'
import Factorization from './tools/Factorization'
import NextPrime from './tools/NextPrime'
import PrevPrime from './tools/PrevPrime'
import Sieve from './tools/Sieve'

export default function WorkArea() {
  const { activeTool } = useApp()

  const tool = {
    'miller-rabin': <MillerRabin />,
    fermat: <Fermat />,
    factorization: <Factorization />,
    'next-prime': <NextPrime />,
    'prev-prime': <PrevPrime />,
    sieve: <Sieve />,
  }[activeTool]

  return (
    <main
      style={{
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
      }}
    >
      {tool}
    </main>
  )
}
