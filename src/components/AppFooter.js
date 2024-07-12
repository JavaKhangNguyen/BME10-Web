import React from 'react'
import { CFooter } from '@coreui/react'
import styles from '../assets/css/styles.module.css'

const AppFooter = () => {
  return (
    <CFooter className={styles.footer}>
      <div>
        <a href="https://bme.hcmiu.edu.vn/bme10/" target="_blank" rel="noopener noreferrer">
          BME10
        </a>
        <span className="ms-1">
          &copy; School of Biomedical Engineering International University, Vietnam National
          Universities, HCMC
        </span>
      </div>
      <div className="ms-auto">
        <span className="me-1">
        Designed by Nguyen Phuc Khang - {' '}
          <a href="https://aiotlab.vn/" target="_blank" rel="noopener noreferrer">
            AIoT Lab VN
          </a>
        </span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
