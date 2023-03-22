const express = require('express')
const app = express()

const mongoose = require('mongoose')
require('dotenv').config()

// const MONGO_URI="mongodb+srv://testuser:testpassword@cluster0.guggvrq.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
})
    .then(() => console.log('MongoDB connection established!'))
    .catch((error) => console.error('MongoDB connection error:', error))

app.listen(process.env.PORT, () => console.log(`Listening at port ${process.env.PORT}`))

app.use(express.static('public'))
app.use(express.json({limit: '1mb'}))

app.get('./', (request, response) => {
    console.log(request.body)
})

app.post('/api', (request, response) => {
    console.log('I got a request!')
    console.log(request.body)
    const data = request.body
    response.json({
        status: 'success',
        latitude: data.lat,
        longitude: data.long
    })

})