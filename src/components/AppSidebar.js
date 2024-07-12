import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CSidebar,
  CImage,   
  CSidebarHeader,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

//import logo
import bme from '../assets/images/BME.png'

// sidebar nav config
import navigation from '../_nav'

//custom styling
import styles from '../assets/css/styles.module.css'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className={styles.sidenav}
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className={styles.sidebarheader}>
        <CImage src={bme} className={styles.sidelogo}/>
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
