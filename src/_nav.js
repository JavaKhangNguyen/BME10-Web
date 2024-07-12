import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilAudio, cilSpeedometer, cilNotes } from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Abstract',
    to: '/',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Live Session',
    to: '/live',
    icon: <CIcon icon={cilAudio} customClassName="nav-icon" />,
  },
]

export default _nav
