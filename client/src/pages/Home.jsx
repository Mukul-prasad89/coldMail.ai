import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

function Home() {
  console.log(import.meta.env.VITE_API_URL)
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(10)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const intervalRef = useRef(null)
  const [emails, setEmails] = useState(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    setError('')
    setEmails(null)
    setTimer(10)

    intervalRef.current = setInterval(() => {
      setTimer((prev) => Math.max(0, prev - 1))
    }, 1000)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/generate-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      if (data.message) {
        setError(data.message)
        setLoading(false)
        if (intervalRef.current) clearInterval(intervalRef.current)
        return
      }
      setEmails(data.emails)
    } catch (err) {
      setError(err.message)
      setLoading(false)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }

  useEffect(() => {
    if (emails) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setLoading(false)
      navigate('/results', { state: { emails } })
    }
  }, [emails, navigate])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(to top right, #0a0a0f, #0a0a0f, #1a0a2e, #0a0a0f)' }}>
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 backdrop-blur-xl" style={{ background: 'rgba(255, 255, 255, 0.04)' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="text-white font-semibold text-3xl tracking-tight">
            coldmail<span className="text-purple-400">.ai</span>
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6"
        >
          <span className="text-gray-500 text-sm">AI-Powered Outreach</span>
        </motion.div>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center max-w-3xl"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/30 border border-purple-700/30 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-purple-300 text-sm font-medium">
              Powered by Llama 3.3 70B
            </span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            <span className="whitespace-nowrap">Turn Client's Hiring Needs into</span>{' '}
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Business Opportunities
            </span>
          </h1>

          <div className="mb-10 w-full max-w-4xl mx-auto">
            <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-purple-900/40 via-purple-600/50 to-purple-900/40">
              <div className="rounded-2xl bg-dark-800/90 backdrop-blur-sm p-6">
                <div className="grid grid-cols-7 gap-1 items-start">
                  {[
                    { step: '1', label: 'Client URL', icon: '🔗', desc: 'Enters website' },
                    { step: '2', label: 'LangChain', icon: '🕸️', desc: 'Web scrapes' },
                    { step: '3', label: 'LLM', icon: '🧠', desc: 'Extract roles' },
                    { step: '4', label: 'JSON', icon: '📋', desc: 'Job roles' },
                    { step: '5', label: 'Vector DB', icon: '🗄️', desc: 'Semantic search' },
                    { step: '6', label: 'Match', icon: '🎯', desc: 'Finds talent' },
                    { step: '7', label: 'LLM Draft', icon: '✍️', desc: 'Writes email' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i, duration: 0.4 }}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="w-12 h-12 rounded-xl bg-dark-700 border border-purple-700/30 flex items-center justify-center mb-2 relative">
                        <span className="text-lg">{item.icon}</span>
                        {i < 6 && (
                          <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 items-center">
                            <svg className="w-6 h-4 text-purple-500" viewBox="0 0 40 12" fill="none">
                              <path d="M2 6h30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
                              <path d="M30 2l6 4-6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <span className="text-white text-xs font-semibold">{item.label}</span>
                      <span className="text-gray-600 text-[10px] mt-0.5">{item.desc}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full max-w-xl"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-xl opacity-50 group-hover:opacity-75 blur transition duration-300" />
            <div className="relative flex items-center bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
              <div className="pl-5 pr-3">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                  />
                </svg>
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter a company website URL (e.g. https://company.com)"
                className="flex-1 bg-transparent text-white placeholder-gray-600 py-4 pr-4 outline-none text-sm"
                disabled={loading}
              />
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.03 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                className="mr-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
              >
                {loading ? 'Generating...' : 'Generate Email'}
              </motion.button>
            </div>
          </div>
        </motion.form>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-8 w-auto"
            >
              <div className="relative p-[1px] rounded-xl bg-gradient-to-r from-green-500/40 via-green-400/60 to-green-500/40">
                <div className="rounded-xl bg-dark-800/90 backdrop-blur-sm px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin shrink-0" />
                    <span className="text-green-300 text-xs font-medium">Generating email</span>
                    <div className="flex items-center gap-1.5 ml-auto">
                      <div className="w-16 h-1.5 rounded-full bg-dark-600 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-300"
                          initial={{ width: '100%' }}
                          animate={{ width: `${(timer / 10) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <span className="text-green-300 text-sm font-mono font-bold tabular-nums">{timer}s</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-4 rounded-xl bg-red-900/20 border border-red-700/30 text-red-400 text-sm max-w-xl">
            {error}
          </motion.div>
        )}
      </main>
      <footer className="relative z-10 text-center py-6 border-t border-dark-700/30">
        <p className="text-gray-600 text-xs">ColdEmail.ai — AI-powered cold email outreach</p>
      </footer>
    </div>
  )
}

export default Home
