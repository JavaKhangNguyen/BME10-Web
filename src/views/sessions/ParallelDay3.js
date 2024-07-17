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

const ParallelDay3 = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  const GOOGLE_SHEET_PROPS = {
    spreadsheetId: '1HYVlaBpzW0dSE7eHJhIRr_CxLuG_htfM3yBMCKOJRWc',
    apiKey: 'AIzaSyA58ewEtO-S235_GJRgEwo6k9UN0uY2cL0',
    sheetName: 'Oral arrangement',
  }

  const processTopicString = (topic) => {
    if (topic.startsWith('# Invited Speaker ')) {
      const parts = topic.split('\n');
      if (parts.length === 2) {
        const info = parts[1].trim();
        const regex = /(.*?)\s*\((ID \d+)\)\s*(.*)/;
        const matches = info.match(regex);
  
        if (matches && matches.length === 4) {
          const professorDetails = matches[1].trim();
          const id = matches[2].trim();
          const title = matches[3].trim();
          return `${title} (${id}) - ${professorDetails}`;
        }
      }
    } else {
      const lines = topic.split('\n');
      if (lines.length === 2 && lines[0].startsWith('ID ')) {
        const id = lines[0].trim();
        const title = lines[1].trim();
        return `${title} (${id})`
      } else {
        const idIndex = topic.lastIndexOf("(ID");
        if (idIndex !== -1) {
          let idPart = topic.substring(idIndex).trim();
          let modifiedString = topic.substring(0, idIndex).trim();
          return `${modifiedString} - ${idPart}`
        }
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
        const eventDate = '2024-07-26' 

        for (let i = 0; i < sheetData.length; i++) {
          const rowContent = sheetData[i].join(' ').trim();
          if (rowContent.includes('SESSION NAME') && rowContent.includes('Imaging and Modeling in Biomechanics')) {
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
      const filtered = data.map(item => {
        const matchingChairs = item.sessionChairs.filter(chairs => 
          chairs.some(chair => chair.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        
        const matchingTopics = item.topics.map(topicGroup => 
          topicGroup.filter(topic => 
            topic.topic.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )

        if (item.sessionName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            matchingChairs.length > 0 || 
            matchingTopics.some(group => group.length > 0)) {
          return {
            ...item,
            sessionChairs: matchingChairs.length > 0 ? matchingChairs : item.sessionChairs,
            topics: matchingTopics
          }
        }
        return null
      }).filter(Boolean)

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
          <CCol xs={7}>
            <CFormInput
              style={{ marginBottom: '15px' }}
              placeholder="Search session"
              value={searchTerm}
              onChange={handleInputChange}
            />
          </CCol>
          <CCol>
            <CButton color="info" variant='outline' onClick={handleSearch} style={{ marginBottom: '15px' }}>
              Search
            </CButton>
          </CCol>
        </CRow>
      </CForm>
      {filteredData.map((column, index) => (
        <CCard key={index} className="mb-4">
          <CCardBody>
            <CTable responsive bordered align='middle'>
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
              column.topics[chairIndex] && column.topics[chairIndex].length > 0 && (
                <CTable key={chairIndex} responsive bordered align='middle' className="mt-3">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell colSpan="3" style={{fontWeight: 'bold'}}>
                        SESSION CHAIR - {highlightText(chairs.join(', '), searchTerm)}
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
              )
            ))}
          </CCardBody>
        </CCard>
      ))}
    </CRow>
  )
}

export default ParallelDay3