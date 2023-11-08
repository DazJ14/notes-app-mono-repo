const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')
const userExtractor = require('../middleware/userExtractor')

notesRouter.get('/', async (request, response) => {
    // Note.find({}).then(notes => {
    //     response.json(notes)
    // })
    
    const notes = await Note.find({}).populate('user', {
        username: 1,
        name: 1,
    })
    response.json(notes)
})

notesRouter.get('/:id', (request, response, next) => {
    const { id } = request.params

    Note.findById(id).then(note => {
        if (note) {
            return response.json(note)
        } else {
            response.status(404).end()
        }
    }).catch(err => {
        next(err)
    })
})

notesRouter.post('/', userExtractor, async (request, response, next) => {
    const { 
        content, 
        important = false,
    } = request.body;

    //sacar userId de request
    const { userId } = request

    const user = await User.findById(userId)
    
    if (!content) {
        return response.status(400).json({
            error: 'required "content" field is missing'
        })
    }

    const newNote = new Note({
        content,
        created_at: new Date,
        important,
        user: user._id
    })

    // newNote.save().then(savedNote => {
    //     response.json(savedNote)
    // }).catch(error => next(error))

    try {
        const savedNote = await newNote.save()
        user.notes = user.notes.concat(savedNote._id)
        await user.save()
        response.json(savedNote)
    } catch (error) {
        next(error)
    }
})

notesRouter.delete('/:id', userExtractor, (request, response, next) => {
    const { id } = request.params

    Note.findByIdAndDelete(id)
        .then(() => response.status(204).end())
        .catch(error => next(error))
})

notesRouter.put('/:id', userExtractor, (request, response, next) => {
    const { id } = request.params
    const noteUpdated = {
        content: request.body.content,
        important: request.body.important
    }

    Note.findByIdAndUpdate(id, noteUpdated, { new: true })
        .then(result => {
            response.json(result)
        })
        .catch(error => {
            next(error)
        })
})

module.exports = notesRouter