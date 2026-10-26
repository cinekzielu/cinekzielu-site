const number = (value, digits = 0) => value.toLocaleString('pl-PL', { maximumFractionDigits: digits })

// Describe the complete recording shown on the card, never a selected day.
export function routeCardDescription(route, row, peak, dayCount = 0) {
  const scope = dayCount > 1 ? `Cały zapis obejmujący ${dayCount} dni.` : 'Cały zapis trasy.'
  const summit = peak ? `Najwyższy przypisany szczyt: ${peak.name}, ${number(peak.altitude)} m n.p.m.; wysokość niezależna od GPS.` : 'Brak przypisanego szczytu.'
  return `${route.title} · ${route.dates}. ${scope} Dystans zapisu: ${number(row.distance / 1000, 1)} km. Suma podejść z GPS: około ${number(row.ascentEstimate)} m. ${summit}`
}
