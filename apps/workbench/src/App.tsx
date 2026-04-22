import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'

export default function App() {
  const [result, setResult] = useState<string>('')

  async function test() {
    const res = await invoke('is_prime', {
      n: 17,
      algorithm: 'MillerRabin',
      iterations: 15,
    })
    setResult(JSON.stringify(res))
  }

  return (
    <div>
      <button onClick={test}>Test</button>
      <p>res:{result}</p>
    </div>
  )
}
