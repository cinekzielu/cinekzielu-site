const number = (value, digits = 0) => value.toLocaleString('pl-PL', { maximumFractionDigits: digits })

export function routeSampleDescription(sample) {
  if (sample.kind === 'point') return `≈ ${number(sample.elevation)} m n.p.m.`
  if (sample.kind === 'gap') return 'Przerwa w zapisie GPS'
  if (sample.kind === 'outside') return 'Poza zapisem tej trasy'
  return 'Brak danych punktu'
}

export function comparisonPointDescription(distance, samples) {
  return `${number(distance / 1000, 2)} km od początku tras. ${samples.map((sample, slot) => `${slot === 0 ? 'A' : 'B'}: ${routeSampleDescription(sample)}`).join('. ')}`
}
