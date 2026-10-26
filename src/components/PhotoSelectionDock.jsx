import React from 'react'
import {createPortal} from 'react-dom'
import '../photoSelection.css'

export function PhotoSelectionDock({children}) {
  return createPortal(<aside className="cz-photo-dock" aria-label="Pasek wyboru zdjęć">{children}</aside>,document.body)
}
