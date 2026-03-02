import { Link } from "react-router"

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200">
      <nav className="navbar">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}
          >
            <span className="text-white text-xs font-bold tracking-tight">R</span>
          </div>
          <span className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors duration-150">
            Resumind
          </span>
        </Link>

        <Link to="/upload" className="primary-button w-auto text-sm px-4 py-2">
          + Upload Resume
        </Link>
      </nav>
    </header>
  )
}

export default Navbar
