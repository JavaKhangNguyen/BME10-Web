import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard, 
  CCardHeader,
  CCardBody,
  CForm,
  CFormInput,
  CRow,
  CCol,
  CSpinner,
  CTable,
  CTableRow,
  CTableHead,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
} from '@coreui/react'
import axios from 'axios'
import styles from '../../assets/css/styles.module.css'

const PosterSession2 = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const GOOGLE_SHEET_PROPS = {
    spreadsheetId: '1HYVlaBpzW0dSE7eHJhIRr_CxLuG_htfM3yBMCKOJRWc',
    apiKey: 'AIzaSyA58ewEtO-S235_GJRgEwo6k9UN0uY2cL0',
    sheetName: 'Poster arrangement',
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_PROPS.spreadsheetId}/values/${GOOGLE_SHEET_PROPS.sheetName}?key=${GOOGLE_SHEET_PROPS.apiKey}`,
        )

        const sheetData = response.data.values
        let startIndex = -1
        let endIndex = -1

        for (let i = 0; i < sheetData.length; i++) {
          if (sheetData[i][0] === 'Poster session 2') {
            startIndex = i + 2
            break
          }
        }

        if (startIndex !== -1) {
          const relevantData = sheetData.slice(startIndex, endIndex)
          const organizedData = []
          let sessionData = null

          relevantData.forEach((row) => {
            if (row[0]) {
              if (sessionData) {
                organizedData.push(sessionData)
              }
              sessionData = {
                sessionName: row[0],
                papers: []
              }
            }
            sessionData.papers.push({
              posterId: row[1],
              submissionId: row[2],
              paperTitle: row[3]
            })
          })
          if (sessionData) {
            organizedData.push(sessionData)
          }

          setData(organizedData)
          setFilteredData(organizedData)
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    filterData(value)
  }

  const filterData = (term) => {
    if (term.trim() === '') {
      setFilteredData(data)
    } else {
      const filtered = data.map(session => ({
        ...session,
        papers: session.papers.filter(paper =>
          paper.paperTitle.toLowerCase().includes(term.toLowerCase()) ||
          paper.submissionId.toLowerCase().includes(term.toLowerCase())
        )
      })).filter(session => session.papers.length > 0)

      setFilteredData(filtered)
    }
  }

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) {
      return text
    }
    const regex = new RegExp(`(${highlight})`, 'gi')
    return text
      .split(regex)
      .map((part, index) => (regex.test(part) ? <mark key={index}>{part}</mark> : part))
  }

  if (isLoading) {
    return (
      <div className={styles.spinner}>
        <CSpinner color="info" />
      </div>
    )
  }

  return (
    <CRow>
      <CForm>
        <CRow className="w-100">
          <CCol xs={7}>
            <CFormInput
              style={{ marginBottom: '15px' }}
              placeholder="Search paper ID or title"
              value={searchTerm}
              onChange={handleInputChange}
            />
          </CCol>
          <CCol>
            <CButton color="info" variant='outline' onClick={() => filterData(searchTerm)} style={{ marginBottom: '15px' }}>
              Search
            </CButton>
          </CCol>
        </CRow>
      </CForm>
      {filteredData.map((session, index) => (
        <CCard key={index} className="mb-4">
          <CCardHeader className={styles.cardheader}>{session.sessionName}</CCardHeader>
          <CCardBody className={'border-info'}>
            <CTable responsive bordered align='middle'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Poster ID</CTableHeaderCell>
                  <CTableHeaderCell>Paper</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {session.papers.map((paper, paperIndex) => (
                  <CTableRow key={paperIndex}>
                    <CTableDataCell>{paper.posterId}</CTableDataCell>
                    <CTableDataCell>
                      {highlightText(`#${paper.submissionId} ${paper.paperTitle}`, searchTerm)}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      ))}
    </CRow>
  )
}

export default PosterSession2