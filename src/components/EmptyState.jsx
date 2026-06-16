export default function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="text-center py-10 px-5">
      <h2 className="text-lg font-semibold text-stone-800 mb-2">{title}</h2>
      <p className="text-sm text-stone-500 mb-4">{message}</p>
      {actionLabel && onAction && (
        <button
          className="px-4 py-2 bg-brand-700 text-white text-sm font-medium rounded-sm hover:bg-brand-800 transition-colors"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
