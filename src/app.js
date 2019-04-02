const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/me.geocode')
const forecast = require('./utils/me.forecast')

const app = express()
const port = process.env.PORT || 3000 //heroku port ||static port

// define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')


//setup for handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to the server
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Melody'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Melody'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Melody'
    })
})

app.get('/weather', (req, res) => {
   
    if (!req.query.address) {
        return res.send ({
            error: 'Please provide address.'
        })
    } 
        geocode (req.query.address, (error,{ latitude, longitude, location} = {}) => {
          if (error) {
            return console.log(error)
          } 
        
          forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
              return console.log(error)
            }
            console.log(location)
            console.log(forecastData)
            res.send({
                location: location,
                forecast: forecastData,
                address: req.query.address
            })
          })
        })
      
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send ({
            error: 'You must provide search items'
        })
    }
    console.log(req.query.search)
    res.send ({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Melody',
        errorMessage: "Help article not found."
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Melody',
        errorMessage: "Page not found."
    })
})

app.listen(port, () =>{
    console.log('Server is up on port ' + port)
})