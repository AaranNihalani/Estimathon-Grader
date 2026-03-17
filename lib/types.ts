export type Team = {
  id: string
  name: string
  members: string[]
  submissions: Submission[]
}

export type Problem = {
  id: string
  number: number
  title?: string
  answer?: number
}

export type Submission = {
  id: string
  teamId: string
  problemId: string
  min: number
  max: number
  createdAt: number
}

export type EventConfig = {
  problemCount: number
  maxSubmissionsPerTeam: number
  durationMinutes: number
}

export type AppState = {
  config: EventConfig
  teams: Team[]
  problems: Problem[]
}
