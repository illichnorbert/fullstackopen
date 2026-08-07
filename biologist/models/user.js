const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
      //damit ich später echte Blogs statt nur IDs bekomme
    }
  ],
})

userSchema.set('toJSON', {
    //falls jemand spter toJSON auf diesem Objekt aufruft, führe diese
    //Transformation aus
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)
//ich exportiere aus diesem File die Klasse User die nach userSchema aufgebaut ist