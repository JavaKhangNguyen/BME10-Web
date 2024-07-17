import React, { useState, useEffect } from 'react'
import { CCarousel, CCarouselItem, CImage, CSpinner, CRow } from '@coreui/react'
import styles from '../assets/css/styles.module.css'

const Photos = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/publicalbum@latest/embed-ui.min.js'
    script.async = true
    script.onload = () => setIsLoading(false)
    document.body.appendChild(script)

    // Clean up function to remove script
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  if (isLoading) {
    return (
      <div className={styles.spinner}>
        <CSpinner color="info" />
      </div>
    )
  }

  return (
    <>
      <CRow className={styles.cardbody}>Photos</CRow>
      <CCarousel controls indicators transition="crossfade">
        <CCarouselItem>
          <CImage src="https://lh3.googleusercontent.com/pw/AP1GczPcK8wvovZ25PRiw8DCPS5crhNQghyW5z2XkJonnNmAl61cESW9sDSvMGYTHv64d1a9Wks0OdSbOMWo8Y2zzceIyvvkwwjWs5sC2wBh9b47bLYNMUs2=w1280-h960"></CImage>
        </CCarouselItem>
        <CCarouselItem>
          <CImage src="https://lh3.googleusercontent.com/pw/AP1GczPSXrF0_xdBkpzVDRyiJ8l9diu8IcmbtraJfoQoPZKPP--WJmgQecEA8En7sqowQC3jQuiNCDm7ecIeXfRwru2TlyaeIzudi13LvQA_zMlxFZfdj8Sy=w1280-h960"></CImage>
        </CCarouselItem>
      </CCarousel>
    </>
  )
}

export default Photos
