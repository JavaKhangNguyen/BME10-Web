import React, { useState, useEffect } from 'react'
import { CCardBody, CRow, CCard, CSpinner } from '@coreui/react'
import axios from 'axios'
import styles from '../assets/css/styles.module.css'
import CDataTable from '../views/widgets/@coreui-v3/CDataTables/CDataTable'

const Abstract = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const fields = [
    { key: 'Submission ID', label: 'Submission ID' },
    { key: 'Authors', label: 'Authors' },
    { key: 'Title', label: 'Title' },
    { key: 'Abstract', label: 'Abstract' },
  ]
  const GOOGLE_SHEET_PROPS = {
    spreadsheetId: "1njDrQL77uCcatspEjHWb0LPft5I--k_x38V3d2AKi7Q",
    apiKey: "AIzaSyA58ewEtO-S235_GJRgEwo6k9UN0uY2cL0",
    sheetName: "Submissions",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_PROPS.spreadsheetId}/values/${GOOGLE_SHEET_PROPS.sheetName}?key=${GOOGLE_SHEET_PROPS.apiKey}`,
        )

        const sheetData = response.data.values
        const formattedData = sheetData.slice(1).map((row) => {
          const formattedRow = {}
          fields.forEach((field, index) => {
            formattedRow[field.key] = row[index]
          })
          return formattedRow
        })

        setData(formattedData)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <CRow className={styles.cardbody}>Abstract Book</CRow>
      <CCard>
        <CCardBody>
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <CSpinner color="primary" />
            </div>
          ) : (
            <CDataTable
              items={data}
              fields={fields}
              tableFilter
              hover
              sorter
              outlined
              border
              responsive
              pagination
            />
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default Abstract
