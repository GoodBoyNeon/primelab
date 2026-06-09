export interface MetricState {
  executionTimeUs: number // in microseconds
  inputSizeBits: number
  complexity: string
  operationsCount: number
  status: 'idle' | 'computing' | 'success' | 'error'
  errorMsg?: string
}

export type Tool = 'miller-rabin' | 'fermat' | 'factorization' | 'next-prime' | 'prev-prime' | 'sieve'

export interface NavItem {
  id: Tool
  label: string
}

export interface NavCategory {
  label: string
  items: NavItem[]
}

export const NAV: NavCategory[] = [
  {
    label: 'Primality',
    items: [
      { id: 'miller-rabin', label: 'Miller-Rabin' },
      { id: 'fermat', label: 'Fermat' },
    ],
  },
  {
    label: 'Factorization',
    items: [{ id: 'factorization', label: 'Factorize' }],
  },
  {
    label: 'Primes',
    items: [
      { id: 'next-prime', label: 'Next Prime' },
      { id: 'prev-prime', label: 'Previous Prime' },
    ],
  },
  {
    label: 'Sieve',
    items: [{ id: 'sieve', label: 'Eratosthenes' }],
  },
]

// Tauri response types
export interface PrimalityResponse {
  number: number
  iterations: number
  is_prime: boolean
  is_composite: boolean
  is_probable_prime: boolean
  confidence: number | null
}

export interface StatusInfo {
  tool: string
  elapsed_ms: number | null
  summary: string
}
