const Footer = () => (
  <footer
    className="px-6 py-10"
    style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}
  >
    <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-full"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
          />
          <div>
            <div className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
              StoryHub
            </div>
            <div className="text-xs">Kho truy63n 0467 xu59t theo gu 0469c</div>
          </div>
        </div>
        <p className="text-sm max-w-sm">
          C67p nh67t truy63n hot m69i ngy, c61ng 0465ng 04nh gi minh b55ch v 0467 xu59t theo th69 lo55i.
        </p>
        <div className="flex items-center gap-3 text-sm">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:underline">
            Facebook
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:underline">
            Instagram
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:underline">
            TikTok
          </a>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
          Th00ng tin n67i b67t
        </div>
        <ul className="space-y-2 text-sm">
          <li>Top truy63n 040661c yu thch tu61n ny</li>
          <li>Chuyn m63c review v 04nh gi c ch69n l69c</li>
          <li>Danh sch truy63n m63i c67p nh67t</li>
          <li>G61i 05 theo th69 lo55i v gu 0469c</li>
        </ul>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
          Lin h63
        </div>
        <div className="text-sm">Email: hello@storyhub.vn</div>
        <div className="text-sm">Hotline: 0901 234 567</div>
        <div className="text-sm">0367a ch65: 12 Nguy61n Tr00i, H N61i</div>
      </div>
    </div>

    <div className="mt-8 text-xs text-center">
      08 {new Date().getFullYear()} StoryHub. B57n quy67n n61i dung thu61c v67 tc gi57 v c61ng 0465ng.
    </div>
  </footer>
)

export default Footer
