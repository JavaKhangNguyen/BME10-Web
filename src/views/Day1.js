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
import ParallelDay1 from './sessions/ParallelDay1'
import PlenaryDay1 from './sessions/PlenaryDay1'

const Day1 = () => {
  return (
    <CCard>
      <CCardBody>
        <CAccordion>
          <CAccordionItem itemKey={1} className={styles.accorditem}>
            <CAccordionHeader>Plenary Session I</CAccordionHeader>
            <CAccordionBody>
              <PlenaryDay1 />
            </CAccordionBody>
          </CAccordionItem>
          <CAccordionItem itemKey={2} className={styles.accorditem}>
            <CAccordionHeader>Parallel Session I</CAccordionHeader>
            <CAccordionBody>
              <ParallelDay1 />
            </CAccordionBody>
          </CAccordionItem>
        </CAccordion>
      </CCardBody>
    </CCard>
  )
}

export default Day1
