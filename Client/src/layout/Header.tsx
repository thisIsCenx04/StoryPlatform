import { Link } from 'react-router-dom'

const Header = () => (
  <header className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
    <Link to="/" className="text-lg font-semibold tracking-wide">
      StorySite
    </Link>
    <nav className="flex items-center gap-4 text-sm">
      <Link to="/stories" className="hover:text-emerald-300">
        Truyện
      </Link>
      <Link to="/donate" className="hover:text-emerald-300">
        Donate
      </Link>
      <Link to="/admin" className="hover:text-emerald-300">
        Admin
      </Link>
    </nav>
  </header>
)

export default Header
