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
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import axios from 'axios'
import styles from '../../assets/css/styles.module.css'
import { google } from 'calendar-link'

const PlenaryDay1 = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [currentTime, setCurrentTime] = useState(new Date())
  const itemsPerPage = 20
  const pageNumbersToShow = 5

  const fields = [
    { key: 'Time', label: 'Time' },
    { key: 'Session', label: 'Session' },
    { key: 'Action', label: '' }
  ]

  const GOOGLE_SHEET_PROPS = {
    spreadsheetId: '1HYVlaBpzW0dSE7eHJhIRr_CxLuG_htfM3yBMCKOJRWc',
    apiKey: '[API_KEY_HERE]',
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
        let endIndex1 = -1
        let endIndex2 = -1
        let eventDate = null

        // Find the start and end indices
        for (let i = 0; i < sheetData.length; i++) {
          const rowContent = sheetData[i].join(' ').trim()
          if (rowContent.includes('PLENARY SESSION I')) {
            startIndex = i + 1
          } else if (
            startIndex !== -1 &&
            endIndex1 === -1 &&
            rowContent.includes('PARALLEL SESSION I')
          ) {
            endIndex1 = i
          } else if (endIndex1 !== -1 && rowContent.includes('Day 2: Friday, 26 July, 2024')) {
            endIndex2 = i
            break
          }
          if (rowContent.includes('Day 1: Thursday, 25 July, 2024')) {
            eventDate = '2024-07-25'
          }
        }

        const formattedData = []

        // First search
        if (startIndex !== -1 && endIndex1 !== -1) {
          const relevantData1 = sheetData.slice(startIndex, endIndex1)
          relevantData1.forEach((row) => {
            formattedData.push({
              Time: row[0] || '',
              Session: row.slice(1).join(' ').trim() || '',
              Date: eventDate || '',
            })
          })
        }

        // Second search
        if (endIndex1 !== -1 && endIndex2 !== -1) {
          const relevantData2 = sheetData.slice(endIndex1, endIndex2)
          relevantData2.forEach((row) => {
            if (
              ['COFFEE BREAK - POSTER VIEWING', 'GALA DINNER', 'PARALLEL SESSION I'].some((text) =>
                row.join(' ').includes(text),
              )
            ) {
              formattedData.push({
                Time: row[0] || '',
                Session: row.slice(1).join(' ').trim() || '',
                Date: eventDate || '',
              })
            }
          })
        }

        setData(formattedData)
        setFilteredData(formattedData)
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
      setCurrentPage(1)
    }
  }

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setFilteredData(data)
    } else {
      const filtered = data.filter((item) =>
        item.Session.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredData(filtered)
    }
    setCurrentPage(1)
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const getPaginationGroup = () => {
    let start = Math.floor((currentPage - 1) / pageNumbersToShow) * pageNumbersToShow
    return new Array(pageNumbersToShow)
      .fill()
      .map((_, idx) => start + idx + 1)
      .filter((page) => page <= totalPages)
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
              onKeyDown={(e) => {
                if (e.key === 'Enter'){
                  e.preventDefault()
                  handleSearch()
                }
              }}
            />
          </CCol>
          <CCol>
            <CButton
              color="info"
              variant="outline"
              style={{ marginLeft: '5px' }}
              onClick={handleSearch}
            >
              Search
            </CButton>
          </CCol>
        </CRow>
      </CForm>
      {filteredData.length > 0 ? (
        <CTable responsive align='middle'>
          <CTableHead>
            <CTableRow>
              {fields.map((field) => (
                <CTableHeaderCell key={field.key}>{field.label}</CTableHeaderCell>
              ))}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentItems.map((item, index) => (
              <CTableRow key={index} color={isSessionOngoing(item.Date, item.Time) ? 'success' : undefined}>
                {fields.map((field) => (
                  <CTableDataCell key={field.key}>
                    {field.key === 'Session' ? (
                      highlightText(item[field.key], searchTerm)
                    ) : field.key === 'Action' ? (
                      <CButton
                        color="info"
                        variant='outline'
                        onClick={() =>
                          window.open(
                            createGoogleCalendarLink(item.Date, item.Time, item.Session),
                            '_blank',
                          )
                        }
                      >
                        Set Reminder
                      </CButton>
                    ) : (
                      item[field.key]
                    )}
                  </CTableDataCell>
                ))}
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      ) : (
        <CCard className={styles.cardbody}>
          <CCardBody>No results</CCardBody>
        </CCard>
      )}
      {filteredData.length > itemsPerPage && (
        <CPagination aria-label="Page navigation example" align="center" className={styles.pagenum}>
          <CPaginationItem
            aria-label="Previous"
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <span aria-hidden="true">&laquo;</span>
          </CPaginationItem>

          {getPaginationGroup().map((item, index) => (
            <CPaginationItem
              key={index}
              active={currentPage === item}
              onClick={() => paginate(item)}
            >
              {item}
            </CPaginationItem>
          ))}

          <CPaginationItem
            aria-label="Next"
            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <span aria-hidden="true">&raquo;</span>
          </CPaginationItem>
        </CPagination>
      )}
    </CRow>
  )
}

export default PlenaryDay1
