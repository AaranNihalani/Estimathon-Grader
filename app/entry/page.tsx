'use client'

import { useEffect, useMemo, useState } from 'react'
import { AppState, Problem, Team } from '../../lib/types'
import { loadState, submitInterval } from '../../lib/state'
import { lastSubmissionFor } from '../../lib/scoring'

export default function EntryPage() {
  const [state, setState] = useState<AppState>(() => loadState())
  useEffect(() => {
    const interval = setInterval(() => setState(loadState()), 800)
    return () => clearInterval(interval)
  }, [])

  const [teamId, setTeamId] = useState<string | null>(null)
  const team = useMemo<Team | undefined>(() => state.teams.find(t => t.id === (teamId ?? '')), [state.teams, teamId])
  const slipsRemaining = team ? state.config.maxSubmissionsPerTeam - team.submissions.length : 0

  return (
    <div className="mt-4 space-y-4">
      <h1 className="text-2xl font-semibold text-slate-50">Interval Entry</h1>
      <p className="text-sm text-slate-400">Choose a team, then submit positive intervals. Only the last submission per problem counts.</p>

      <div className="glass p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <label className="text-sm">
            <span className="mr-2 text-slate-300">Team</span>
            <select
              value={teamId ?? ''}
              onChange={e => setTeamId(e.target.value || null)}
              className="bg-slate-900/80 border border-slate-700 rounded px-3 py-2 text-sm"
            >
              <option value="">Select a team…</option>
              {state.teams.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </label>
          {team && (
            <div className="text-xs text-slate-400">
              Members: {team.members.length ? team.members.join(', ') : '—'} · Slips remaining: {slipsRemaining}
            </div>
          )}
        </div>

        {!team && <div className="mt-6 text-slate-500 text-sm">Select a team to begin.</div>}

        {team && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {state.problems.map((p: Problem) => {
              const last = lastSubmissionFor(team, p.id)
              return (
                <div key={p.id} className="p-3 border border-slate-800 rounded-lg bg-slate-900/60">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-slate-100">Problem {p.number}</div>
                    <div className="text-xs text-slate-400">{last ? `[${last.min}, ${last.max}]` : '—'}</div>
                  </div>
                  <form
                    className="grid grid-cols-[1fr,1fr,auto] gap-2 items-center"
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (slipsRemaining <= 0) return
                      const data = new FormData(e.currentTarget as HTMLFormElement)
                      const min = parseFloat(String(data.get('min') || ''))
                      const max = parseFloat(String(data.get('max') || ''))
                      if (Number.isFinite(min) && Number.isFinite(max) && min > 0 && max >= min) {
                        setState(submitInterval(state, { teamId: team.id, problemId: p.id, min, max }))
                        ;(e.target as HTMLFormElement).reset()
                      }
                    }}
                  >
                    <input type="number" step="any" min={0} name="min" placeholder="min" className="min-w-0 w-full bg-slate-900/80 border border-slate-700 rounded px-2 py-1 text-sm" />
                    <input type="number" step="any" min={0} name="max" placeholder="max" className="min-w-0 w-full bg-slate-900/80 border border-slate-700 rounded px-2 py-1 text-sm" />
                    <button
                      disabled={slipsRemaining <= 0}
                      className="whitespace-nowrap bg-brand-600 hover:bg-brand-500 disabled:opacity-40 px-3 py-1 rounded text-sm text-white"
                    >
                      Submit
                    </button>
                  </form>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
