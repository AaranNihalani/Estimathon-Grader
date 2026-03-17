'use client'

import { useEffect, useMemo, useState } from 'react'
import { AppState, Problem, Team } from '../../lib/types'
import { addTeam, addTeamWithMembers, loadState, removeTeam, renameTeam, resetState, setAnswer, setTeamMembers, submitInterval, updateConfig } from '../../lib/state'
import { lastSubmissionFor } from '../../lib/scoring'

function TeamRow({ team, problems, onSubmit }: { team: Team, problems: Problem[], onSubmit: (p: { teamId: string, problemId: string, min: number, max: number }) => void }) {
  return (
    <div className="glass p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold text-slate-50">{team.name}</div>
          <div className="text-xs text-slate-400 mt-1">
            {team.members.length ? team.members.join(', ') : 'No members recorded'}
          </div>
        </div>
        <div className="text-xs text-slate-400">{team.submissions.length} submissions</div>
      </div>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {problems.map(p => {
          const last = lastSubmissionFor(team, p.id)
          return (
            <div key={p.id} className="p-3 border border-slate-800 rounded-lg bg-slate-900/60">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-100">Problem {p.number}</div>
                <div className="text-xs text-slate-400">{last ? `[${last.min}, ${last.max}]` : '—'}</div>
              </div>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  const data = new FormData(e.currentTarget as HTMLFormElement)
                  const min = parseFloat(String(data.get('min') || ''))
                  const max = parseFloat(String(data.get('max') || ''))
                  if (Number.isFinite(min) && Number.isFinite(max) && min > 0 && max >= min) {
                    onSubmit({ teamId: team.id, problemId: p.id, min, max })
                    ;(e.target as HTMLFormElement).reset()
                  }
                }}
              >
                <input type="number" step="any" min={0} name="min" placeholder="min" className="flex-1 bg-slate-900/80 border border-slate-700 rounded px-2 py-1 text-sm" />
                <input type="number" step="any" min={0} name="max" placeholder="max" className="flex-1 bg-slate-900/80 border border-slate-700 rounded px-2 py-1 text-sm" />
                <button className="bg-brand-600 hover:bg-brand-500 px-3 py-1 rounded text-sm text-white">Submit</button>
              </form>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [state, setState] = useState<AppState>(() => loadState())
  useEffect(() => {
    const interval = setInterval(() => setState(loadState()), 1000)
    return () => clearInterval(interval)
  }, [])

  const [teamName, setTeamName] = useState('')
  const [teamMembers, setTeamMembersInput] = useState('')
  const [search, setSearch] = useState('')
  const teams = useMemo(() => {
    return state.teams.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
  }, [state.teams, search])

  return (
    <div className="space-y-6 mt-6">
      <section className="glass p-6">
        <h2 className="text-xl font-semibold">Event Setup</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="text-sm">
            <div className="text-white/60 mb-1">Problems</div>
            <input
              type="number"
              min={1}
              value={state.config.problemCount}
              onChange={e => setState(updateConfig(state, { problemCount: parseInt(e.target.value, 10) }))}
              className="w-full bg-white/5 rounded px-3 py-2"
            />
          </label>
          <label className="text-sm">
            <div className="text-white/60 mb-1">Max submissions per team</div>
            <input
              type="number"
              min={1}
              value={state.config.maxSubmissionsPerTeam}
              onChange={e => setState(updateConfig(state, { maxSubmissionsPerTeam: parseInt(e.target.value, 10) }))}
              className="w-full bg-white/5 rounded px-3 py-2"
            />
          </label>
          <label className="text-sm">
            <div className="text-white/60 mb-1">Duration (minutes)</div>
            <input
              type="number"
              min={1}
              value={state.config.durationMinutes}
              onChange={e => setState(updateConfig(state, { durationMinutes: parseInt(e.target.value, 10) }))}
              className="w-full bg-white/5 rounded px-3 py-2"
            />
          </label>
        </div>
      </section>

      <section className="glass p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Teams</h2>
          <div className="flex items-center gap-2">
            <input
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              placeholder="Team name"
              className="bg-white/5 rounded px-3 py-2 text-sm"
            />
            <input
              value={teamMembers}
              onChange={e => setTeamMembersInput(e.target.value)}
              placeholder="Members (comma-separated)"
              className="bg-white/5 rounded px-3 py-2 text-sm w-64"
            />
            <button
              onClick={() => {
                if (teamName.trim().length === 0) return
                const members = teamMembers.split(',').map(m => m.trim()).filter(Boolean)
                setState(addTeamWithMembers(state, teamName.trim(), members))
                setTeamName('')
                setTeamMembersInput('')
              }}
              className="bg-brand-600 hover:bg-brand-500 px-3 py-2 rounded text-sm"
            >
              Add team
            </button>
          </div>
        </div>
        <div className="mt-3">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search teams…"
            className="bg-white/5 rounded px-3 py-2 text-sm w-full md:w-64"
          />
        </div>
        <div className="mt-4 grid gap-4">
          {teams.map(t => (
            <div key={t.id} className="glass p-4">
              <div className="flex items-center justify-between gap-2">
                <input
                  value={t.name}
                  onChange={e => setState(renameTeam(state, t.id, e.target.value))}
                  className="bg-white/5 rounded px-3 py-2 text-sm flex-1"
                />
                <button
                  onClick={() => setState(removeTeam(state, t.id))}
                  className="text-sm text-white/60 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
              <div className="mt-3 text-xs text-white/60">
                Members: {t.members.length ? t.members.join(', ') : '—'}
              </div>
              <form
                className="mt-2 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  const form = e.currentTarget
                  const data = new FormData(form)
                  const raw = String(data.get('members') || '')
                  const members = raw.split(',').map(s => s.trim()).filter(Boolean)
                  setState(setTeamMembers(state, t.id, members))
                }}
              >
                <input name="members" defaultValue={t.members.join(', ')} placeholder="Edit members…" className="bg-white/5 rounded px-3 py-2 text-sm flex-1" />
                <button className="bg-brand-600 hover:bg-brand-500 px-3 py-2 rounded text-sm">Save</button>
              </form>
            </div>
          ))}
          {teams.length === 0 && <div className="text-white/50 text-sm">No teams yet.</div>}
        </div>
      </section>

      <section className="glass p-6">
        <h2 className="text-xl font-semibold">Answers</h2>
        <p className="text-white/60 text-sm">Enter the true answers when the round ends to finalize scores.</p>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {state.problems.map(p => (
            <div key={p.id} className="p-3 border border-slate-800 rounded-lg">
              <div className="mb-2 text-sm">Problem {p.number}</div>
              <input
                type="number"
                step="any"
                value={p.answer ?? ''}
                onChange={e => {
                  const v = e.target.value
                  setState(setAnswer(state, p.id, v === '' ? undefined : parseFloat(v)))
                }}
                className="w-full bg-white/5 rounded px-2 py-1 text-sm"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="glass p-6">
        <h2 className="text-xl font-semibold text-slate-100">Interval Entry</h2>
        <p className="text-white/60 text-sm">For entering intervals, please use the Entry tab to avoid clutter.</p>
      </section>

      <section className="glass p-6">
        <h2 className="text-xl font-semibold text-red-300">Danger Zone</h2>
        <p className="text-slate-400 text-sm">Reset will permanently clear all teams, submissions, and answers on this device.</p>
        <button
          onClick={resetState}
          className="mt-4 text-sm text-red-400 hover:text-red-300 border border-red-500/40 px-3 py-2 rounded-md"
        >
          Reset all event data
        </button>
      </section>
    </div>
  )
}
