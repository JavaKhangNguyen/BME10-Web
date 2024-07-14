import React, { useState, useEffect } from 'react'
import {
  CButton,
  CForm,
  CFormInput,
  CRow,
  CCol,
  CSpinner,
  CTable,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
  CPagination,
  CPaginationItem
} from '@coreui/react'
import axios from 'axios'
import styles from '../../assets/css/styles.module.css'

const ParallelDay1 = () => {
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

  const GOOGLE_SHEET_PROPS = {
    spreadsheetId: '1HYVlaBpzW0dSE7eHJhIRr_CxLuG_htfM3yBMCKOJRWc',
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
    <>
      <CForm>
        <CRow>
          <CCol>
            <CFormInput
              style={{ marginBottom: '15px' }}
              placeholder="Plenary session"
              value={searchTerm}
            //   onChange={handleInputChange}
            />
          </CCol>
          <CCol>
            <CButton
              color="info"
              variant="outline"
              style={{ marginLeft: '5px' }}
            //   onClick={handleSearch}
            >
              Search
            </CButton>
          </CCol>
        </CRow>
      </CForm>
      <CTable responsive>
        <CTableBody>
          {fields.map((field) => (
            <CTableRow key={field.key}>
              <CTableHeaderCell scope="row">{field.label}</CTableHeaderCell>
              {/* <CTableDataCell>{highlightText(item[field.key], searchTerm)}</CTableDataCell> */}
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
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

export default ParallelDay1
