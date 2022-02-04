const express = require('express')
const app = express()
require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny', {
  skip: (req) => {return req.method === 'POST'}
}))
app.use(cors())

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/info', (request, response) => {
  Person.find({}).then(people => {
    const len = people.length
    const singularPlural = len === 1 ? 'person' : 'people'
    const info = `The Phonebook currently has info for ${len} ${singularPlural}.`
    const date = new Date()
    response.send(`${info} <br><br> ${date}`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    person ? response.json(person) : response.status(404).end()
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))

})
morgan.token('info', (req) => { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :info'))

app.post('/api/persons', (request, response, next) => {
  const data = request.body
  const person = new Person({
    name: data.name,
    number: data.number
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const data = request.body
  const person = {
    name: data.name,
    number: data.number,
  }
  const options = { new: true, runValidators: true }
  Person.findByIdAndUpdate(request.params.id, person, options)
    .then(updatedPerson => {
      response.json(updatedPerson)
    }).catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError'){
    return response.status(400).send( { error: error.message })
  }
  if (error.code === 11000){
    return response.status(400).send( { error: 'name must be unique' })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
