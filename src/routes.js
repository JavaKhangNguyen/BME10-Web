import React from 'react'

const Abstract = React.lazy(() => import('./views/Abstract'))
const LiveSession = React.lazy(() => import('./views/LiveSession'))
const SessionFeedback = React.lazy(() => import('./views/SessionFeedback'))
const Photos = React.lazy(() => import('./views/Photos'))

const routes = [
  { path: '/', name: 'Abstract Book', element: Abstract },
  { path: '/live', name: 'Live Session', element: LiveSession},
  { path: '/feedback', name: 'Session Feedback', element: SessionFeedback},
  { path: '/photos', name: 'Photos', element: Photos}
]

export default routes
