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
import PlenaryDay3 from './sessions/PlenaryDay3'

const Day3 = () => {
  return (
    <CCard className={'border-info'}>
      <CCardBody>
        <CAccordion alwaysOpen activeItemKey={1}>
          <CAccordionItem  itemKey={1} className={styles.accorditem}>
            <CAccordionHeader>General Schedule</CAccordionHeader>
            <CAccordionBody>
              <PlenaryDay3 />
            </CAccordionBody>
          </CAccordionItem>
        </CAccordion>
      </CCardBody>
    </CCard>
  )
}

export default Day3
