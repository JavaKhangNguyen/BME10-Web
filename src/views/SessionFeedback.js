import React, { useState } from 'react'
import { CCard, CCardBody, CSpinner, CAlert } from '@coreui/react'
import styles from '../assets/css/styles.module.css'

const SessionFeedback = () => {
  const [isLoading, setIsLoading] = useState(true)

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  return (
    <CCard className={'border-info'} style={{ height: '100vh' }}>
      <CCardBody className={styles.cardbody}>
        <CAlert color="info" variant='solid' dismissible style={{ margin: 0 }}>
          This form is hosted by Google Forms. You need to accept cookies to view and submit your feedback.
        </CAlert>
        {isLoading && (
          <div className={styles.spinner}>
            <CSpinner color="info" />
          </div>
        )}
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLScdJ3888X_Z-c7n72WfCDAqMEWDWZxF_K_PFLXeRcSTy7aH5w/viewform?embedded=true"
          width="100%"
          height="85%"
          style={{ border: 'none' }}
          title="Session Feedback Form"
          onLoad={handleIframeLoad}
        >
          Loading...
        </iframe>
      </CCardBody>
    </CCard>
  )
}

export default SessionFeedback