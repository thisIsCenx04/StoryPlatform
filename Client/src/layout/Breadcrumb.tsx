import { Link } from 'react-router-dom'

interface Crumb {
  label: string
  to?: string
}

interface BreadcrumbProps {
  items: Crumb[]
}

const Breadcrumb = ({ items }: BreadcrumbProps) => (
  <nav className="text-sm text-slate-500 py-2" aria-label="Breadcrumb">
    <ol className="flex items-center gap-2">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-center gap-2">
          {item.to ? (
            <Link to={item.to} className="hover:text-emerald-600">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-600">{item.label}</span>
          )}
          {idx < items.length - 1 && <span className="text-slate-300">/</span>}
        </li>
      ))}
    </ol>
  </nav>
)

export default Breadcrumb
