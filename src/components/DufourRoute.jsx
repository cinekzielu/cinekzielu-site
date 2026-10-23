import React from 'react'
import { TripRoute } from './TripRoute'

// Preserve the accepted Dufourspitze entry point and anchor.
export function DufourRoute({ showPhotos = true }) { return <TripRoute routeId="dufourspitze" showPhotos={showPhotos} /> }
