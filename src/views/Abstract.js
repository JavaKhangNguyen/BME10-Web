import React from 'react'

import {
  CButton,
  CContainer,
  CForm,
  CFormInput,
  CCardBody,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CTableHeaderCell,
  CRow,
  CCol,
  CCard,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
// import {

// } from '@coreui/icons'

import styles from '../assets/css/styles.module.css'

const Abstract = () => {
  return (
    <>
      <CRow className={styles.cardbody}>Abstract Book</CRow>
      <CForm className={styles.searchbox}>
        <CContainer>
          <CRow>
            <CCol>
              <CFormInput placeholder="Search for papers" />
            </CCol>
            <CCol>
              <CButton color="primary">Search</CButton>
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
              <CTableRow>
                <CTableDataCell>Title 1</CTableDataCell>
                <CTableDataCell>Authors 1</CTableDataCell>
                <CTableDataCell>Abstract 1</CTableDataCell>
                <CTableDataCell>Keywords 1</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Abstract
