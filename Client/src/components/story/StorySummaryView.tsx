import type { StorySummarySection } from '../../types/story'

const StorySummaryView = ({ sections }: { sections: StorySummarySection[] }) => {
  if (!sections?.length) return null
  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.id ?? section.sortOrder} className="space-y-3">
          {section.textContent && (
            <p className="leading-relaxed" style={{ color: 'var(--text)' }}>
              {section.textContent}
            </p>
          )}
          {section.imageUrl && (
            <img
              src={section.imageUrl}
              alt=""
              className="w-full rounded-lg"
              style={{ border: '1px solid var(--border)' }}
              loading="lazy"
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default StorySummaryView
