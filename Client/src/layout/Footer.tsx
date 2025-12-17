const Footer = () => (
  <footer
    className="px-6 py-6 text-center text-sm"
    style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}
  >
    © {new Date().getFullYear()} StorySite. All rights reserved.
  </footer>
)

export default Footer