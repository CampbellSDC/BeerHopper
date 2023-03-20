const express = require('express')
const app = express()
const PORT = 3000
const mongoose = require('mongoose')



app.listen(PORT, () => console.log(`Listening at port ${PORT}`))

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