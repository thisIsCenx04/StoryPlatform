import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { apiConfig } from '../../config/apiConfig'

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white shadow rounded-lg p-6 border border-slate-200">
        <h1 className="text-xl font-semibold text-slate-900 mb-1">Admin login</h1>
        <p className="text-sm text-slate-500 mb-6">
          Chỉ admin biết đường dẫn <code>{apiConfig.adminLoginPagePath}</code> mới có thể đăng nhập.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Username</label>
            <input
              name="username"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Password</label>
            <input
              name="password"
              type="password"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
