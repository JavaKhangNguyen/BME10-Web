import React, { useState } from 'react'
import {
  CRow,
  CForm,
  CContainer,
  CCol,
  CFormInput,
  CButton,
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import styles from '../assets/css/styles.module.css'

const fakeData = [
  {
    title: 'Title 1',
    authors: 'Authors 1',
    abstract: 'Abstract 1',
    keywords: 'Keywords 1',
  },
  {
    title: 'Title 2',
    authors: 'Authors 2',
    abstract: 'Abstract 2',
    keywords: 'Keywords 2',
  },
  {
    title: 'Title 3',
    authors: 'Authors 3',
    abstract: 'Abstract 3',
    keywords: 'Keywords 3',
  },
]

const App = () => {
  const [query, setQuery] = useState('')
  const [filteredData, setFilteredData] = useState(fakeData)

  const handleSearch = (e) => {
    e.preventDefault()
    const result = fakeData.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.authors.toLowerCase().includes(query.toLowerCase()) ||
        item.abstract.toLowerCase().includes(query.toLowerCase()) ||
        item.keywords.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredData(result)
  }

  return (
    <>
      <CRow className={styles.cardbody}>Abstract Book</CRow>
      <CForm className={styles.searchbox} onSubmit={handleSearch}>
        <CContainer>
          <CRow>
            <CCol>
              <CFormInput
                placeholder="Search for papers"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </CCol>
            <CCol>
              <CButton color="primary" type="submit">
                Search
              </CButton>
            </CCol>
          </CRow>
        </CContainer>
      </CForm>
      <CCard>
        <CCardBody>
          <CTable striped>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Abstract Title</CTableHeaderCell>
                <CTableHeaderCell>Authors</CTableHeaderCell>
                <CTableHeaderCell>Abstract</CTableHeaderCell>
                <CTableHeaderCell>Keywords</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredData.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{item.title}</CTableDataCell>
                  <CTableDataCell>{item.authors}</CTableDataCell>
                  <CTableDataCell>{item.abstract}</CTableDataCell>
                  <CTableDataCell>{item.keywords}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </>
  )
}

export default App
