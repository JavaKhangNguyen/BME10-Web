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
    <>
    <CImage position="fixed" src={banner} className={styles.banner}/>
    <CHeader position="sticky" className={styles.headercont} ref={headerRef}>
      <CContainer fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ position: 'fixed', top: 0, marginInlineStart: '-20px' }}
        >
          <CIcon icon={cilMenu} size="3xl" />
        </CHeaderToggler>
      </CContainer>
    </CHeader>
    </>
  )
}

export default AppHeader
