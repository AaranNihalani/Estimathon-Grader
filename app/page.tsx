'use client'

import { useEffect, useMemo, useState } from 'react'
import { AppState } from '../lib/types'
import { leaderboard } from '../lib/scoring'
import { loadState } from '../lib/state'

export default function Page() {
  const [state, setState] = useState<AppState>(() => loadState())
  const [presenter, setPresenter] = useState(false)
  useEffect(() => {
    const interval = setInterval(() => setState(loadState()), 1000)
    return () => clearInterval(interval)
  }, [])
  useEffect(() => {
    const v = localStorage.getItem('presenterMode')
    if (v === '1') {
      setPresenter(true)
      document.documentElement.classList.add('presenter')
    }
  }, [])
  const togglePresenter = (on: boolean) => {
    setPresenter(on)
    if (on) {
      localStorage.setItem('presenterMode', '1')
      document.documentElement.classList.add('presenter')
    } else {
      localStorage.removeItem('presenterMode')
      document.documentElement.classList.remove('presenter')
    }
  }

  const board = useMemo(() => leaderboard(state), [state])

  return (
    <div className="mt-4 space-y-4 scoreboard">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">Scoreboard</h1>
          <p className="text-sm text-slate-400">Lowest score wins.</p>
        </div>
        <label className="text-xs text-slate-300 flex items-center gap-2">
          <input
            type="checkbox"
            checked={presenter}
            onChange={e => togglePresenter(e.target.checked)}
            className="accent-brand-600"
          />
          Presenter mode
        </label>
      </div>

      <div className="glass p-4 md:p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-slate-400 border-b border-slate-800">
              <tr>
                <th className="text-left py-2 pr-4">Rank</th>
                <th className="text-left py-2 pr-4">Team</th>
                <th className="text-left py-2 pr-4 scoreboard-members">Members</th>
                <th className="text-right py-2 pr-4">Score</th>
                <th className="text-right py-2 pr-4">Correct</th>
                <th className="text-right py-2 pr-4">Wrong/Blank</th>
              </tr>
            </thead>
            <tbody>
              {board.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">No teams yet. Add teams in Admin.</td>
                </tr>
              )}
              {board.map(({ team, result }, idx) => (
                <tr key={team.id} className="border-t border-slate-800">
                  <td className="py-3 pr-4">{idx + 1}</td>
                  <td className="py-3 pr-4 font-medium text-slate-50">{team.name}</td>
                  <td className="py-3 pr-4 text-slate-400 text-xs max-w-xs truncate scoreboard-members">
                    {team.members.length ? team.members.join(', ') : '—'}
                  </td>
                  <td className="py-3 pr-4 text-right tabular-nums">{result.score.toFixed(4)}</td>
                  <td className="py-3 pr-4 text-right">{result.correctCount}</td>
                  <td className="py-3 pr-4 text-right">{result.wrongOrBlank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
