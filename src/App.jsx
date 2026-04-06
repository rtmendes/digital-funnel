import { useState, useEffect, useRef } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const QUESTIONS = [
  {
    id: 1,
    text: "What's your #1 challenge building a $200K/month digital business?",
    answers: [
      { id: 'A', text: 'I have deep expertise but can\'t get enough visibility or clients' },
      { id: 'B', text: 'I have marketing skills but my funnel leaks and won\'t scale' },
      { id: 'C', text: 'I create great content but can\'t consistently convert followers into buyers' },
      { id: 'D', text: 'I can build great products but struggle with sales and distribution' },
    ],
  },
  {
    id: 2,
    text: 'How do you most naturally deliver value to others?',
    answers: [
      { id: 'A', text: 'Writing, teaching, and publishing thought-leadership content' },
      { id: 'B', text: 'Building systems, running paid traffic, and optimising funnels' },
      { id: 'C', text: 'Creating videos, showing personality, and building community' },
      { id: 'D', text: 'Building tools, automations, and technical solutions' },
    ],
  },
  {
    id: 3,
    text: 'Which income model gets you the most excited?',
    answers: [
      { id: 'A', text: 'Premium coaching + thought leadership = authority-driven income' },
      { id: 'B', text: 'Self-liquidating funnel + ads = scalable asset-based income' },
      { id: 'C', text: 'Digital products + TikTok viral growth = creator economy income' },
      { id: 'D', text: 'Interactive tools + licensing = recurring tech-enabled income' },
    ],
  },
  {
    id: 4,
    text: 'Where are you most comfortable showing up publicly?',
    answers: [
      { id: 'A', text: 'Written articles, LinkedIn, and email newsletters' },
      { id: 'B', text: 'Behind the scenes — I prefer systems over spotlight' },
      { id: 'C', text: 'TikTok, Instagram Reels, YouTube Shorts — short-form video' },
      { id: 'D', text: 'Product demos, walkthroughs, and showing how things work' },
    ],
  },
  {
    id: 5,
    text: 'Which traffic strategy fits your personality best?',
    answers: [
      { id: 'A', text: 'Getting published in Forbes, Inc., and Business Insider' },
      { id: 'B', text: 'Running Facebook and TikTok paid ads with a proven funnel' },
      { id: 'C', text: 'Going viral organically on TikTok and converting followers' },
      { id: 'D', text: 'Building tools that rank in Google and AI search engines' },
    ],
  },
  {
    id: 6,
    text: "What's your single biggest asset right now?",
    answers: [
      { id: 'A', text: 'Years of expertise and proven results in a specific niche' },
      { id: 'B', text: 'Marketing, copywriting, and funnel optimisation skills' },
      { id: 'C', text: 'Charisma, storytelling ability, and on-camera confidence' },
      { id: 'D', text: 'Technical skills — I can build software, apps, and tools' },
    ],
  },
  {
    id: 7,
    text: 'How much can you invest in advertising to start?',
    answers: [
      { id: 'A', text: '$0 — I need to build organically first through publications' },
      { id: 'B', text: '$1,000–$5,000/month — I want an aggressive paid strategy' },
      { id: 'C', text: '$500–$2,000/month — a smart mix of organic + paid' },
      { id: 'D', text: 'My ROI comes from evergreen tools, not ad spend' },
    ],
  },
  {
    id: 8,
    text: "What would feel like your biggest win in the next 6 months?",
    answers: [
      { id: 'A', text: 'Being recognised as a top expert, published in major media outlets' },
      { id: 'B', text: 'A self-liquidating funnel running on autopilot, scaling with ads' },
      { id: 'C', text: 'A viral TikTok presence with thousands of paying digital product customers' },
      { id: 'D', text: 'A suite of interactive tools generating passive leads and sales daily' },
    ],
  },
]

const ARCHETYPES = {
  A: {
    name: 'The Authority Builder',
    icon: '📰',
    color: '#00D4AA',
    tagline: 'Your fastest path is credibility-first — premium positioning, thought leadership, and publication authority.',
    primaryPath: 'Publication Platform + Premium Coaching',
    keyProducts: ['$9,997 VIP Coaching Program', '$2,997 Group Mastermind', '$997 Digital Course'],
    trafficStrategy: 'Forbes / Inc. / Business Insider bylines → email list → high-ticket sales calls',
    firstStep: 'Audit your hard drive this week. Package your best expertise into a $997 digital program. That becomes your pitch credibility.',
    uniqueEdge: 'A byline in Forbes is permanent credibility that converts for years — no ad spend required, no algorithm to fight.',
    revenueData: [
      { month: 'Mo 1', revenue: 5000 },
      { month: 'Mo 2', revenue: 18000 },
      { month: 'Mo 3', revenue: 45000 },
      { month: 'Mo 4', revenue: 95000 },
      { month: 'Mo 5', revenue: 165000 },
      { month: 'Mo 6', revenue: 250000 },
    ],
  },
  B: {
    name: 'The Funnel Architect',
    icon: '⚙️',
    color: '#FFB800',
    tagline: 'Your fastest path is a self-liquidating funnel where ads pay for themselves and the backend prints profit.',
    primaryPath: 'SLF Funnel + Facebook PPC + TikTok Ads',
    keyProducts: ['$37 SLO (Self-Liquidating Offer)', '$197 OTO 1 — 90-Day Launchpad', '$2,997 Core Program'],
    trafficStrategy: 'Facebook PPC + TikTok Ads → SLF funnel → email list → backend offer sequence',
    firstStep: 'Build your SLO product and landing page in the next 7 days. Get your first Facebook ad live by Day 8. $50/day to start.',
    uniqueEdge: 'When your ads pay for themselves, you can scale to any number. Most marketers never reach self-liquidation — you\'re built for this.',
    revenueData: [
      { month: 'Mo 1', revenue: 28000 },
      { month: 'Mo 2', revenue: 72000 },
      { month: 'Mo 3', revenue: 132000 },
      { month: 'Mo 4', revenue: 210000 },
      { month: 'Mo 5', revenue: 257000 },
      { month: 'Mo 6', revenue: 335000 },
    ],
  },
  C: {
    name: 'The Content Creator',
    icon: '🎬',
    color: '#FF6B6B',
    tagline: 'Your fastest path is building an audience that trusts you, then converting them with digital products built for viral growth.',
    primaryPath: 'TikTok Organic + Digital Products + Spark Ads',
    keyProducts: ['$97 Quick-Win Digital Product', '$497 Core Program', '$27 SLO Entry Offer'],
    trafficStrategy: 'TikTok organic (2/day) → Spark Ads amplification → email capture → digital product sequence',
    firstStep: 'Post your first TikTok today. One video about your area of expertise. The algorithm needs data — give it data. Start now.',
    uniqueEdge: 'Organic TikTok traffic converts 3–4× better than cold paid traffic because it arrives pre-warmed. Your personality is the moat no one can copy.',
    revenueData: [
      { month: 'Mo 1', revenue: 3000 },
      { month: 'Mo 2', revenue: 15000 },
      { month: 'Mo 3', revenue: 45000 },
      { month: 'Mo 4', revenue: 95000 },
      { month: 'Mo 5', revenue: 165000 },
      { month: 'Mo 6', revenue: 250000 },
    ],
  },
  D: {
    name: 'The Tech Builder',
    icon: '🛠️',
    color: '#A855F7',
    tagline: 'Your fastest path is building interactive tools that rank in AI search, capture emails, and sell your programs on autopilot.',
    primaryPath: 'Interactive Web Apps + AEO / SEO + Digital Products',
    keyProducts: ['Free Calculator (lead magnet)', '$397 Tool Builder Blueprint', '$997 Full System'],
    trafficStrategy: 'Build tools that rank in Perplexity + ChatGPT → organic traffic → email capture → product sequence',
    firstStep: 'Build your first interactive calculator or diagnostic tool this week. Host it on your domain. Submit to Google Search Console and Perplexity.',
    uniqueEdge: 'A tool that ranks in ChatGPT gets traffic forever at zero cost. Every tool you build is a permanent digital asset — the opposite of rented ad traffic.',
    revenueData: [
      { month: 'Mo 1', revenue: 5000 },
      { month: 'Mo 2', revenue: 12000 },
      { month: 'Mo 3', revenue: 35000 },
      { month: 'Mo 4', revenue: 85000 },
      { month: 'Mo 5', revenue: 155000 },
      { month: 'Mo 6', revenue: 255000 },
    ],
  },
}

// Lead capture endpoint — Vercel serverless function (/api/capture-lead.js)
const CAPTURE_URL = '/api/capture-lead'

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function scoreAnswers(answers) {
  const counts = { A: 0, B: 0, C: 0, D: 0 }
  Object.values(answers).forEach(v => { if (v) counts[v]++ })
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
}

function fmtDollar(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${n}`
}

function fmtNum(n) {
  return n.toLocaleString()
}

const CustomTooltip = ({ active, payload, label, color }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 text-sm">
        <p className="text-gray-400 mb-1">{label}</p>
        <p style={{ color: color || '#00D4AA' }} className="font-bold">
          {fmtDollar(payload[0].value)}
        </p>
      </div>
    )
  }
  return null
}

// ─────────────────────────────────────────────
// SCREENS
// ─────────────────────────────────────────────

// LANDING
function Landing({ onStartQuiz, onStartCalc }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {/* Badge */}
      <div className="anim-fade-up mb-6 inline-flex items-center gap-2 border border-teal/30 bg-teal/10 rounded-full px-4 py-1.5 text-sm text-teal font-medium">
        <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
        Free Diagnostic Tool — Used by 50,000+ Entrepreneurs
      </div>

      {/* Headline */}
      <h1 className="anim-fade-up delay-100 text-center text-4xl sm:text-6xl font-black leading-tight max-w-3xl mb-6">
        What's Your Fastest Path to{' '}
        <span className="text-teal">$200K/Month?</span>
      </h1>

      <p className="anim-fade-up delay-200 text-center text-gray-400 text-lg sm:text-xl max-w-xl mb-10">
        Take the 8-question diagnostic. Discover your digital business archetype
        and the exact funnel built for your skills — in under 2 minutes.
      </p>

      {/* CTAs */}
      <div className="anim-fade-up delay-300 flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button
          onClick={onStartQuiz}
          className="flex-1 bg-teal hover:bg-teal/90 text-dark font-bold py-4 px-6 rounded-xl text-lg transition-all hover:scale-105 glow-teal"
        >
          Take the Quiz →
          <span className="block text-xs font-normal opacity-70 mt-0.5">2 min · Free</span>
        </button>
        <button
          onClick={onStartCalc}
          className="flex-1 border border-border hover:border-gold/60 bg-card hover:bg-gold/5 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all"
        >
          Revenue Calculator
          <span className="block text-xs font-normal opacity-50 mt-0.5">See the exact math</span>
        </button>
      </div>

      {/* Press logos */}
      <div className="anim-fade-up delay-400 mt-16 flex flex-col items-center gap-3">
        <p className="text-xs text-gray-600 uppercase tracking-widest">As seen in</p>
        <div className="flex items-center gap-6 opacity-30">
          {['Forbes', 'Inc.', 'Business Insider', 'Fast Company', 'Entrepreneur'].map(p => (
            <span key={p} className="text-sm font-black text-white tracking-tight">{p}</span>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="anim-fade-up delay-500 mt-12 grid grid-cols-3 gap-6 max-w-lg w-full">
        {[
          { n: '50K+', label: 'Entrepreneurs diagnosed' },
          { n: '4', label: 'Unique archetypes' },
          { n: '$200K', label: 'Monthly target modelled' },
        ].map(s => (
          <div key={s.label} className="text-center">
            <p className="text-2xl font-black text-teal">{s.n}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// QUIZ
function Quiz({ onComplete }) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState(null)

  const q = QUESTIONS[current]
  const progress = ((current) / QUESTIONS.length) * 100

  function pick(id) {
    setSelected(id)
  }

  function next() {
    if (!selected) return
    const newAnswers = { ...answers, [q.id]: selected }
    setAnswers(newAnswers)
    if (current + 1 < QUESTIONS.length) {
      setCurrent(c => c + 1)
      setSelected(null)
    } else {
      onComplete(newAnswers)
    }
  }

  function back() {
    if (current === 0) return
    setCurrent(c => c - 1)
    setSelected(answers[QUESTIONS[current - 1].id] || null)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Question {current + 1} of {QUESTIONS.length}</span>
            <span>{Math.round((current / QUESTIONS.length) * 100)}% complete</span>
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-teal rounded-full progress-bar-inner"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div key={q.id} className="anim-fade-up">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 leading-snug">{q.text}</h2>

          <div className="grid gap-3">
            {q.answers.map(a => (
              <button
                key={a.id}
                onClick={() => pick(a.id)}
                className={`answer-card text-left border rounded-xl p-4 flex items-start gap-4 ${
                  selected === a.id
                    ? 'selected border-teal bg-teal/8'
                    : 'border-border bg-card'
                }`}
              >
                <span className={`w-7 h-7 flex-shrink-0 rounded-lg border flex items-center justify-center text-sm font-bold transition-all ${
                  selected === a.id
                    ? 'border-teal bg-teal text-dark'
                    : 'border-border text-gray-500'
                }`}>
                  {a.id}
                </span>
                <span className={`text-sm sm:text-base leading-relaxed ${selected === a.id ? 'text-white' : 'text-gray-300'}`}>
                  {a.text}
                </span>
              </button>
            ))}
          </div>

          {/* Nav */}
          <div className="flex gap-3 mt-8">
            {current > 0 && (
              <button
                onClick={back}
                className="px-6 py-3 border border-border rounded-xl text-gray-400 hover:text-white hover:border-gray-500 transition-all text-sm font-medium"
              >
                ← Back
              </button>
            )}
            <button
              onClick={next}
              disabled={!selected}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                selected
                  ? 'bg-teal text-dark hover:bg-teal/90 hover:scale-[1.02]'
                  : 'bg-border text-gray-600 cursor-not-allowed'
              }`}
            >
              {current + 1 === QUESTIONS.length ? 'See My Results →' : 'Next Question →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// PROCESSING
function Processing({ onDone }) {
  const steps = [
    'Analysing your answers…',
    'Mapping your archetype…',
    'Building your revenue model…',
    'Generating your blueprint…',
  ]
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = steps.map((_, i) =>
      setTimeout(() => setStep(i), i * 600)
    )
    const done = setTimeout(onDone, steps.length * 600 + 400)
    return () => { timers.forEach(clearTimeout); clearTimeout(done) }
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-8">
      {/* Spinner */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-teal/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-teal animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">🧠</div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6">Analysing your profile…</h2>
        <div className="flex flex-col gap-3 text-left max-w-xs mx-auto">
          {steps.map((s, i) => (
            <div key={s} className={`flex items-center gap-3 text-sm transition-all duration-500 ${i <= step ? 'text-white' : 'text-gray-600'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all ${
                i < step ? 'bg-teal text-dark' :
                i === step ? 'border-2 border-teal animate-pulse' :
                'border border-border'
              }`}>
                {i < step ? '✓' : ''}
              </span>
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// RESULTS TEASER (pre-email)
function ResultsTeaser({ archetype, onUnlock }) {
  const a = ARCHETYPES[archetype]

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-2xl">

        {/* Archetype reveal */}
        <div className="anim-fade-up text-center mb-8">
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-3">Your Digital Business Archetype</p>
          <div
            className="inline-flex items-center gap-3 border rounded-2xl px-6 py-3 mb-4"
            style={{ borderColor: a.color + '50', background: a.color + '15' }}
          >
            <span className="text-3xl">{a.icon}</span>
            <span className="text-2xl font-black" style={{ color: a.color }}>{a.name}</span>
          </div>
          <p className="text-gray-300 text-base max-w-lg mx-auto leading-relaxed">{a.tagline}</p>
        </div>

        {/* Revenue preview */}
        <div className="anim-fade-up delay-100 bg-card border border-border rounded-2xl p-6 mb-4">
          <p className="text-sm text-gray-400 mb-1">Your projected 6-month revenue path</p>
          <p className="text-3xl font-black mb-4" style={{ color: a.color }}>
            {fmtDollar(a.revenueData[a.revenueData.length - 1].revenue)}<span className="text-base font-normal text-gray-400">/month by Month 6</span>
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={a.revenueData}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={a.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={a.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
              <XAxis dataKey="month" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmtDollar} tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} width={52} />
              <Tooltip content={<CustomTooltip color={a.color} />} />
              <Area type="monotone" dataKey="revenue" stroke={a.color} strokeWidth={2.5} fill="url(#grad)" dot={{ fill: a.color, r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Blurred teaser */}
        <div className="relative anim-fade-up delay-200">
          <div className="bg-card border border-border rounded-2xl p-6 blur-overlay select-none pointer-events-none">
            <p className="text-sm text-gray-500 mb-3">Your personalised blueprint includes:</p>
            <div className="grid gap-3">
              {['Primary revenue path & exact product stack', 'Step-by-step traffic strategy', 'Your #1 first action (this week)', 'The unique edge that makes your model work'].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <span className="text-teal text-sm">✓</span>
                  <span className="text-sm text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 px-6">
            <div className="text-center mb-4">
              <p className="text-white font-bold text-lg">🔒 Unlock Your Full Blueprint</p>
              <p className="text-gray-400 text-sm">Enter your email to get your complete personalised plan</p>
            </div>
            <button
              onClick={onUnlock}
              className="w-full bg-teal hover:bg-teal/90 text-dark font-bold py-3.5 rounded-xl transition-all hover:scale-[1.02] text-base glow-teal"
            >
              Get My Free Blueprint →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// EMAIL CAPTURE
function EmailCapture({ archetype, onSubmit }) {
  const a = ARCHETYPES[archetype]
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) { setError('Please fill in both fields.'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email.'); return }
    setLoading(true)
    setError('')

    try {
      await fetch(CAPTURE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({
          firstName: name,
          email,
          archetype,
          archetypeName: a.name,
          source: 'quiz-funnel',
          tags: ['quiz-lead', `archetype-${archetype.toLowerCase()}`, 'funnel-top'],
        }),
      })
    } catch (_) { /* no-cors swallows errors — treat as success */ }

    setLoading(false)
    onSubmit(name, email)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="anim-fade-up text-center mb-8">
          <span className="text-4xl mb-3 block">{a.icon}</span>
          <h2 className="text-3xl font-black mb-3">
            Your <span style={{ color: a.color }}>{a.name}</span> Blueprint is Ready
          </h2>
          <p className="text-gray-400 text-base">
            Enter your details and I'll send your complete personalised plan — plus the 5-day digital offer launch system.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="anim-fade-up delay-100 bg-card border border-border rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">First Name</label>
            <input
              type="text"
              placeholder="e.g. Rashida"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-dark border border-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-dark border border-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal transition-colors"
            />
          </div>
          {error && <p className="text-coral text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal hover:bg-teal/90 text-dark font-bold py-4 rounded-xl text-base transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed glow-teal mt-1"
          >
            {loading ? 'Sending…' : `Get My ${a.name} Blueprint →`}
          </button>
          <p className="text-xs text-gray-600 text-center">
            🔒 No spam. Unsubscribe any time. Your info is never sold.
          </p>
        </form>

        {/* What you'll get */}
        <div className="anim-fade-up delay-200 mt-4 bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">What you'll receive instantly</p>
          {[
            'Your full archetype report with 6-month revenue projection',
            'The exact product stack and pricing for your archetype',
            'Your personalised traffic strategy',
            'The 5-Day Digital Offer Launch Blueprint (PDF)',
          ].map(item => (
            <div key={item} className="flex items-start gap-2 mb-2">
              <span className="text-teal text-sm mt-0.5 flex-shrink-0">✓</span>
              <span className="text-sm text-gray-300">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// FULL RESULTS
function FullResults({ archetype, name, onSLO }) {
  const a = ARCHETYPES[archetype]

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="anim-fade-up text-center mb-10">
          <p className="text-sm text-gray-500 mb-2">Hey {name} 👋 — here's your full blueprint</p>
          <div
            className="inline-flex items-center gap-3 border rounded-2xl px-6 py-3 mb-4"
            style={{ borderColor: a.color + '50', background: a.color + '15' }}
          >
            <span className="text-3xl">{a.icon}</span>
            <span className="text-2xl font-black" style={{ color: a.color }}>{a.name}</span>
          </div>
          <p className="text-gray-300 text-base max-w-lg mx-auto">{a.tagline}</p>
        </div>

        {/* Revenue chart */}
        <div className="anim-fade-up delay-100 bg-card border border-border rounded-2xl p-6 mb-5">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">6-Month Revenue Projection</p>
              <p className="text-3xl font-black" style={{ color: a.color }}>
                {fmtDollar(a.revenueData[a.revenueData.length - 1].revenue)}
                <span className="text-sm font-normal text-gray-400">/month</span>
              </p>
            </div>
            <p className="text-xs text-gray-600 text-right">Month 6 target</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={a.revenueData}>
              <defs>
                <linearGradient id="gradFull" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={a.color} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={a.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
              <XAxis dataKey="month" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmtDollar} tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} width={52} />
              <Tooltip content={<CustomTooltip color={a.color} />} />
              <Area type="monotone" dataKey="revenue" stroke={a.color} strokeWidth={2.5} fill="url(#gradFull)" dot={{ fill: a.color, r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Key details */}
        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          {/* Primary path */}
          <div className="anim-fade-up delay-200 bg-card border border-border rounded-2xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Primary Revenue Path</p>
            <p className="font-bold text-white mb-3">{a.primaryPath}</p>
            <div className="flex flex-col gap-2">
              {a.keyProducts.map(p => (
                <div key={p} className="flex items-center gap-2">
                  <span style={{ color: a.color }} className="text-sm">→</span>
                  <span className="text-sm text-gray-300">{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic strategy */}
          <div className="anim-fade-up delay-300 bg-card border border-border rounded-2xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Traffic Strategy</p>
            <p className="text-sm text-gray-300 leading-relaxed">{a.trafficStrategy}</p>
          </div>
        </div>

        {/* First step */}
        <div className="anim-fade-up delay-400 border rounded-2xl p-5 mb-5" style={{ borderColor: a.color + '40', background: a.color + '08' }}>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: a.color }}>Your #1 First Step This Week</p>
          <p className="text-white font-medium leading-relaxed">{a.firstStep}</p>
        </div>

        {/* Unique edge */}
        <div className="anim-fade-up delay-500 bg-card border border-border rounded-2xl p-5 mb-8">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Your Unique Edge</p>
          <p className="text-gray-300 text-sm leading-relaxed italic">"{a.uniqueEdge}"</p>
        </div>

        {/* SLO offer */}
        <SLOOffer onCTA={onSLO} archetypeColor={a.color} archetypeName={a.name} />
      </div>
    </div>
  )
}

// CALCULATOR
function Calculator({ onResults }) {
  const [vals, setVals] = useState({
    revenueTarget: 200000,
    pricePoint: 997,
    listSize: 10000,
    convRate: 2,
    sloPrice: 37,
    bumpRate: 35,
    oto1Price: 197,
    oto1Rate: 25,
    adSpend: 5000,
    cpc: 2.0,
    optinRate: 30,
    sloConvRate: 10,
  })

  function set(k, v) { setVals(p => ({ ...p, [k]: Number(v) })) }

  function compute() {
    const units = Math.ceil(vals.revenueTarget / vals.pricePoint)
    const listNeeded = Math.ceil(units / (vals.convRate / 100))
    const clicks = Math.round(vals.adSpend / vals.cpc)
    const leads = Math.round(clicks * (vals.optinRate / 100))
    const sloBuyers = Math.round(leads * (vals.sloConvRate / 100))
    const sloRev = sloBuyers * vals.sloPrice
    const bumpRev = Math.round(sloBuyers * (vals.bumpRate / 100)) * 27
    const oto1Rev = Math.round(sloBuyers * (vals.oto1Rate / 100)) * vals.oto1Price
    const frontEndRev = sloRev + bumpRev + oto1Rev
    const frontEndROAS = vals.adSpend > 0 ? frontEndRev / vals.adSpend : 0
    const backendRev = Math.round(leads * (vals.convRate / 100)) * vals.pricePoint
    const totalRev = frontEndRev + backendRev
    const profit = totalRev - vals.adSpend
    const cpl = leads > 0 ? (vals.adSpend / leads) : 0
    const cpb = sloBuyers > 0 ? (vals.adSpend / sloBuyers) : 0
    const aov = sloBuyers > 0 ? (frontEndRev / sloBuyers) : 0

    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const scale = [1, 2.5, 4.5, 7, 9.5, 13][i]
      return {
        month: `Mo ${i + 1}`,
        revenue: Math.round(totalRev * scale * 0.12),
        adSpend: Math.round(vals.adSpend * scale),
      }
    })

    return { units, listNeeded, clicks, leads, sloBuyers, sloRev, bumpRev, oto1Rev, frontEndRev, frontEndROAS, backendRev, totalRev, profit, cpl, cpb, aov, monthlyData }
  }

  function SliderRow({ label, k, min, max, step = 1, prefix = '', suffix = '', note }) {
    return (
      <div>
        <div className="flex justify-between items-baseline mb-1.5">
          <label className="text-sm text-gray-400">{label}</label>
          <span className="text-sm font-bold text-white">
            {prefix}{fmtNum(vals[k])}{suffix}
          </span>
        </div>
        <input
          type="range"
          min={min} max={max} step={step}
          value={vals[k]}
          onChange={e => set(k, e.target.value)}
          className="w-full accent-teal"
          style={{ accentColor: '#00D4AA' }}
        />
        {note && <p className="text-xs text-gray-600 mt-0.5">{note}</p>}
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="anim-fade-up text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-black mb-3">
            The <span className="text-gold">$200K Revenue Planner</span>
          </h2>
          <p className="text-gray-400">Drag the sliders to model your exact funnel economics in real time.</p>
        </div>

        <div className="anim-fade-up delay-100 bg-card border border-border rounded-2xl p-6 mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-5">Revenue Goals</p>
          <div className="flex flex-col gap-5">
            <SliderRow label="Monthly Revenue Target" k="revenueTarget" min={10000} max={500000} step={5000} prefix="$" />
            <SliderRow label="Primary Offer Price" k="pricePoint" min={27} max={9997} step={1} prefix="$" />
            <SliderRow label="Email List Size" k="listSize" min={100} max={200000} step={100} />
            <SliderRow label="Email → Sale Conversion Rate" k="convRate" min={0.1} max={10} step={0.1} suffix="%" />
          </div>
        </div>

        <div className="anim-fade-up delay-200 bg-card border border-border rounded-2xl p-6 mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-5">Self-Liquidating Funnel (Front End)</p>
          <div className="flex flex-col gap-5">
            <SliderRow label="Ad Spend / Month" k="adSpend" min={500} max={100000} step={500} prefix="$" />
            <SliderRow label="Cost Per Click (CPC)" k="cpc" min={0.3} max={8} step={0.1} prefix="$" />
            <SliderRow label="Landing Page Opt-in Rate" k="optinRate" min={5} max={60} suffix="%" />
            <SliderRow label="SLO Price" k="sloPrice" min={7} max={97} step={1} prefix="$" />
            <SliderRow label="SLO Conversion Rate" k="sloConvRate" min={1} max={25} suffix="%" />
            <SliderRow label="Order Bump Take Rate" k="bumpRate" min={5} max={60} suffix="%" />
            <SliderRow label="OTO 1 Price" k="oto1Price" min={47} max={497} step={1} prefix="$" />
            <SliderRow label="OTO 1 Take Rate" k="oto1Rate" min={5} max={50} suffix="%" />
          </div>
        </div>

        <button
          onClick={() => onResults(compute(), vals)}
          className="anim-fade-up delay-300 w-full bg-gold hover:bg-gold/90 text-dark font-black py-4 rounded-xl text-lg transition-all hover:scale-[1.02] glow-gold"
        >
          Calculate My Numbers →
        </button>
      </div>
    </div>
  )
}

// CALCULATOR RESULTS
function CalcResults({ results, inputs, onSLO }) {
  const { units, listNeeded, leads, sloBuyers, frontEndRev, frontEndROAS, backendRev, totalRev, profit, cpl, cpb, aov, monthlyData } = results

  const slf = frontEndROAS >= 1
  const slfColor = slf ? '#00D4AA' : frontEndROAS >= 0.7 ? '#FFB800' : '#FF6B6B'
  const slfLabel = slf ? '✓ Self-Liquidating' : frontEndROAS >= 0.7 ? '⚡ Nearly There' : '⚠ Needs Work'

  const metrics = [
    { label: 'Units Needed / Month', value: fmtNum(units), note: `at $${fmtNum(inputs.pricePoint)}` },
    { label: 'Email List Needed', value: fmtNum(listNeeded), note: `at ${inputs.convRate}% CVR` },
    { label: 'Monthly Ad Leads', value: fmtNum(leads), note: `at $${cpl.toFixed(2)} per lead` },
    { label: 'Front-End Buyers', value: fmtNum(sloBuyers), note: `at $${cpb.toFixed(2)} per buyer` },
    { label: 'Front-End AOV', value: `$${aov.toFixed(2)}`, note: 'SLO + Bump + OTO1' },
    { label: 'Front-End ROAS', value: `${frontEndROAS.toFixed(2)}x`, color: slfColor, note: slfLabel },
  ]

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">

        <div className="anim-fade-up text-center mb-8">
          <h2 className="text-3xl font-black mb-2">Your Funnel Math</h2>
          <p className="text-gray-400 text-sm">Based on your inputs — drag sliders to update</p>
        </div>

        {/* SLF Status Banner */}
        <div
          className="anim-fade-up delay-100 rounded-2xl p-4 mb-5 border flex items-center gap-4"
          style={{ borderColor: slfColor + '50', background: slfColor + '10' }}
        >
          <div className="text-3xl">
            {slf ? '🟢' : frontEndROAS >= 0.7 ? '🟡' : '🔴'}
          </div>
          <div>
            <p className="font-bold text-white" style={{ color: slfColor }}>{slfLabel}</p>
            <p className="text-sm text-gray-400">
              {slf
                ? `Your front end generates ${fmtDollar(frontEndRev - inputs.adSpend)} MORE than you spend on ads. Scale freely.`
                : `Your front end recovers ${Math.round(frontEndROAS * 100)}% of ad spend. Improve SLO CVR or AOV to reach self-liquidation.`
              }
            </p>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="anim-fade-up delay-200 grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
          {metrics.map(m => (
            <div key={m.label} className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1 leading-tight">{m.label}</p>
              <p className="text-xl font-black" style={{ color: m.color || '#00D4AA' }}>{m.value}</p>
              <p className="text-xs text-gray-600 mt-0.5">{m.note}</p>
            </div>
          ))}
        </div>

        {/* Revenue breakdown */}
        <div className="anim-fade-up delay-300 bg-card border border-border rounded-2xl p-6 mb-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Monthly Revenue Breakdown</p>
          <div className="flex flex-col gap-3 mb-5">
            {[
              { label: 'Front-End (SLO + Bumps + OTOs)', val: frontEndRev, color: '#00D4AA' },
              { label: 'Back-End (Core Offer via Email)', val: backendRev, color: '#FFB800' },
            ].map(r => (
              <div key={r.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{r.label}</span>
                  <span className="font-bold" style={{ color: r.color }}>{fmtDollar(r.val)}</span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${totalRev > 0 ? (r.val / totalRev) * 100 : 0}%`, background: r.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4 flex justify-between items-end">
            <div>
              <p className="text-xs text-gray-500">Total Revenue</p>
              <p className="text-2xl font-black text-white">{fmtDollar(totalRev)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Profit (after ads)</p>
              <p className="text-2xl font-black text-teal">{fmtDollar(profit)}</p>
            </div>
          </div>
        </div>

        {/* Scale chart */}
        <div className="anim-fade-up delay-400 bg-card border border-border rounded-2xl p-6 mb-8">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Projected Revenue as You Scale Ad Spend</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
              <XAxis dataKey="month" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmtDollar} tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} width={52} />
              <Tooltip content={<CustomTooltip color="#FFB800" />} />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                {monthlyData.map((_, i) => (
                  <Cell key={i} fill={i === 5 ? '#FFB800' : '#1E1E2E'} stroke={i === 5 ? '#FFB800' : '#2E2E3E'} strokeWidth={1} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <SLOOffer onCTA={onSLO} archetypeColor="#FFB800" archetypeName="Funnel Builder" />
      </div>
    </div>
  )
}

// SLO OFFER COMPONENT (embedded in results pages)
function SLOOffer({ onCTA, archetypeColor, archetypeName }) {
  return (
    <div
      className="anim-fade-up rounded-2xl border p-6"
      style={{ borderColor: archetypeColor + '40', background: archetypeColor + '06' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: archetypeColor }}>
            Special One-Time Offer — New Members Only
          </p>
          <h3 className="text-xl font-black text-white leading-tight">
            The Complete Funnel Copy<br />Swipe File
          </h3>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-3xl font-black text-white">$37</p>
          <p className="text-xs text-gray-500 line-through">$97</p>
        </div>
      </div>

      <p className="text-gray-400 text-sm leading-relaxed mb-5">
        50 proven copy templates for every stage of your funnel — ad hooks, landing page headlines,
        SLO pages, OTO scripts, email subject lines, and VSL openers. Use them today.
      </p>

      {/* What's inside */}
      <div className="grid sm:grid-cols-2 gap-2 mb-5">
        {[
          '10 Facebook & TikTok ad hooks (steal these)',
          '8 landing page headlines with A/B variants',
          '6 SLO page headline formulas',
          '5 OTO video script openers',
          '12 email subject lines (open rates 40–60%)',
          '9 VSL / webinar hook templates',
        ].map(item => (
          <div key={item} className="flex items-start gap-2">
            <span style={{ color: archetypeColor }} className="text-sm mt-0.5 flex-shrink-0">✓</span>
            <span className="text-sm text-gray-300">{item}</span>
          </div>
        ))}
      </div>

      {/* Countdown-style urgency */}
      <div className="bg-dark border border-border rounded-xl p-3 mb-4 text-center">
        <p className="text-xs text-gray-500">
          ⚡ This price is only available on this page — it won't appear again
        </p>
      </div>

      <button
        onClick={onCTA}
        className="w-full font-black py-4 rounded-xl text-dark text-base transition-all hover:scale-[1.02]"
        style={{ background: archetypeColor }}
      >
        Get Instant Access — $37 →
      </button>

      <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-600">
        <span>🔒 Secure checkout</span>
        <span>·</span>
        <span>📥 Instant delivery</span>
        <span>·</span>
        <span>💯 30-day guarantee</span>
      </div>
    </div>
  )
}

// SLO CHECKOUT (after clicking the offer)
function SLOCheckout({ name, onClose }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="anim-fade-up text-5xl mb-4">🎉</div>
        <h2 className="anim-fade-up delay-100 text-3xl font-black mb-3">
          You're one step away{name ? `, ${name}` : ''}!
        </h2>
        <p className="anim-fade-up delay-200 text-gray-400 mb-8 text-base">
          Click below to complete your purchase of the Funnel Copy Swipe File for just $37.
        </p>
        <a
          href="https://YOUR_CHECKOUT_URL_HERE"
          target="_blank"
          rel="noopener noreferrer"
          className="anim-fade-up delay-300 block w-full bg-teal hover:bg-teal/90 text-dark font-black py-4 rounded-xl text-base transition-all hover:scale-[1.02] glow-teal mb-4"
        >
          Complete My Order — $37 →
        </a>
        <button
          onClick={onClose}
          className="anim-fade-up delay-400 text-sm text-gray-600 hover:text-gray-400 transition-colors"
        >
          No thanks — go back to my results
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState('landing')
  const [quizAnswers, setQuizAnswers] = useState({})
  const [archetype, setArchetype] = useState(null)
  const [userName, setUserName] = useState('')
  const [calcResults, setCalcResults] = useState(null)
  const [calcInputs, setCalcInputs] = useState(null)

  // Scroll to top on every screen change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [screen])

  function handleQuizComplete(answers) {
    setQuizAnswers(answers)
    setScreen('processing')
  }

  function handleProcessingDone() {
    const type = scoreAnswers(quizAnswers)
    setArchetype(type)
    setScreen('results_teaser')
  }

  function handleEmailSubmit(name, email) {
    setUserName(name)
    setScreen('results_full')
  }

  function handleCalcResults(results, inputs) {
    setCalcResults(results)
    setCalcInputs(inputs)
    setScreen('calc_results')
  }

  // Floating nav
  const showNav = !['landing', 'quiz', 'processing'].includes(screen)

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Subtle grid bg */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Floating nav */}
      {showNav && (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-card/90 backdrop-blur border border-border rounded-full px-4 py-2 text-xs">
          <button
            onClick={() => setScreen('landing')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Home
          </button>
          <span className="text-border">|</span>
          <button
            onClick={() => setScreen('quiz')}
            className={`transition-colors ${screen.startsWith('quiz') || screen === 'results_teaser' || screen === 'email_capture' || screen === 'results_full' ? 'text-teal' : 'text-gray-400 hover:text-white'}`}
          >
            Quiz
          </button>
          <span className="text-border">|</span>
          <button
            onClick={() => setScreen('calculator')}
            className={`transition-colors ${screen === 'calculator' || screen === 'calc_results' ? 'text-gold' : 'text-gray-400 hover:text-white'}`}
          >
            Calculator
          </button>
        </nav>
      )}

      {/* Screens */}
      {screen === 'landing' && (
        <Landing
          onStartQuiz={() => setScreen('quiz')}
          onStartCalc={() => setScreen('calculator')}
        />
      )}
      {screen === 'quiz' && (
        <Quiz onComplete={handleQuizComplete} />
      )}
      {screen === 'processing' && (
        <Processing onDone={handleProcessingDone} />
      )}
      {screen === 'results_teaser' && archetype && (
        <ResultsTeaser
          archetype={archetype}
          onUnlock={() => setScreen('email_capture')}
        />
      )}
      {screen === 'email_capture' && archetype && (
        <EmailCapture
          archetype={archetype}
          onSubmit={handleEmailSubmit}
        />
      )}
      {screen === 'results_full' && archetype && (
        <FullResults
          archetype={archetype}
          name={userName}
          onSLO={() => setScreen('slo_checkout')}
        />
      )}
      {screen === 'calculator' && (
        <Calculator onResults={handleCalcResults} />
      )}
      {screen === 'calc_results' && calcResults && (
        <CalcResults
          results={calcResults}
          inputs={calcInputs}
          onSLO={() => setScreen('slo_checkout')}
        />
      )}
      {screen === 'slo_checkout' && (
        <SLOCheckout
          name={userName}
          onClose={() => setScreen(archetype ? 'results_full' : 'calc_results')}
        />
      )}
    </div>
  )
}
