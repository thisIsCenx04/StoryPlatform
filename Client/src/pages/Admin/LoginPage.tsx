import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const LoginPage = () => {
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const username = String(form.get('username') ?? '')
    const password = String(form.get('password') ?? '')
    await login({ username, password })
    navigate('/admin/dashboard', { replace: true })
  }

  return (
    <div className="admin-shell flex items-center justify-center px-4">
      <div className="admin-card w-full max-w-md p-6 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
            StoryHub Admin
          </p>
          <h1 className="text-2xl font-semibold">0300ng nh67p qu57n tr67</h1>
          <p className="text-sm admin-muted mt-1">Vui lng dng ti kho57n qu57n tr67 0469 ti65p t63c.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-1">Tn 0400ng nh67p</label>
            <input name="username" className="admin-input w-full" required />
          </div>
          <div>
            <label className="block text-sm mb-1">M67t kh63u</label>
            <input name="password" type="password" className="admin-input w-full" required />
          </div>
          {error && <p className="text-sm" style={{ color: '#ff8b8b' }}>{error}</p>}
          <button type="submit" className="admin-button admin-button-primary w-full" disabled={loading}>
            {loading ? '03ang 0400ng nh67p...' : '0300ng nh67p'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
