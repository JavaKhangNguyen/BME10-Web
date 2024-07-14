import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard, 
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

const ParallelDay1 = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const GOOGLE_SHEET_PROPS = {
    spreadsheetId: '1EXn7R4dhv-qqD0uE9U6rVsL3WinxlV77d-vFUfAzoV8',
    apiKey: 'AIzaSyA58ewEtO-S235_GJRgEwo6k9UN0uY2cL0',
    sheetName: 'Oral arrangement',
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
          const rowContent = sheetData[i].join(' ').trim();
          if (rowContent.includes('SESSION NAME') && rowContent.includes('Medical Instrumentations')) {
            startIndex = i;
          } else if (startIndex !== -1 && rowContent.includes('COFFEE BREAK')) {
            endIndex = i;
            break;
          }
        }

        if (startIndex !== -1 && endIndex !== -1){
          const relevantData = sheetData.slice(startIndex, endIndex)
          const organizedData = []

          for (let i = 1; i <= 5; i++) {
            const sessionChairs = relevantData[2][i].split(' Dr. ')
            organizedData.push({
              sessionName: relevantData[0][i],
              room: relevantData[1][i],
              sessionChairs: sessionChairs.map(chair => chair.trim()),
              topics: [[], []]
            })

            let currentChairIndex = 0
            for (let j = 3; j < relevantData.length; j++) {
              if (relevantData[j][i]) {
                if (relevantData[j][i].includes('SESSION CHAIR')) {
                  currentChairIndex = 1
                  continue
                }
                let topic = relevantData[j][i].replace(/ID \d+\s*/, '').trim()
                organizedData[i-1].topics[currentChairIndex].push({
                  time: relevantData[j][0],
                  topic: topic
                })
              }
            }
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
    setSearchTerm(e.target.value)
    if (e.target.value.trim() === '') {
      setFilteredData(data)
    }
  }

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setFilteredData(data)
    } else {
      const filtered = data.filter((item) =>
        item.sessionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.topics.some(topicGroup => 
          topicGroup.some(topic => 
            topic.topic.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      )
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
        <CRow>
          <CCol>
            <CFormInput
              style={{ marginBottom: '15px' }}
              placeholder="Search session"
              value={searchTerm}
              onChange={handleInputChange}
            />
          </CCol>
          <CCol>
            <CButton color="info" variant="outline" style={{ marginLeft: '5px' }} onClick={handleSearch}>
              Search
            </CButton>
          </CCol>
        </CRow>
      </CForm>
      {filteredData.map((column, index) => (
        <CCard key={index} className="mb-4">
          <CCardBody>
            <CTable responsive small bordered>
              <CTableBody>
                <CTableRow>
                  <CTableHeaderCell style={{fontWeight: 'bold'}}>Session Name</CTableHeaderCell>
                  <CTableDataCell>{highlightText(column.sessionName, searchTerm)}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell style={{fontWeight: 'bold'}}>Room</CTableHeaderCell>
                  <CTableDataCell>{column.room}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
            {column.sessionChairs.map((chair, chairIndex) => (
              <CTable key={chairIndex} responsive small bordered className="mt-3">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell colSpan="2" style={{fontWeight: 'bold'}}>Session Chair: {chair}</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {column.topics[chairIndex].map((item, itemIndex) => (
                    <CTableRow key={itemIndex}>
                      <CTableHeaderCell style={{fontWeight: 'bold'}}>{item.time}</CTableHeaderCell>
                      <CTableDataCell>{highlightText(item.topic, searchTerm)}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            ))}
          </CCardBody>
        </CCard>
      ))}
    </CRow>
  )
}

export default ParallelDay1