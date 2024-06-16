const express = require('express');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors')
const app = express();

//*****middleare********
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
};

app.use(cors(corsOptions));

//*****import routes********
const userRoutes = require('./routes/user.route.cjs')
const blogRoutes = require('./routes/blog.route.cjs')



//*****routes********
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/blog', blogRoutes)


module.exports = app;