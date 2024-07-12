import React from 'react'

import { CCard, CCardBody, CCardHeader, CCol, CProgress, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cibTwitter,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import styles from '../assets/css/styles.module.css'


const LiveSession = () => {
  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className={styles.cardbody}>
            <CCardBody></CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default LiveSession
