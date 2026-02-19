import { useState } from 'react'
import { MISSIONS } from './missions'

const MISTAKES_KEY = 'linux-service-quest-mistakes-v1'

export function getMistakes(): string[] {
  try {
    return JSON.parse(localStorage.getItem(MISTAKES_KEY) || '[]')
  } catch { return [] }
}

export function addMistake(missionId: string) {
  const m = getMistakes()
  if (!m.includes(missionId)) {
    m.push(missionId)
    localStorage.setItem(MISTAKES_KEY, JSON.stringify(m))
  }
}

export function removeMistake(missionId: string) {
  const m = getMistakes().filter((id) => id !== missionId)
  localStorage.setItem(MISTAKES_KEY, JSON.stringify(m))
}

export function clearMistakes() {
  localStorage.removeItem(MISTAKES_KEY)
}

type Props = { onBack: () => void }

export default function ReviewMode({ onBack }: Props) {
  const [mistakes, setMistakes] = useState(getMistakes)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState('')
  const [feedback, setFeedback] = useState('')

  const missionIds = mistakes
  const mission = MISSIONS.find((m) => m.id === missionIds[current])

  const submit = () => {
    if (!mission || !selected) return
    if (selected === mission.answer) {
      setFeedback('✅ Correct! Removed from review list.')
      removeMistake(mission.id)
      const updated = getMistakes()
      setMistakes(updated)
      setTimeout(() => {
        setSelected('')
        setFeedback('')
        if (current >= updated.length) setCurrent(Math.max(0, updated.length - 1))
      }, 900)
    } else {
      setFeedback('❌ Try again. Review the hint above.')
    }
  }

  if (missionIds.length === 0) {
    return (
      <section className="card done">
        <h2>🎯 No mistakes to review!</h2>
        <p>You've cleared all your wrong answers. Great work!</p>
        <button onClick={onBack}>← Back to Missions</button>
      </section>
    )
  }

  if (!mission) {
    return (
      <section className="card">
        <p>Review complete!</p>
        <button onClick={onBack}>← Back to Missions</button>
      </section>
    )
  }

  return (
    <section className="card">
      <h2>🔄 Review: {mission.title}</h2>
      <p className="review-count">Reviewing {missionIds.length} missed question{missionIds.length !== 1 ? 's' : ''} ({current + 1}/{missionIds.length})</p>
      <p>{mission.description}</p>

      <div className="hint">
        <h3>Command Hint</h3>
        <code>{mission.command}</code>
      </div>

      <div className="term">
        <h3>English + IT Term</h3>
        <p><strong>{mission.term.word}:</strong> {mission.term.meaning}</p>
      </div>

      <div className="quiz">
        <h3>Try Again</h3>
        <p>{mission.question}</p>
        {mission.options.map((option) => (
          <label key={option} className="option">
            <input type="radio" name="review" checked={selected === option} onChange={() => setSelected(option)} />
            <span>{option}</span>
          </label>
        ))}
        <button onClick={submit} disabled={!selected}>Submit</button>
        {feedback && <p className="feedback">{feedback}</p>}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem' }}>
        {current > 0 && <button onClick={() => { setCurrent(current - 1); setSelected(''); setFeedback('') }}>← Prev</button>}
        {current < missionIds.length - 1 && <button onClick={() => { setCurrent(current + 1); setSelected(''); setFeedback('') }}>Next →</button>}
        <button onClick={onBack} className="reset">← Back</button>
      </div>
    </section>
  )
}
