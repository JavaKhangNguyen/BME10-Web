import React, { useState, useEffect } from 'react'
import {
  CTab,
  CTabs,
  CTabContent,
  CTabList,
  CTabPanel,
  CRow,
  CToast,
  CToastBody,
  CToastHeader,
  CSpinner
} from '@coreui/react'

import styles from '../assets/css/styles.module.css'
import Day1 from './Day1'
import Day2 from './Day2'
import Day3 from './Day3'

const LiveSession = () => {
  const [errorToast, setErrorToast] = useState(false)
  const [activeKey, setActiveKey] = useState(1)

  useEffect(() => {
    const setActiveTab = () => {
      const currentDate = new Date()
      const day = currentDate.getDate()
      const month = currentDate.getMonth() + 1 

      if (month === 7) { // July
        if (day === 25) { // 25/07
          setActiveKey(1)
        } 
        else if (day === 26) {// 26/07
          setActiveKey(2)
        } 
        else if (day === 27) { // 27/07
          setActiveKey(3)
        } 
        else if (day > 27) { // Beyond 27/07
          setActiveKey(3) 
        } 
        else { // Default 
          setActiveKey(1) 
        }
      } 
      else if (month > 7 || (month === 7 && day > 27)) {
        setActiveKey(3) // Beyond 27/7 or not
      } 
      else {
        setActiveKey(1) // Default
      }
    }
    setActiveTab()
  }, [])

  return (
    <>
      <CRow className={styles.cardbody}>Live Session</CRow>
      <CTabs activeItemKey={activeKey}>
            <CTabList variant="underline-border">
              <CTab aria-controls="home-tab-pane" itemKey={1} className={styles.tablabel}>
                Day 1 - 25/07/2024
              </CTab>
              <CTab aria-controls="profile-tab-pane" itemKey={2} className={styles.tablabel}>
                Day 2 - 26/07/2024
              </CTab>
              <CTab aria-controls="profile-tab-pane" itemKey={3} className={styles.tablabel}>
                Day 3 - 27/07/2024
              </CTab>
            </CTabList>
            <CTabContent>
              <CTabPanel className="py-3" aria-labelledby="home-tab-pane" itemKey={1}>
                <Day1 />
              </CTabPanel>
              <CTabPanel className="py-3" aria-labelledby="profile-tab-pane" itemKey={2}>
                <Day2 />
              </CTabPanel>
              <CTabPanel className="py-3" aria-labelledby="profile-tab-pane" itemKey={3}>
                <Day3 />
              </CTabPanel>
            </CTabContent>
          </CTabs>
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
