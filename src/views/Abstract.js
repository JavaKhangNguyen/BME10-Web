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

import styles from '../assets/css/styles.module.css'
import CDataTable from '../views/widgets/@coreui-v3/CDataTables/CDataTable'

const Abstract = () => {
  const fields = [
    { key: 'Submission ID', label: 'Submission ID' },
    { key: 'Authors', label: 'Authors' },
    { key: 'Title', label: 'Title' },
    { key: 'Abstract', label: 'Abstract' },
  ]

  return (
    <>
      <CRow className={styles.cardbody}>Abstract Book</CRow>
      <CCard>
        <CCardBody>
          <CDataTable
            fields={fields}
            tableFilter
            hover
            sorter
            outlined
            border
            responsive
            itemsPerPageSelect
            itemsPerPage={5} // Number of items per page
            pagination
          />
        </CCardBody>
      </CCard>
    </>
  )
}

export default Abstract
