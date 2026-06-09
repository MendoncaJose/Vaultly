export interface PublicUser {
  id: string
  email: string
  name: string | null
  role: string
  plan: string
  preferredCurrency: string
  createdAt: string
}

export interface AuthState {
  user: PublicUser | null
  accessToken: string | null
}
