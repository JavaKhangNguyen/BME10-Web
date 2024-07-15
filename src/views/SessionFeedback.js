import React, { useState } from 'react'
import { CCard, CCardBody, CSpinner } from '@coreui/react'

const SessionFeedback = () => {
  const [isLoading, setIsLoading] = useState(true)

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  return (
    <CCard className={'border-info'} style={{ height: '100vh' }}>
      <CCardBody style={{ height: '100%', padding: 0, position: 'relative' }}>
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)'
          }}>
            <CSpinner color="info" />
          </div>
        )}
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLScdJ3888X_Z-c7n72WfCDAqMEWDWZxF_K_PFLXeRcSTy7aH5w/viewform?embedded=true"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          title="Session Feedback Form"
          onLoad={handleIframeLoad}
        >
          Loading…
        </iframe>
      </CCardBody>
    </CCard>
  )
}

export default SessionFeedback