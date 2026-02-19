import { useMemo, useState } from 'react'
import { MISSIONS } from './missions'
import Glossary from './Glossary'
import ReviewMode, { addMistake, clearMistakes, getMistakes } from './ReviewMode'
import './App.css'

const STORAGE_KEY = 'linux-service-quest-progress-v1'
const XP_KEY = 'linux-service-quest-xp-v1'
const XP_PER_LEVEL = 300
const XP_CORRECT = 100
const XP_RETRY = 50

function App() {
  const [current, setCurrent] = useState(() => {
    const saved = Number(localStorage.getItem(STORAGE_KEY) ?? '0')
    return Number.isNaN(saved) ? 0 : Math.min(saved, MISSIONS.length)
  })
  const [xp, setXp] = useState(() => Number(localStorage.getItem(XP_KEY) ?? '0'))
  const [selected, setSelected] = useState<string>('')
  const [feedback, setFeedback] = useState<string>('')
  const [hadWrong, setHadWrong] = useState(false)
  const [levelUp, setLevelUp] = useState<number | null>(null)
  const [showGlossary, setShowGlossary] = useState(false)
  const [showReview, setShowReview] = useState(false)

  const mission = MISSIONS[current]
  const progress = useMemo(() => Math.round((current / MISSIONS.length) * 100), [current])
  const level = Math.floor(xp / XP_PER_LEVEL) + 1
  const xpInLevel = xp % XP_PER_LEVEL
  const xpPercent = Math.round((xpInLevel / XP_PER_LEVEL) * 100)

  const saveProgress = (next: number) => localStorage.setItem(STORAGE_KEY, String(next))
  const saveXp = (val: number) => { localStorage.setItem(XP_KEY, String(val)); setXp(val) }

  const submitAnswer = () => {
    if (!mission || !selected) return
    if (selected === mission.answer) {
      const earned = hadWrong ? XP_RETRY : XP_CORRECT
      const newXp = xp + earned
      const oldLevel = Math.floor(xp / XP_PER_LEVEL) + 1
      const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1

      setFeedback(`✅ Correct! +${earned} XP`)
      saveXp(newXp)

      if (newLevel > oldLevel) {
        setLevelUp(newLevel)
        setTimeout(() => setLevelUp(null), 2000)
      }

      const next = current + 1
      setTimeout(() => {
        setSelected('')
        setFeedback('')
        setHadWrong(false)
        setCurrent(next)
        saveProgress(next)
      }, 900)
    } else {
      setHadWrong(true)
      if (mission) addMistake(mission.id)
      setFeedback('❌ Not quite. Read the hint and try again.')
    }
  }

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(XP_KEY)
    clearMistakes()
    setCurrent(0)
    setXp(0)
    setSelected('')
    setHadWrong(false)
    setShowReview(false)
    setShowGlossary(false)
    setFeedback('Progress reset. You are back to Mission 1.')
  }

  return (
    <main className="app">
      <header>
        <h1>Linux Service Quest</h1>
        <p className="subtitle">Learn service management + IT English in game-style missions.</p>
      </header>

      {levelUp && (
        <div className="level-up">🎉 Level Up! You are now Level {levelUp}!</div>
      )}

      <section className="hud">
        <div>Mission: {Math.min(current + 1, MISSIONS.length)}/{MISSIONS.length}</div>
        <div>Level {level}</div>
        <div className="xp-bar-wrap">
          <div className="xp-bar" style={{ width: `${xpPercent}%` }} />
          <span className="xp-label">{xpInLevel}/{XP_PER_LEVEL} XP</span>
        </div>
        <div>Progress: {progress}%</div>
        <button onClick={reset} className="reset">Reset</button>
        <button onClick={() => { setShowGlossary(!showGlossary); setShowReview(false) }} className="reset">
          {showGlossary ? 'Missions' : '📖 Glossary'}
        </button>
        {getMistakes().length > 0 && (
          <button onClick={() => { setShowReview(!showReview); setShowGlossary(false) }} className="reset">
            {showReview ? 'Missions' : `🔄 Review (${getMistakes().length})`}
          </button>
        )}
      </section>

      {showGlossary ? (
        <Glossary completed={current} onBack={() => setShowGlossary(false)} />
      ) : showReview ? (
        <ReviewMode onBack={() => setShowReview(false)} />
      ) : (
      <>

      {!mission ? (
        <section className="card done">
          <h2>🏁 You finished all missions!</h2>
          <p>Total XP: {xp} · Level {level}</p>
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
      </>
      )}
    </main>
  )
}

export default App
