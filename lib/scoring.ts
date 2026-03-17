import { AppState, Problem, Submission, Team } from './types'

export function intervalWidth(min: number, max: number) {
  return max / min
}

export function lastSubmissionFor(team: Team, problemId: string): Submission | undefined {
  return [...team.submissions]
    .filter(s => s.problemId === problemId)
    .sort((a, b) => b.createdAt - a.createdAt)[0]
}

export function isCorrect(sub: Submission, problem: Problem): boolean | undefined {
  if (problem.answer == null) return undefined
  const a = problem.answer
  return sub.min <= a && a <= sub.max
}

export function teamScore(state: AppState, team: Team) {
  const problems = state.problems
  let widthProduct = 1
  let wrongOrBlank = 0
  let correctCount = 0
  for (const p of problems) {
    const sub = lastSubmissionFor(team, p.id)
    if (!sub) {
      wrongOrBlank += 1
      continue
    }
    widthProduct *= intervalWidth(sub.min, sub.max)
    const correct = isCorrect(sub, p)
    if (correct === true) correctCount += 1
    if (correct === false) wrongOrBlank += 1
  }
  const score = widthProduct * Math.pow(2, wrongOrBlank)
  return {
    widthProduct,
    wrongOrBlank,
    correctCount,
    score
  }
}

export function leaderboard(state: AppState) {
  return [...state.teams]
    .map(t => ({ team: t, result: teamScore(state, t) }))
    .sort((a, b) => a.result.score - b.result.score)
}
