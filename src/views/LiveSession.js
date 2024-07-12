import React, { useState, useEffect } from 'react'

import { CCard, CCardBody, CRow, CSpinner } from '@coreui/react'
import axios from 'axios'
import styles from '../assets/css/styles.module.css'
import CDataTable from '../views/widgets/@coreui-v3/CDataTables/CDataTable'

const LiveSession = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const fields = [
    { key: 'Submission ID', label: 'Submission ID' },
    { key: 'Authors', label: 'Authors' },
    { key: 'Title', label: 'Title' },
    { key: 'Abstract', label: 'Abstract' },
  ]
  const GOOGLE_SHEET_PROPS = {
    spreadsheetId: "1HYVlaBpzW0dSE7eHJhIRr_CxLuG_htfM3yBMCKOJRWc",
    apiKey: "AIzaSyA58ewEtO-S235_GJRgEwo6k9UN0uY2cL0",
    sheetName: "Oral arrangement",
  };

  return (
    <>
      <CRow className={styles.cardbody}>Live Session</CRow>
      <CCard>
        <CCardBody>
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <CSpinner color="primary" />
            </div>
          ) : (
            <CDataTable
              fields={fields}
              tableFilter
              hover
              sorter
              outlined
              border
              responsive
              itemsPerPageSelect
              pagination
            />
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default LiveSession
