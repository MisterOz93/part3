const express = require('express');
const app = express();
app.use(express.json())

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]



app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    let singularPlural = persons.length === 1 ? "person" : "people";
    const info = `Phonebook has info for ${persons.length} ${singularPlural}`
    const date = new Date(); 
    response.send(`<p> ${info} </p> ${date}`)
})

app.get('/api/persons/:id', (request, response) => {
    const person = persons.find(p => p.id === Number(request.params.id));
    person ? response.json(person) : response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const originalLength = persons.length;
    persons = persons.filter(person => person.id !== Number(request.params.id))
    persons.length === originalLength ? response.status(404).end() : response.status(204).end()

})

app.post('/api/persons', (request, response) => {
    const data = request.body; 
    if (!data.name || !data.number) {
        return response.status(400).json({
            error: "Entry is missing a name and/or a number."
        })
    }
  else {
      const person = {
          id: Math.floor(Math.random() * (10000000 - 1) + 1),
          name: data.name,
          number: data.number
      }
      persons = persons.concat(person)
      response.json(person)
  }
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})