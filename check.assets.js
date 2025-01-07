const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'src/assets/images/sekude.png')

if (!fs.existsSync(filePath)) {
  console.error('Error: sekude not found >:(')
  process.exit(1)
} else {
  console.log('sekude found :). Build can proceed.')
}
