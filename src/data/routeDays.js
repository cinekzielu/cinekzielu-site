// Display a recorded day without bridging gaps or changing source elevations.
export function routeDayView(track, route, id = 'all') {
  const day = track.days?.find(day => day.id === id)
  if (!day) return { track, route }
  const offset = track.points[day.startIndex][4]
  const points = track.points.slice(day.startIndex, day.endIndex + 1).map(point => [
    ...point.slice(0, 4), Math.round((point[4] - offset) * 10) / 10,
  ])
  const stages = track.stages?.filter(stage => stage.startIndex >= day.startIndex && stage.endIndex <= day.endIndex)
    .map(stage => ({ ...stage, startIndex: stage.startIndex - day.startIndex, endIndex: stage.endIndex - day.startIndex }))
  return {
    track: { ...track, points, distance: points.at(-1)[4], minElevation: Math.min(...points.map(p => p[2])), maxElevation: Math.max(...points.map(p => p[2])), dates: day.dates, stages },
    route: { ...route, title: `${route.title} · dzień ${day.id}`, dates: day.dates, peaks: route.peaks.filter(peak => day.peakIds.includes(peak.id)) },
  }
}
