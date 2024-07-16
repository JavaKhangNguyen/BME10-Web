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
import { google } from 'calendar-link'
import styles from '../../assets/css/styles.module.css'

const ParallelDay2 = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  const GOOGLE_SHEET_PROPS = {
    spreadsheetId: '1EXn7R4dhv-qqD0uE9U6rVsL3WinxlV77d-vFUfAzoV8',
    apiKey: 'AIzaSyA58ewEtO-S235_GJRgEwo6k9UN0uY2cL0',
    sheetName: 'Oral arrangement',
  }

  const processTopicString = (topic) => {
    if (topic.startsWith('# Invited Speaker')) {
      const match = topic.match(/# Invited Speaker (.+?) \((.+?)\) (.+)/)
      if (match) {
        return `(${match[2]}) - ${match[3]} - ${match[1]}`
      }
    } else {
      const match = topic.match(/ID (\d+) (.+)/)
      if (match) {
        return `(ID ${match[1]}) - ${match[2]}`
      }
    }
    return topic // Return original string if no match
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
        const eventDate = '2024-07-25' 

        for (let i = 0; i < sheetData.length; i++) {
          const rowContent = sheetData[i].join(' ').trim();
          if (rowContent.includes('SESSION NAME') && rowContent.includes('Lab-on-a-chip and Biosensors')) {
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
            const sessionChairs = relevantData.filter(row => row[0] === 'SESSION CHAIR').map(row => row[i].split('\n'))
            organizedData.push({
              sessionName: relevantData[0][i],
              room: relevantData[1][i],
              sessionChairs: sessionChairs,
              topics: sessionChairs.map(() => [])
            })

            let currentChairIndex = 0
            for (let j = 3; j < relevantData.length; j++) {
              if (relevantData[j][i]) {
                if (relevantData[j][0] === 'SESSION CHAIR') {
                  currentChairIndex++;
                  continue;
                }
                const topic = processTopicString(relevantData[j][i])
                organizedData[i-1].topics[currentChairIndex].push({
                  time: relevantData[j][0],
                  topic: topic,
                  date: eventDate
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

  const createGoogleCalendarLink = (date, time, session) => {
    const [startTime, endTime] = time.split(' – ')
    const [startHours, startMinutes] = startTime.split(':')
    const [endHours, endMinutes] = endTime ? endTime.split(':') : [parseInt(startHours) + 1, startMinutes]
    
    const startDateTime = new Date(`${date}T${startHours}:${startMinutes}:00+07:00`)
    const endDateTime = new Date(`${date}T${endHours}:${endMinutes}:00+07:00`)
    
    const event = {
      title: session,
      description: session,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
    }

    return google(event)
  }

  const isSessionOngoing = (date, time) => {
    const [startTime, endTime] = time.split(' – ')
    const [startHours, startMinutes] = startTime.split(':')
    const [endHours, endMinutes] = endTime ? endTime.split(':') : [parseInt(startHours) + 1, startMinutes]
    
    const startDateTime = new Date(`${date}T${startHours}:${startMinutes}:00+07:00`)
    const endDateTime = new Date(`${date}T${endHours}:${endMinutes}:00+07:00`)

    return currentTime >= startDateTime && currentTime <= endDateTime
  }

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

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
          <CCol xs={9}>
            <CFormInput
              style={{ marginBottom: '15px' }}
              placeholder="Search session"
              value={searchTerm}
              onChange={handleInputChange}
            />
          </CCol>
          <CCol xs={3}>
            <CButton color="info" variant='outline' onClick={handleSearch} style={{ marginBottom: '15px' }}>
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
            {column.sessionChairs.map((chairs, chairIndex) => (
              <CTable key={chairIndex} responsive small bordered className="mt-3">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell colSpan="3" style={{fontWeight: 'bold'}}>
                      SESSION CHAIR - {chairs.join(', ')}
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {column.topics[chairIndex].map((item, itemIndex) => (
                    <CTableRow key={itemIndex} color={isSessionOngoing(item.date, item.time) ? 'success' : undefined}>
                      <CTableHeaderCell style={{fontWeight: 'bold'}}>{item.time}</CTableHeaderCell>
                      <CTableDataCell>{highlightText(item.topic, searchTerm)}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="info"
                          variant='outline'
                          size='sm'
                          onClick={() =>
                            window.open(
                              createGoogleCalendarLink(item.date, item.time, item.topic),
                              '_blank',
                            )
                          }
                        >
                          Set Reminder
                        </CButton>
                      </CTableDataCell>
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

export default ParallelDay2