
import fs from 'fs'
import path from 'path'

const filePath = path.resolve('.', `./public/example.pdf`)
const imageBuffer = fs.readFileSync(filePath)

export default function(req, res) {
  res.setHeader('Content-Type', 'application/pdf')
  res.send(imageBuffer)
}