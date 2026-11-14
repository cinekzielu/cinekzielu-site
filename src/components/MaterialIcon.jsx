import React from 'react'

// A small, shared set with clipped corners and diagonals echoing the CZ mark.
// Icons accompany readable labels; they never supply a control's accessible name.
const shapes = {
  photo: <><path d="M2.5 8.5 5 6h3l2-3h5l2 3h4.5v14.5h-19z" /><circle cx="12" cy="13" r="4" /></>,
  film: <><path d="m2.5 7 17-4 2 5-17 4zM4.5 12v8.5h17V8M8 5.7l3 4.4m3-5.8 3 4.4" /><path d="m11 13 5 3-5 3z" /></>,
  route: <><path d="M5 18v-4l14-4V6" /><path d="m5 18 3 3-3 3-3-3z" transform="translate(0 -2)" /><path d="m19 2 3 3-3 3-3-3z" /></>,
  summit: <><path d="m2 20 8-15 4 7 3-4 5 12H2M7 11l3 2 2-3" /></>,
  ascent: <path d="M3 20h5v-5h5v-5h7V4m-5 0h5v5" />,
  compare: <><path d="M3 4v16m18-16v16M6 17l4-7 3 4 4-6M6 7h2m8 10h2" /></>,
  map: <path d="m3 5 6-2 6 3 6-2v15l-6 2-6-3-6 2V5m6-2v15m6-12v15" />,
  arrow: <path d="M5 19 19 5M6 5h13v13" />,
}

export function MaterialIcon({ name, size = 20, className = '' }) {
  return <svg className={`cz-material-icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true" focusable="false">{shapes[name]}</svg>
}
