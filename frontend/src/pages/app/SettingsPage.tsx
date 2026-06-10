import { useNavigate } from 'react-router-dom'
import { Topbar } from '../../components/ui/Topbar'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../context/auth.context'
import { useUpdateCurrency } from '../../lib/queries/auth'
import { api, setAccessToken } from '../../lib/api-client'

export default function SettingsPage() {
  const { user, clearAuth } = useAuth()
  const navigate = useNavigate()
  const { mutate: updateCurrency, isPending } = useUpdateCurrency()

  async function handleLogout() {
    try {
      await api.post('/auth/logout')
    } finally {
      setAccessToken(null)
      clearAuth()
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Settings" />
      <div className="flex-1 p-8 flex flex-col gap-6 max-w-lg">

        {/* Account */}
        <Card>
          <p className="text-caption text-ash mb-4">Account</p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-caption text-ash">Email</span>
              <span className="text-caption text-chalk tabular-nums">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-caption text-ash">Name</span>
              <span className="text-caption text-chalk">{user?.name ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-caption text-ash">Plan</span>
              <span className="text-caption text-chalk">{user?.plan}</span>
            </div>
          </div>
        </Card>

        {/* Preferred currency */}
        <Card>
          <p className="text-caption text-ash mb-4">Preferred currency</p>
          <div className="flex gap-3">
            {(['EUR', 'USD'] as const).map((c) => (
              <Button
                key={c}
                variant={user?.preferredCurrency === c ? 'primary' : 'ghost'}
                size="sm"
                disabled={isPending}
                onClick={() => updateCurrency(c)}
              >
                {c}
              </Button>
            ))}
          </div>
          <p className="text-caption text-ash mt-3">
            Affects portfolio values and P/L display across the app.
          </p>
        </Card>

        {/* Market data */}
        <Card>
          <p className="text-caption text-ash mb-2">Market data</p>
          <p className="text-caption text-steel">
            Prices provided by Finnhub. Cached for up to 5 minutes. Exchange rates via Frankfurter API.
            Data may be delayed. Not real-time.
          </p>
        </Card>

        {/* Disclaimer */}
        <Card>
          <p className="text-caption text-ash mb-2">Disclaimer</p>
          <p className="text-caption text-steel">
            Vaultly is a personal portfolio tracking tool for informational purposes only.
            Nothing displayed constitutes financial advice, investment recommendations, or a solicitation to buy or sell any security.
            Past performance does not guarantee future results.
          </p>
        </Card>

        {/* Sign out */}
        <div>
          <Button variant="ghost" onClick={handleLogout}>
            Sign out
          </Button>
        </div>
      </div>
    </div>
  )
}
