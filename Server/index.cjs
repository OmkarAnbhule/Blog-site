require('dotenv').config();
const app = require('./app.cjs');
const cors = require('cors')
const { mongodb } = require('./utils/mongoDB.cjs')
const { cloudinaryDB } = require('./utils/cloudinary.utils.cjs')

app.listen(process.env.PORT || 5000, () => {
    console.log('Server is running on port 5000')
})


app.get('/', (req, res) => {
    res.send('Server started');
})


mongodb()
cloudinaryDB()