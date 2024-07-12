import React from 'react'

const Abstract = React.lazy(() => import('./views/Abstract'))
const LiveSession = React.lazy(() => import('./views/LiveSession'))

const routes = [
  { path: '/', name: 'Abstract', element: Abstract },
  { path: '/live', name: 'Live Session', element: LiveSession}
]

export default routes
