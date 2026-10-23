import React, { Component } from 'react'

// A rejected lazy module is cached by the browser/React. Keep the surrounding
// expedition and exit controls usable; a page reload starts a fresh module load.
export class RouteLoadBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (!this.state.failed) return this.props.children
    return <div className={`${this.props.className} cz-route-load-error`} tabIndex={-1} role="alert">
      <p>{this.props.message}</p>
      <button type="button" onClick={() => window.location.reload()}>Odśwież stronę</button>
    </div>
  }
}
