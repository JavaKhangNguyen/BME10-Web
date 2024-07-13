const express = require('express')
const { google } = require('googleapis')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Welcome to my server')
})

app.get('/data', async (req, res) => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFilename: 'credentials.json',
      scopes: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    })

    const googleSheets = google.sheets({ version: 'v4', auth })

    const spreadsheetId = '1EXn7R4dhv-qqD0uE9U6rVsL3WinxlV77d-vFUfAzoV8'

    // ----- lấy toàn bộ data trong file sheet -----
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Oral arrangement!A1:Z100000',
    })
    const values = response.data.values
    // ---------------------------------------------

    // ----- lấy các cell mở đầu Session trong file sheet -----
    if (values.length) {
      let dayLocations = []
      let sessionLocations = []

      values.forEach((row, rowIndex) => {
        row.forEach((cell, columnIndex) => {
          if (cell.includes('Day')) {
            dayLocations.push(`${String.fromCharCode(65 + columnIndex)}${rowIndex + 1}`)
          } else if (
            cell.includes('PLENARY SESSION') ||
            cell.includes('PARALLEL SESSION') ||
            cell.includes('Poster presentation Session')
          ) {
            sessionLocations.push(`${String.fromCharCode(65 + columnIndex)}${rowIndex + 1}`)
          }
        })
      })
      // ---------------------------------------------

      // ----- lấy các Day và lấy các Session nằm trng Day đó trong file sheet -----
      if (dayLocations.length > 0 && sessionLocations.length > 0) {
        let sessionsByDay = {}

        for (let dayIndex = 0; dayIndex < dayLocations.length; dayIndex++) {
          const dayLocation = dayLocations[dayIndex]
          const startRow = parseInt(dayLocation.replace(/[^\d]/g, ''), 10)
          const endRow =
            dayIndex < dayLocations.length - 1
              ? parseInt(dayLocations[dayIndex + 1].replace(/[^\d]/g, ''), 10) - 1
              : values.length

          let sessions = []

          const ranges = sessionLocations.map((location, index) => {
            const start = `A${parseInt(location.replace(/[^\d]/g, ''), 10)}`
            const end = `Z${index < sessionLocations.length - 1 ? parseInt(sessionLocations[index + 1].replace(/[^\d]/g, ''), 10) - 1 : '100000'}`
            return `${start}:${end}`
          })

          const promises = ranges.map(async (range) => {
            try {
              const response = await googleSheets.spreadsheets.values.get({
                spreadsheetId,
                range: `Oral arrangement!${range}`,
              })

              return response.data.values
            } catch (error) {
              console.error('Error fetching session data:', error)
              throw error
            }
          })

          const responses = await Promise.all(promises)
          // ---------------------------------------------

          // ----- chia thành 2 dạng Session chính (plenary và parallel) -----
          const plenarySessions = {}
          const parallelSessions = {}

          responses.forEach((session) => {
            const sessionTitlePlenary = session[0]?.[0]?.trim() || ''
            const sessionTitleParallel = session[0]?.[1]?.trim() || ''

            const sessionNames = session[1]?.slice(1).map((cell) => cell?.trim() || '') || []
            const sessionRooms = session[2]?.slice(1).map((cell) => cell?.trim() || '') || []
            const sessionChairs = session[3]?.slice(1).map((cell) => cell?.trim() || '') || []

            const items = session
              .slice(4)
              .map((item) => ({
                time: item[0]?.trim() || '',
                description: sessionTitleParallel.includes('PARALLEL SESSION')
                  ? item
                      .slice(1)
                      .map((desc, index) => ({
                        content: desc?.trim() || '',
                        sessionName: sessionNames[index] || '',
                        sessionRoom: sessionRooms[index] || '',
                        sessionChair: sessionChairs[index] || '',
                      }))
                      .filter((desc) => desc.content)
                  : item
                      .slice(1)
                      .map((desc) => ({
                        content: desc?.trim() || '',
                      }))
                      .filter((desc) => desc.content),
              }))
              .filter((item) => item.time && item.description.length)

            if (sessionTitlePlenary.includes('PLENARY SESSION')) {
              plenarySessions[sessionTitlePlenary] = items
            } else if (sessionTitleParallel.includes('PARALLEL SESSION')) {
              parallelSessions[sessionTitleParallel] = items
            }
          })

          sessionLocations.forEach((sessionLocation) => {
            const sessionRow = parseInt(sessionLocation.replace(/[^\d]/g, ''), 10)

            if (sessionRow >= startRow && sessionRow <= endRow) {
              const columnIndex = sessionLocation.charCodeAt(0) - 65
              const sessionTitle = values[sessionRow - 1]?.[columnIndex]?.trim() || ''
              const time = values[sessionRow - 1]?.[0]?.trim() || ''
              const description = sessionTitle.includes('PLENARY SESSION')
                ? plenarySessions[sessionTitle]
                : parallelSessions[sessionTitle]

              sessions.push({
                title: sessionTitle,
                time,
                description,
              })
            }
          })
          // ---------------------------------------------

          sessionsByDay[`Day ${dayIndex + 1}`] = sessions
        }

        const jsonData = {
          sessionsByDay,
        }

        res.json({ success: true, data: jsonData })
      } else {
        res
          .status(404)
          .json({ success: false, message: 'No "Day" or session data found in the spreadsheet.' })
      }
    } else {
      res.status(404).json({ success: false, message: 'No data found in the spreadsheet.' })
    }
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, message: 'Error fetching data from Google Sheets.' })
  }
})

const PORT = process.env.PORT || 1337
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
