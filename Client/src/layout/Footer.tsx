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
            <div className="text-xs">Kho truyện đề xuất theo gu đọc</div>
          </div>
        </div>
        <p className="text-sm max-w-sm">
          Cập nhật truyện hot mỗi ngày, cộng đồng đánh giá minh bạch và đề xuất theo thể loại.
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
          Thông tin nổi bật
        </div>
        <ul className="space-y-2 text-sm">
          <li>Top truyện được yêu thích tuần này</li>
          <li>Chuyên mục review và đánh giá có chọn lọc</li>
          <li>Danh sách truyện mới cập nhật</li>
          <li>Gợi ý theo thể loại và gu đọc</li>
        </ul>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
          Liên hệ
        </div>
        <div className="text-sm">Email: hello@storyhub.vn</div>
        <div className="text-sm">Hotline: 0901 234 567</div>
        <div className="text-sm">Địa chỉ: 12 Nguyễn Trãi, Hà Nội</div>
      </div>
    </div>

    <div className="mt-8 text-xs text-center">
      © {new Date().getFullYear()} StoryHub. Bản quyền nội dung thuộc về tác giả và cộng đồng.
    </div>
  </footer>
)

export default Footer
