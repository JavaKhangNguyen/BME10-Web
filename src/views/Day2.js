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
import PlenaryDay2 from './sessions/PlenaryDay2'

const Day2 = () => {
  return (
    <CCard className={'border-info'}>
      <CCardBody>
        <CAccordion>
          <CAccordionItem itemKey={1} className={styles.accorditem}>
            <CAccordionHeader>General Schedule</CAccordionHeader>
            <CAccordionBody>
              <PlenaryDay2 />
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

export default Day2
