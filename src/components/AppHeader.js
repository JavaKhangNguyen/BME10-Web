import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CContainer, CImage, CHeader, CHeaderToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu } from '@coreui/icons'

import styles from '../assets/css/styles.module.css'
import banner from '../assets/images/BME10 Banner.png'

const AppHeader = () => {
  const headerRef = useRef()

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  return (
    <CHeader position="sticky" className={styles.headercont} ref={headerRef}>
      <CContainer fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CImage src={banner} className={styles.banner}/>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
