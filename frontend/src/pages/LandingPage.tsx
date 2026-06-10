import { Link } from 'react-router-dom'

const FEATURES = [
  {
    title: 'Stocks & ETFs',
    desc: 'Track your equity positions with real-time quotes from Finnhub. Cost basis, P/L and daily changes in one view.',
  },
  {
    title: 'Crypto',
    desc: 'Bitcoin, Ethereum and beyond. Same rigorous cost-basis tracking as your equity portfolio.',
  },
  {
    title: 'Price alerts',
    desc: 'Set price-above, price-below and daily-change alerts. Get notified in-app when the market moves.',
  },
  {
    title: 'EUR / USD',
    desc: 'Switch your display currency instantly. Exchange rates from Frankfurter, cached daily.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-obsidian text-chalk flex flex-col">

      {/* Nav */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-iron/40">
        <span className="font-ivy-presto text-heading-sm text-chalk-glow">Vaultly</span>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-caption text-ash hover:text-chalk transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-ember-gold text-obsidian rounded-sm text-caption font-medium hover:bg-molten-gold transition-colors"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 flex-1">
        <p className="text-caption text-ember-gold tracking-widest uppercase mb-6">
          Portfolio tracking
        </p>
        <h1 className="font-ivy-presto text-display text-chalk-glow leading-none tracking-tight max-w-2xl mb-6">
          Your entire portfolio.<br />One place.
        </h1>
        <p className="text-body-lg text-ash max-w-md mb-10">
          Stocks, ETFs and crypto — tracked with real cost-basis accounting,
          live prices and daily P&amp;L.
        </p>
        <div className="flex items-center gap-4">
          <Link
            to="/register"
            className="px-7 py-3 bg-ember-gold text-obsidian rounded-sm text-caption font-medium hover:bg-molten-gold transition-colors"
          >
            Start tracking free
          </Link>
          <Link
            to="/login"
            className="px-7 py-3 border border-iron text-chalk rounded-sm text-caption hover:border-steel transition-colors"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Dashboard mockup */}
      <section className="px-8 pb-20 flex justify-center">
        <div className="w-full max-w-4xl bg-graphite border border-iron rounded-lg overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-iron bg-slate">
            <span className="w-2.5 h-2.5 rounded-full bg-iron" />
            <span className="w-2.5 h-2.5 rounded-full bg-iron" />
            <span className="w-2.5 h-2.5 rounded-full bg-iron" />
            <span className="ml-4 text-caption text-ash">app.vaultly — Dashboard</span>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Portfolio value', val: '€ 24,831.40' },
                { label: 'Total P/L', val: '+€ 3,420.10' },
                { label: 'Daily P/L', val: '+€ 182.55' },
              ].map((m) => (
                <div key={m.label} className="bg-slate border border-iron rounded-lg p-4">
                  <p className="text-caption text-ash mb-2">{m.label}</p>
                  <p className="text-heading-sm text-chalk-glow tabular-nums">{m.val}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-[1fr_200px] gap-3">
              <div className="bg-slate border border-iron rounded-lg p-4 h-36 flex items-center justify-center">
                <div className="flex items-end gap-2 h-20">
                  {[40, 55, 45, 70, 60, 80, 65, 90, 75, 95].map((h, i) => (
                    <div
                      key={i}
                      className="w-6 rounded-sm"
                      style={{
                        height: `${h}%`,
                        background: i === 9 ? '#cc9166' : '#2e3038',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="bg-slate border border-iron rounded-lg p-4 flex flex-col gap-2">
                {[
                  { s: 'AAPL', v: '+12.4%' },
                  { s: 'BTC', v: '+8.1%' },
                  { s: 'VOO', v: '+5.3%' },
                ].map((r) => (
                  <div key={r.s} className="flex justify-between">
                    <span className="text-caption text-chalk">{r.s}</span>
                    <span className="text-caption text-ember-gold tabular-nums">{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-ivy-presto text-heading text-chalk-glow text-center mb-12">
            Built for the serious investor
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-slate border border-iron rounded-lg p-6">
                <h3 className="text-subheading text-chalk-glow mb-2">{f.title}</h3>
                <p className="text-caption text-ash">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 pb-20 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="font-ivy-presto text-heading text-chalk-glow mb-4">
            Know what you own.
          </h2>
          <p className="text-caption text-ash mb-8">
            Free to start. No credit card required.
          </p>
          <Link
            to="/register"
            className="inline-flex px-8 py-3 bg-ember-gold text-obsidian rounded-sm text-caption font-medium hover:bg-molten-gold transition-colors"
          >
            Create your portfolio
          </Link>
        </div>
      </section>

      {/* Footer + disclaimer */}
      <footer className="border-t border-iron px-8 py-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-ivy-presto text-caption text-ash">Vaultly</span>
            <div className="flex gap-6">
              <Link to="/login" className="text-caption text-ash hover:text-chalk transition-colors">Sign in</Link>
              <Link to="/register" className="text-caption text-ash hover:text-chalk transition-colors">Register</Link>
            </div>
          </div>
          <p className="text-caption text-steel max-w-2xl">
            Vaultly is for informational purposes only. Nothing on this platform constitutes financial advice,
            investment recommendations, or a solicitation to buy or sell any security or digital asset.
            Market data provided by Finnhub. Exchange rates by Frankfurter. Prices may be delayed.
            Past performance does not guarantee future results. Use at your own risk.
          </p>
        </div>
      </footer>

    </div>
  )
}
