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
import PosterSession1 from './sessions/PosterSession1'
import PosterSession2 from './sessions/PosterSession2'

const Day2 = () => {
  return (
    <CCard style={{border: 'none'}}>
      <CCardBody className={styles.accordbody}>
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
          <CAccordionItem itemKey={3} className={styles.accorditem}>
            <CAccordionHeader>Poster Session I</CAccordionHeader>
            <CAccordionBody>
              <PosterSession1 />
            </CAccordionBody>
          </CAccordionItem>
          <CAccordionItem itemKey={4} className={styles.accorditem}>
            <CAccordionHeader>Poster Session II</CAccordionHeader>
            <CAccordionBody>
              <PosterSession2 />
            </CAccordionBody>
          </CAccordionItem>
        </CAccordion>
      </CCardBody>
    </CCard>
  )
}

export default Day2
