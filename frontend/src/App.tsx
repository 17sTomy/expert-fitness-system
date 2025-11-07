import { useState } from 'react'
import UserForm from './components/UserForm'
import Results from './components/Results'
import AnimatedBackground from './components/AnimatedBackground'
import { Recommendation } from './types'

function App() {
  const [recommendations, setRecommendations] = useState<Recommendation | null>(null)
  const [loading, setLoading] = useState(false)

  const handleReset = () => {
    setRecommendations(null)
  }

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen py-8 px-4 relative">
        <div className="max-w-6xl mx-auto">
          {!recommendations ? (
            <UserForm 
              setRecommendations={setRecommendations}
              setLoading={setLoading}
              loading={loading}
            />
          ) : (
            <Results 
              recommendations={recommendations}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default App

