import React from 'react'

// Shared black/bronze surface for the vector maps. Grain is decorative, not terrain.
export function AtlasMapSurface({ prefix }) {
  return <defs>
    <radialGradient id={`${prefix}-sea`} cx="40%" cy="35%" r="75%"><stop stopColor="#101210" /><stop offset="1" stopColor="#080b0a" /></radialGradient>
    <linearGradient id={`${prefix}-land`} x2=".7" y2="1"><stop stopColor="#29271f" /><stop offset=".5" stopColor="#211e17" /><stop offset="1" stopColor="#16150f" /></linearGradient>
    <radialGradient id={`${prefix}-gold`}><stop stopColor="#393126" /><stop offset="1" stopColor="#25221b" /></radialGradient>
    <filter id={`${prefix}-grain`} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" seed="12" />
      <feColorMatrix type="saturate" values="0" />
      <feComponentTransfer><feFuncA type="linear" slope=".1" /></feComponentTransfer>
      <feComposite in2="SourceGraphic" operator="in" />
      <feBlend in2="SourceGraphic" mode="soft-light" />
    </filter>
  </defs>
}
