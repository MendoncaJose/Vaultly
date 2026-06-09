import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-obsidian flex flex-col items-center justify-center gap-8 px-4">
      <h1 className="font-ivy-presto text-display-xl text-chalk-glow">Vaultly</h1>
      <p className="text-body-lg text-graphite-light text-center max-w-md">
        Portfolio tracking for stocks, ETFs and crypto.
      </p>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="px-6 py-2.5 border border-ember-gold text-ember-gold rounded-sm text-caption hover:bg-ember-gold hover:text-obsidian transition-colors"
        >
          Sign in
        </Link>
        <Link
          to="/register"
          className="px-6 py-2.5 bg-ember-gold text-obsidian rounded-sm text-caption hover:bg-molten-gold transition-colors"
        >
          Get started
        </Link>
      </div>
      <p className="text-caption text-graphite-light max-w-sm text-center">
        For informational purposes only. Not financial advice.
      </p>
    </main>
  )
}
