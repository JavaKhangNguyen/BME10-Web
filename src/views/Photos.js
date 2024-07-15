import React, { useState } from 'react'
import {CCard, CCardBody, CSpinner, CRow} from '@coreui/react'
import styles from '../assets/css/styles.module.css'

const Photos = () => {
    const [isLoading, setIsLoading] = useState(true)
    
    const handlePhotosLoad = () => {
        setIsLoading(false)
    }

    if (isLoading) {
        return (
          <div className={styles.spinner}>
            <CSpinner color="info" />
          </div>
        )
      }

    return (
        <>
        <CRow className={styles.cardbody}>Photos</CRow>
        <CCard className={'border-info'}>
            <CCardBody>

            </CCardBody>
        </CCard>
        </>
        
    )

}

export default Photos