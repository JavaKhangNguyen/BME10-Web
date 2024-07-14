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
import ParallelDay2 from './sessions/ParallelDay2'
import PlenaryDay2 from './sessions/PlenaryDay2'

const Day2 = () => {
  return (
    <CCard>
      <CCardBody>
        <CAccordion>
          <CAccordionItem itemKey={1} className={styles.accorditem}>
            <CAccordionHeader>Plenary Session II</CAccordionHeader>
            <CAccordionBody>
              <PlenaryDay2 />
            </CAccordionBody>
          </CAccordionItem>
          <CAccordionItem itemKey={2} className={styles.accorditem}>
            <CAccordionHeader>Parallel Session II</CAccordionHeader>
            <CAccordionBody>
              <ParallelDay2 />
            </CAccordionBody>
          </CAccordionItem>
        </CAccordion>
      </CCardBody>
    </CCard>
  )
}

export default Day2
