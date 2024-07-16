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


const PlenaryDay3 = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [currentTime, setCurrentTime] = useState(new Date())
  const itemsPerPage = 5
  const pageNumbersToShow = 5

  const fields = [
    { key: 'Time', label: 'Time' },
    { key: 'Session', label: 'Session' },
    { key: 'Action', label: '' }
  ]

  const GOOGLE_SHEET_PROPS = {
    spreadsheetId: '1EXn7R4dhv-qqD0uE9U6rVsL3WinxlV77d-vFUfAzoV8',
    apiKey: 'AIzaSyA58ewEtO-S235_GJRgEwo6k9UN0uY2cL0',
    sheetName: 'Oral arrangement',
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_PROPS.spreadsheetId}/values/${GOOGLE_SHEET_PROPS.sheetName}?key=${GOOGLE_SHEET_PROPS.apiKey}`
        )

        const sheetData = response.data.values
        let startIndex = -1
        let endIndex = -1

        // Find the start index
        for (let i = 0; i < sheetData.length; i++) {
          const rowContent = sheetData[i].join(' ').trim()
          if (rowContent.includes('PLENARY SESSION III')) {
            startIndex = i + 1
            break
          }
        }

        // Find the end index (last non-empty row)
        if (startIndex !== -1) {
          for (let i = sheetData.length - 1; i > startIndex; i--) {
            if (sheetData[i].some(cell => cell.trim() !== '')) {
              endIndex = i + 1 // Include this non-empty row
              break
            }
          }
        }

        if (startIndex !== -1 && endIndex !== -1) {
          const relevantData = sheetData.slice(startIndex, endIndex)
          const formattedData = relevantData.map((row) => ({
            Time: row[0] || '',
            Session: row.slice(1).join(' ').trim() || '',
            Date: '2024-07-27',
          }))

          setData(formattedData)
          setFilteredData(formattedData)
        }

        setIsLoading(false)
      } 
      catch (error) {
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
        item.Session.toLowerCase().includes(searchTerm.toLowerCase())
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
    <>
      <CForm>
        <CRow className="w-100">
          <CCol xs={12} sm={10}>
            <CFormInput
              style={{ marginBottom: '15px' }}
              placeholder="Search session"
              value={searchTerm}
              onChange={handleInputChange}
            />
          </CCol>
          <CCol xs={12} sm={2}>
            <CButton color="info" variant="outline" style={{ marginLeft: '5px' }} onClick={handleSearch}>
              Search
            </CButton>
          </CCol>
        </CRow>
      </CForm>
      {filteredData.length > 0 ? (
        <CTable responsive>
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
                    {field.key === 'Session'
                      ? (highlightText(item[field.key], searchTerm))
                      : field.key === 'Action' ? (
                        <CButton
                          color="info"
                          variant="outline"
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
        <CPagination
          aria-label="Page navigation example"
          align="center"
          className={styles.pagenum}
        >
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
    </>
  )
}

export default PlenaryDay3
