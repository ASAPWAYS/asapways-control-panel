function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center rounded-2xl bg-card text-center">
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Coming soon.</p>
    </div>
  )
}

export default PlaceholderPage
