const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const app = express()

app.use(cors())

//get latest technical indicator
app.get('/api/technical/latest', (req, res) => {
  const folderPath = path.join(__dirname, '../technicals')
  const files = fs
    .readdirSync(folderPath)
    .filter(f => f.endsWith('_technical_indicators.json'))
    .sort()
    .reverse()

  if (files.length === 0)
    return res.status(404).json({ error: 'No technical files found' })

  const latest = path.join(folderPath, files[0])
  const json = fs.readFileSync(latest)
  res.setHeader('Content-Type', 'application/json')
  res.send(json)
})

//get only one levels&channels
app.get('/api/l_and_c/:symbol', (req, res) => {
  const symbol = req.params.symbol
  const filePath = path.join(__dirname, '../l_and_c', `${symbol}.json`)

  if (!fs.existsSync(filePath))
    return res.status(404).json({ error: 'Not found' })

  const json = fs.readFileSync(filePath)
  res.setHeader('Content-Type', 'application/json')
  res.send(json)
})

//get all levels & channels
app.get('/api/l_and_c', (req, res) => {
  const folderPath = path.join(__dirname, '../l_and_c')
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.json'))

  const result = files.map(f => {
    const content = fs.readFileSync(path.join(folderPath, f))
    return { [f.replace('.json', '')]: JSON.parse(content) }
  })

  res.json(Object.assign({}, ...result))
})


if (require.main === module) {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}

module.exports = app