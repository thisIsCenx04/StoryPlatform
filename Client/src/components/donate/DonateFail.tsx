const DonateFail = ({ message }: { message?: string }) => (
  <div className="p-4 rounded border border-rose-200 bg-rose-50 text-rose-700">
    {message || 'Donate không thành công, vui lòng thử lại.'}
  </div>
)

export default DonateFail
