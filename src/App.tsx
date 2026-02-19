import { useMemo, useState } from 'react'
import { MISSIONS } from './missions'
import './App.css'

const STORAGE_KEY = 'linux-service-quest-progress-v1'

function App() {
  const [current, setCurrent] = useState(() => {
    const saved = Number(localStorage.getItem(STORAGE_KEY) ?? '0')
    return Number.isNaN(saved) ? 0 : Math.min(saved, MISSIONS.length)
  })
  const [selected, setSelected] = useState<string>('')
  const [feedback, setFeedback] = useState<string>('')

  const mission = MISSIONS[current]
  const progress = useMemo(() => Math.round((current / MISSIONS.length) * 100), [current])

  const saveProgress = (next: number) => localStorage.setItem(STORAGE_KEY, String(next))

  const submitAnswer = () => {
    if (!mission || !selected) return
    if (selected === mission.answer) {
      setFeedback('✅ Correct! Mission cleared.')
      const next = current + 1
      setTimeout(() => {
        setSelected('')
        setFeedback('')
        setCurrent(next)
        saveProgress(next)
      }, 900)
    } else {
      setFeedback('❌ Not quite. Read the hint and try again.')
    }
  }

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY)
    setCurrent(0)
    setSelected('')
    setFeedback('Progress reset. You are back to Mission 1.')
  }

  return (
    <main className="app">
      <header>
        <h1>Linux Service Quest</h1>
        <p className="subtitle">Learn service management + IT English in game-style missions.</p>
      </header>

      <section className="hud">
        <div>Level: {Math.min(current + 1, MISSIONS.length)}/{MISSIONS.length}</div>
        <div>Progress: {progress}%</div>
        <button onClick={reset} className="reset">Reset</button>
      </section>

      {!mission ? (
        <section className="card done">
          <h2>🏁 You finished all missions!</h2>
          <p>You now know practical service-management workflows across major Linux distros.</p>
          <button onClick={reset}>Play Again</button>
        </section>
      ) : (
        <section className="card">
          <h2>{mission.title}</h2>
          <p><strong>Distro focus:</strong> {mission.distro}</p>
          <p>{mission.description}</p>

          <div className="term">
            <h3>English + IT Term</h3>
            <p><strong>{mission.term.word}:</strong> {mission.term.meaning}</p>
          </div>

          <div className="hint">
            <h3>Command Hint</h3>
            <code>{mission.command}</code>
          </div>

          <div className="distro-compare">
            <h3>📦 Distro Comparison</h3>
            {mission.distroCommands.map((v) => (
              <div key={v.distro} className="distro-row">
                <strong>{v.distro}</strong>
                <code>{v.command}</code>
                {v.notes && <span className="distro-note">💡 {v.notes}</span>}
              </div>
            ))}
          </div>

          <div className="quiz">
            <h3>Mission Checkpoint</h3>
            <p>{mission.question}</p>
            {mission.options.map((option) => (
              <label key={option} className="option">
                <input
                  type="radio"
                  name="answer"
                  checked={selected === option}
                  onChange={() => setSelected(option)}
                />
                <span>{option}</span>
              </label>
            ))}
            <button onClick={submitAnswer} disabled={!selected}>Submit</button>
            {feedback && <p className="feedback">{feedback}</p>}
          </div>
        </section>
      )}
    </main>
  )
}

export default App
