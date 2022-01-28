const express = require('express');
const app = express();
require('dotenv').config()
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny', {
    skip: (req, res) => {return req.method === 'POST'}
})); 
app.use(cors())

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get('/info', (request, response) => {
    Person.find({}).then(people => {
      const len = people.length
      let singularPlural = len === 1 ? "person" : "people";
      const info = `Phonebook has info for ${len} ${singularPlural}`
      const date = new Date(); 
      response.send(`<p> ${info} </p> ${date}`)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
    person ? response.json(person) : response.status(404).end()
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))

})
morgan.token('info', (req, res) => { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :info'))

app.post('/api/persons', (request, response) => {
    const data = request.body; 
    if (!data.name || !data.number) {
        return response.status(400).json({
            error: "Entry is missing a name and/or a number."
        })
    }
   /* re-add this in later exercise  
    else if (persons.map(person => person.name).includes(data.name)){
        return response.status(400).json({
            error: "Name must be unique."
        })
    } */
  else {
      const person = new Person({
          name: data.name,
          number: data.number
      })
      person.save().then(savedPerson => {
          response.json(savedPerson)
      })
    }
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id'})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
