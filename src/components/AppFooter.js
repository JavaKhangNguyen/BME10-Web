import React from 'react'
import { CFooter, CImage } from '@coreui/react'
import styles from '../assets/css/styles.module.css'
import aiot from '../assets/images/AIoT.png'

const AppFooter = () => {
  return (
    <CFooter className={styles.footer}>
      <div>
        BME10 &copy; School of Biomedical Engineering International University, Vietnam National
        Universities, HCMC
        <div style={{marginTop: "10px"}}>
        <span className="me-1">
        <CImage fluid src={aiot} className={styles.footerlogo} />
          Designed by Nguyen Phuc Khang - {' '}
          <a className={styles.hreflink} href="https://aiotlab.vn/" target="_blank" rel="noopener noreferrer">
            AIoT Lab VN
          </a>
        </span>
        </div>
      </div>
      
    </CFooter>

  )
}

export default React.memo(AppFooter)
