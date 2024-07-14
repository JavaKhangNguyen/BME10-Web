import React from 'react'
import {
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CCard,
  CCardBody,
} from '@coreui/react'

import styles from '../assets/css/styles.module.css'
import ParallelDay3 from './sessions/ParallelDay3'
import PlenaryDay3 from './sessions/PlenaryDay3'

const Day3 = () => {
  return (
    <CCard>
      <CCardBody>
        <CAccordion>
          <CAccordionItem itemKey={1} className={styles.accorditem}>
            <CAccordionHeader>Plenary Session III</CAccordionHeader>
            <CAccordionBody>
              <PlenaryDay3 />
            </CAccordionBody>
          </CAccordionItem>
          <CAccordionItem itemKey={2} className={styles.accorditem}>
            <CAccordionHeader>Parallel Session III</CAccordionHeader>
            <CAccordionBody>
              <ParallelDay3 />
            </CAccordionBody>
          </CAccordionItem>
        </CAccordion>
      </CCardBody>
    </CCard>
  )
}

export default Day3
