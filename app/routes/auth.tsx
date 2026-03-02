import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter"

export const meta = () => ([
  { title: 'Resumind | Sign In' },
  { name: 'description', content: 'Log into your account' }
])

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const navigate = useNavigate();

  const rawNext = new URLSearchParams(location.search).get('next');
  const next = rawNext && rawNext.startsWith('/') ? rawNext : '/';

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated, next])

  const handleGuestLogin = () => {
    auth.setGuestMode(true);
    navigate(next);
  }

  return (
    <main className="min-h-screen bg-[url('/images/bg-auth.svg')] bg-cover flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Top accent bar */}
          <div
            className="h-1 w-full"
            style={{ background: "linear-gradient(to right, #6366f1, #7c3aed, #818cf8)" }}
          />

          <div className="p-8">
            {/* Logo + heading */}
            <div className="flex flex-col items-center gap-5 mb-8 text-center">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}
              >
                <span className="text-white text-lg font-bold">R</span>
              </div>
              <div>
                <h1 className="!text-2xl !leading-tight mb-1.5">Welcome back</h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Sign in to continue your job journey
                </p>
              </div>
            </div>

            {/* Auth buttons */}
            <div className="flex flex-col gap-3">
              {isLoading ? (
                <button className="auth-button pointer-events-none opacity-70" disabled>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing you in...
                </button>
              ) : (
                <>
                  {auth.isAuthenticated ? (
                    <button className="auth-button" onClick={auth.signOut}>
                      Sign Out
                    </button>
                  ) : (
                    <>
                      <button className="auth-button" onClick={auth.signIn}>
                        Sign In with Puter
                      </button>

                      <div className="relative my-1">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-white px-3 text-xs text-slate-400 font-medium uppercase tracking-wider">
                            or
                          </span>
                        </div>
                      </div>

                      <button
                        className="inline-flex items-center justify-center gap-2
                          bg-slate-100 hover:bg-slate-200 text-slate-700
                          text-base font-semibold rounded-xl px-6 py-3.5 w-full
                          transition-all duration-150 cursor-pointer
                          border border-slate-200
                          focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2"
                        onClick={handleGuestLogin}
                      >
                        Continue as Guest
                      </button>

                      <p className="text-xs text-slate-400 text-center leading-relaxed mt-1">
                        Guest sessions are temporary — data will be lost when you close the browser.
                      </p>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Auth
