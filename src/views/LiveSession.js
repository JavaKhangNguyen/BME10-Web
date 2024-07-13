import React, { useState, useEffect } from 'react'
import {
  CTab,
  CTabs,
  CTabContent,
  CTabList,
  CTabPanel,
  CCard,
  CCardBody,
  CRow,
  CToast,
  CToastBody,
  CToastHeader,
} from '@coreui/react'

import styles from '../assets/css/styles.module.css'
import DaySession from './DaySession'
import SessionSchedule from './SessionSchedule'

const LiveSession = () => {
  const [errorToast, setErrorToast] = useState(false)
  return (
    <>
      <CRow className={styles.cardbody}>Live Session</CRow>
      <CCard className={'border-info'}>
        <CCardBody>
          <CTabs activeItemKey={1}>
            <CTabList variant="underline-border">
              <CTab aria-controls="home-tab-pane" itemKey={1} className={styles.tablabel}>
                Session
              </CTab>
              <CTab aria-controls="profile-tab-pane" itemKey={2} className={styles.tablabel}>
                Day
              </CTab>
            </CTabList>
            <CTabContent>
              <CTabPanel className="py-3" aria-labelledby="home-tab-pane" itemKey={1}>
                <SessionSchedule />
              </CTabPanel>
              <CTabPanel className="py-3" aria-labelledby="profile-tab-pane" itemKey={2}>
                <DaySession />
              </CTabPanel>
            </CTabContent>
          </CTabs>
        </CCardBody>
      </CCard>
      <CToast
        visible={errorToast}
        animation={true}
        autohide={true}
        color="danger"
        delay={3000}
        onClose={() => setErrorToast(false)}
      >
        <CToastHeader closeButton>Error</CToastHeader>
        <CToastBody>Something went wrong</CToastBody>
      </CToast>
    </>
  )
}

export default LiveSession
