import { AppState, EventConfig, Problem } from './types'

const DEFAULT_CONFIG: EventConfig = {
  problemCount: 13,
  maxSubmissionsPerTeam: 18,
  durationMinutes: 30,
}

const STORAGE_KEY = 'estimathon-grader:v1'

function seedProblems(n: number): Problem[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `p${i + 1}`,
    number: i + 1,
  }))
}

export function loadState(): AppState {
  if (typeof window === 'undefined') {
    return { config: DEFAULT_CONFIG, teams: [], problems: seedProblems(DEFAULT_CONFIG.problemCount) }
    }
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return { config: DEFAULT_CONFIG, teams: [], problems: seedProblems(DEFAULT_CONFIG.problemCount) }
  try {
    const parsed = JSON.parse(raw) as AppState
    // Backfill problems if config changed
    if (parsed.problems.length !== parsed.config.problemCount) {
      parsed.problems = seedProblems(parsed.config.problemCount)
    }
    return parsed
  } catch {
    return { config: DEFAULT_CONFIG, teams: [], problems: seedProblems(DEFAULT_CONFIG.problemCount) }
  }
}

export function saveState(state: AppState) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function resetState() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
  window.location.reload()
}

export function addTeam(state: AppState, name: string): AppState {
  const id = `t_${crypto.randomUUID()}`
  const next: AppState = { ...state, teams: [...state.teams, { id, name, members: [], submissions: [] }] }
  saveState(next)
  return next
}

export function removeTeam(state: AppState, id: string): AppState {
  const next: AppState = { ...state, teams: state.teams.filter(t => t.id !== id) }
  saveState(next)
  return next
}

export function renameTeam(state: AppState, id: string, name: string): AppState {
  const next: AppState = { ...state, teams: state.teams.map(t => t.id === id ? { ...t, name } : t) }
  saveState(next)
  return next
}

export function setTeamMembers(state: AppState, id: string, members: string[]): AppState {
  const next: AppState = { ...state, teams: state.teams.map(t => t.id === id ? { ...t, members } : t) }
  saveState(next)
  return next
}

export function addTeamWithMembers(state: AppState, name: string, members: string[]): AppState {
  const id = `t_${crypto.randomUUID()}`
  const next: AppState = { ...state, teams: [...state.teams, { id, name, members, submissions: [] }] }
  saveState(next)
  return next
}

export function setAnswer(state: AppState, problemId: string, answer: number | undefined): AppState {
  const next: AppState = {
    ...state,
    problems: state.problems.map(p => p.id === problemId ? { ...p, answer } : p)
  }
  saveState(next)
  return next
}

export function submitInterval(state: AppState, opts: { teamId: string, problemId: string, min: number, max: number }): AppState {
  const team = state.teams.find(t => t.id === opts.teamId)
  if (!team) return state
  const totalSubs = team.submissions.length
  if (totalSubs >= state.config.maxSubmissionsPerTeam) return state
  const sub = {
    id: crypto.randomUUID(),
    teamId: opts.teamId,
    problemId: opts.problemId,
    min: opts.min,
    max: opts.max,
    createdAt: Date.now()
  }
  const next: AppState = {
    ...state,
    teams: state.teams.map(t => t.id === team.id ? { ...t, submissions: [...t.submissions, sub] } : t)
  }
  saveState(next)
  return next
}

export function updateConfig(state: AppState, config: Partial<EventConfig>): AppState {
  const merged: AppState = { ...state, config: { ...state.config, ...config } }
  // regenerate problems if count changed
  if (config.problemCount && config.problemCount !== state.problems.length) {
    merged.problems = Array.from({ length: merged.config.problemCount }, (_, i) => ({
      id: `p${i + 1}`,
      number: i + 1,
    }))
  }
  saveState(merged)
  return merged
}
