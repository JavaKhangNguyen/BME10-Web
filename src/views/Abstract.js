import React, { useState, useEffect } from 'react'
import {
  CButton,
  CForm,
  CFormInput,
  CCardBody,
  CCol,
  CRow,
  CCard,
  CSpinner,
  CTable,
  CTableRow,
  CTableDataCell,
  CTableBody,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import axios from 'axios'
import styles from '../assets/css/styles.module.css'

const Abstract = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const pageNumbersToShow = 5

  const fields = [
    { key: 'Submission ID', label: 'Submission ID' },
    { key: 'Authors', label: 'Authors' },
    { key: 'Title', label: 'Title' },
    { key: 'Abstract', label: 'Abstract' },
  ]

  const getDataCellStyle = (fieldKey) => {
    switch (fieldKey) {
      case 'Title':
        return { fontWeight: 'bold' }
      case 'Authors':
        return { fontStyle: 'italic' }
      default:
        return {}
    }
  }

  const GOOGLE_SHEET_PROPS = {
    spreadsheetId: '1njDrQL77uCcatspEjHWb0LPft5I--k_x38V3d2AKi7Q',
    apiKey: 'AIzaSyA58ewEtO-S235_GJRgEwo6k9UN0uY2cL0',
    sheetName: 'Submissions',
  }

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
        setFilteredData(formattedData)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setFilteredData(data)
    } else {
      const results = data.filter((item) => {
        if (!isNaN(searchTerm)) {
          return item['Submission ID'].includes(searchTerm)
        } else {
          return (
            item['Authors'].toLowerCase().includes(searchTerm.toLowerCase()) ||
            item['Title'].toLowerCase().includes(searchTerm.toLowerCase()) ||
            item['Abstract'].toLowerCase().includes(searchTerm.toLowerCase())
          )
        }
      })
      setFilteredData(results)
    }
    setCurrentPage(1)
  }

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
    if (e.target.value.trim() === '') {
      setFilteredData(data)
      setCurrentPage(1)
    }
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

  if (isLoading) {
    return (
      <div className={styles.spinner}>
        <CSpinner color="info" />
      </div>
    )
  }

  return (
    <CCol className={styles.abstract}>
      <CRow className={styles.cardbody}>Abstract Book</CRow>
      <CForm>
        <CRow className="w-100">
          <CCol xs={8}>
            <CFormInput
              style={{ marginBottom: '15px' }}
              placeholder="ID, Authors or Title"
              value={searchTerm}
              onChange={handleInputChange}
            />
          </CCol>
          <CCol>
            <CButton color="info" variant="outline" onClick={handleSearch}>
              Search
            </CButton>
          </CCol>
        </CRow>
      </CForm>
      <CRow>
        {filteredData.length > 0 ? (
          currentItems.map((item, index) => (
            <CCard key={index} style={{ marginBottom: '10px' }} className={'border-info'}>
              <CCardBody>
                <CTable responsive align='middle'>
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell style={{ fontWeight: 'bold' }}>
                        {highlightText(`#${item['Submission ID']}  ${item['Title']}`, searchTerm)}
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell style={{ fontStyle: 'italic' }}>
                        {highlightText(item['Authors'], searchTerm)}
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>
                        {highlightText(item['Abstract'], searchTerm)}
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          ))
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
      </CRow>
    </CCol>
  )
}

export default Abstract
