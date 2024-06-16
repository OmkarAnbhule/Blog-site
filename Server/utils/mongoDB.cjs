exports.mongodb = () => {
    const mongoose = require('mongoose')

    try {
        mongoose.connect(process.env.DB_URL).then(()=>{
            console.log('connection established to db')
        })
    }
    catch (e) {
        console.log('error connecting to db')
    }
}