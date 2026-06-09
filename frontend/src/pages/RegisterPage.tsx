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
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
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
        '/auth/register',
        data,
        { skipAuth: true },
      )
      setAccessToken(res.accessToken)
      setAuth(res.user, res.accessToken)
      navigate('/app/dashboard', { replace: true })
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <span className="font-ivy-presto text-heading-lg text-chalk-glow">Vaultly</span>
          <p className="mt-2 text-caption text-ash">Create your portfolio account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <Input
            label="Name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            error={errors.name?.message}
            {...register('name')}
          />
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
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            error={errors.password?.message}
            {...register('password')}
          />

          {serverError && (
            <p className="text-caption text-loss text-center">{serverError}</p>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full mt-1">
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className="mt-8 text-center text-caption text-ash">
          Already have an account?{' '}
          <Link to="/login" className="text-ember-gold hover:text-molten-gold transition-colors">
            Sign in
          </Link>
        </p>

        <p className="mt-6 text-center text-caption text-steel">
          For informational purposes only. Not financial advice.
        </p>
      </div>
    </div>
  )
}
