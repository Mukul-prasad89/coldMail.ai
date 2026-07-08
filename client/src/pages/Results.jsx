import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const emails = location.state?.emails
  const [copiedIndex, setCopiedIndex] = useState(null)

  useEffect(() => {
    if (!emails) navigate('/')
  }, [emails, navigate])

  if (!emails) return null

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(to top right, #0a0a0f, #0a0a0f, #1a0a2e, #0a0a0f)' }}>
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 backdrop-blur-xl" style={{ background: 'rgba(20, 20, 35, 0.75)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="text-white font-semibold text-3xl tracking-tight">
            coldmail<span className="text-purple-400">.ai</span>
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 text-sm rounded-lg border border-dark-600 transition-colors"
        >
          New Search
        </motion.button>
      </nav>

      <main className="relative z-10 flex-1 px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
            <h2 className="text-white text-2xl font-bold">
              Email{emails.length > 1 ? 's' : ''} Generated
            </h2>
            <span className="text-gray-500 text-sm bg-dark-700 px-3 py-0.5 rounded-full">
              {emails.length}
            </span>
          </div>

          {emails.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="mb-6"
            >
              <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-purple-900/40 via-purple-600/50 to-purple-900/40">
                <div className="rounded-2xl bg-dark-800/90 backdrop-blur-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      <span className="text-purple-300 text-sm font-semibold">{item.role}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        navigator.clipboard.writeText(item.email)
                        setCopiedIndex(i)
                        setTimeout(() => setCopiedIndex(null), 1500)
                      }}
                      className={`px-5 py-1.5 bg-dark-700 hover:bg-dark-600 cursor-pointer text-xs rounded-lg border transition-colors ${copiedIndex === i ? 'text-green-400 border-green-400/30' : 'text-gray-400 border-dark-600'}`}
                    >
                      {copiedIndex === i ? 'Copied!' : 'Copy'}
                    </motion.button>
                  </div>
                  <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {item.email}
                  </pre>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Generate Another Email
            </motion.button>
          </motion.div>
        </motion.div>
      </main>

      <footer className="relative z-10 text-center py-6 border-t border-dark-700/30">
        <p className="text-gray-600 text-xs">ColdEmail.ai — AI-powered cold email outreach</p>
      </footer>
    </div>
  )
}

export default Results
