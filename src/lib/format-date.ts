function ordinalSuffix(day: number) {
  if (day % 10 === 1 && day !== 11) return "st"
  if (day % 10 === 2 && day !== 12) return "nd"
  if (day % 10 === 3 && day !== 13) return "rd"
  return "th"
}

function formatLongDate(date: Date) {
  const day = date.getDate()
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" })
  const month = date.toLocaleDateString("en-US", { month: "long" })
  const year = date.getFullYear()

  return `${day}${ordinalSuffix(day)} ${weekday} ${month}, ${year}`
}

export { formatLongDate }
