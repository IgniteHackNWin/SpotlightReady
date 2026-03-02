export function QuestionCard() {
  // TODO: Pull current question from session store
  return (
    <div className="glass-card max-w-2xl w-full p-8 text-center">
      <p className="text-white/40 text-sm uppercase tracking-wider mb-4">Question</p>
      <p className="text-2xl text-white font-medium leading-relaxed">
        Tell me about a time you had to debug a complex production issue under pressure.
        How did you approach it?
      </p>
    </div>
  )
}
