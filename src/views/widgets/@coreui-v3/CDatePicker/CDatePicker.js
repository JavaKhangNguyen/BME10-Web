import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import TextField from '@mui/material/TextField'
import styles from '../../../../components/styles.module.css'
import dayjs from 'dayjs'
import 'dayjs/locale/en-gb'
import { CFormLabel, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react'

const CDatePicker = ({ onChange, label, value, className }) => {
  const [date, setDate] = useState(value || null)
  const [datePickerView, setDatePickerView] = useState('day')

  const handleMenuItemClick = (view) => {
    setDatePickerView(view)
  }

  return (
    <div className={styles.datePickerContainer}>
      <div className={styles.datePickerSection}>
        <CFormLabel className={styles.datePickerLabel}>{label}</CFormLabel>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <div>
            <CDropdown>
              <CDropdownToggle color="light" className="p-3"></CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={() => handleMenuItemClick('day')}>
                  Day/Month/Year
                </CDropdownItem>
                <CDropdownItem onClick={() => handleMenuItemClick('month')}>
                  Month/Year
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </div>
          <DatePicker
            id="customDatePicker"
            className={`${className}`}
            value={date}
            onChange={(newDate) => {
              if (newDate && newDate.isValid()) {
                setDate(newDate)
                onChange(
                  newDate,
                  datePickerView === 'day' ? ['year', 'month', 'day'] : ['year', 'month'],
                )
              }
            }}
            views={datePickerView === 'day' ? ['year', 'month', 'day'] : ['year', 'month']}
            openTo={datePickerView}
            renderInput={(props) => (
              <TextField
                {...props}
                value={date ? date.format('DD/MM/YYYY') : ''}
                onChange={(e) => {
                  const inputValue = e.target.value
                  const parsedDate = dayjs(inputValue, 'DD/MM/YYYY', true)
                  if (parsedDate.isValid()) {
                    setDate(parsedDate)
                    onChange(
                      parsedDate,
                      datePickerView === 'day' ? ['year', 'month', 'day'] : ['year', 'month'],
                    )
                  }
                }}
              />
            )}
          />
        </LocalizationProvider>
      </div>
    </div>
  )
}

CDatePicker.propTypes = {
  value: PropTypes.oneOfType([PropTypes.instanceOf(dayjs), PropTypes.string]),
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
}

export default CDatePicker
