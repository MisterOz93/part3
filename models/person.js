const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log(`Connecting to ${url}`)
mongoose.connect(url).then(() => {
  console.log('Connected to MongoDB')
}).catch((error) => {
  console.log(`Error connecting to MongoDB: ${error.message}`)
})

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    unique: true,
  },
  number: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function(num) {
        if (num.includes('-')){
          const arr = num.split('-')
          console.log (arr[0], arr[1])
          return arr[0].length > 1 && arr.length === 2
        }
        return true
      },
      message: 'Number can only have one \'-\' with at least 2 digits before it, and at least 1 after.'
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)