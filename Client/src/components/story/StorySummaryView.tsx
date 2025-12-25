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
            <div className="w-full">
              <img
                src={section.imageUrl}
                alt=""
                className="w-full max-w-3xl rounded-lg object-contain mx-auto"
                style={{ border: '1px solid var(--border)', maxHeight: '520px' }}
                loading="lazy"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default StorySummaryView
