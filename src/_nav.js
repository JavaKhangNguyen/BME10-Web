import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilAudio, cilNotes, cilSend, cilImage} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Abstract Book',
    to: '/',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Live Session',
    to: '/live',
    icon: <CIcon icon={cilAudio} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Session Feedback',
    to: '/feedback',
    icon: <CIcon icon={cilSend} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Photos',
    to: '/photos',
    icon: <CIcon icon={cilImage} customClassName="nav-icon" />,
  },
]

export default _nav
