const app = require('./src/app')
require('dotenv').config();
const port = 8081

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})