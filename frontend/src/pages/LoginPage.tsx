import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../context/auth.context'
import { api, setAccessToken } from '../lib/api-client'
import type { PublicUser } from '../types/auth'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const { setAuth } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormValues) {
    setServerError(null)
    try {
      const res = await api.post<{ user: PublicUser; accessToken: string }>(
        '/auth/login',
        data,
        { skipAuth: true },
      )
      setAccessToken(res.accessToken)
      setAuth(res.user, res.accessToken)
      navigate('/app/dashboard', { replace: true })
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <span className="font-ivy-presto text-heading-lg text-chalk-glow">Vaultly</span>
          <p className="mt-2 text-caption text-ash">Sign in to your portfolio</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          {serverError && (
            <p className="text-caption text-loss text-center">{serverError}</p>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full mt-1">
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-8 text-center text-caption text-ash">
          No account?{' '}
          <Link to="/register" className="text-ember-gold hover:text-molten-gold transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
