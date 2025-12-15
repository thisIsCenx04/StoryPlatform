import type { StorySummarySection } from '../../types/story'

const StorySummaryView = ({ sections }: { sections: StorySummarySection[] }) => {
  if (!sections?.length) return null
  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.id ?? section.sortOrder} className="space-y-3">
          {section.textContent && <p className="text-slate-700 leading-relaxed">{section.textContent}</p>}
          {section.imageUrl && (
            <img src={section.imageUrl} alt="" className="w-full rounded-lg border border-slate-200" loading="lazy" />
          )}
        </div>
      ))}
    </div>
  )
}

export default StorySummaryView
