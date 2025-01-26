import ScenicSpace from './components/ScenicSpace'
import { BackgroundAudio } from '@/utils/AudioPlayer'
import MusicController from './components/MusicController'
import { useState } from 'react'

export default function App() {
  const [audioPlayer] = useState(() => new BackgroundAudio())
  
  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <ScenicSpace />
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
      }}>
        <div style={{ position: 'absolute', top: '1rem', right: '2rem', pointerEvents: 'auto' }}>
          <MusicController audioPlayer={audioPlayer} onUpdate={() => {}} />
        </div>
      </div>
    </main>
  )
}