const express = require('express')
const morgan = require('morgan')
const app = express()

const cors = require('cors')


const PORT = process.env.PORT || 3030;

app.use(cors())
app.use(express.json())

let data = [
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

app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${data.length} people</p><p>${new Date()}</p>`);

})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const ret = data.find(item => item.id === id)
    if(ret)
        response.send(ret)
    else
        response.status(404).end()
})
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    data = data.filter(item => item.id !== id)
    response.status(204).end()
})

app.get('/api/persons', (request, response) => {
  response.json(data)
})
app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body)
  if (!body.name) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const newPerson = {
    "name": body.name,
    "number": body.number,
    "id": Math.floor(Math.random() * 100)
  }
  data = data.concat(newPerson)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})