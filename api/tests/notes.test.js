const mongoose = require('mongoose')

const { server } = require('../index')
const Note = require('../models/Note')
const { 
    api, 
    initialNotes,
    getAllContentFromNotes
} = require('./helpers')

beforeEach(async () => {
    await Note.deleteMany({})

    for (const note of initialNotes) {
        const noteObject = new Note(note)
        await noteObject.save()
    }
})

describe('GET all notes', () => {
    test('notes are returned as json', async () => {
        await api
          .get('/api/notes')
          .expect(200)
          .expect('Content-Type', /application\/json/)
    })
    
    test('there are two notes', async () => {
        const response = await api.get('/api/notes')
        expect(response.body).toHaveLength(initialNotes.length)
    })
    
    test('first note is about fullstack', async () => {
        const response = await api.get('/api/notes')
    
        const contents = response.body.map(note => note.content)
    
        expect(contents).toContain('Aprendiendo fullstack')
    })
    
    test('a valid note can be added', async () => {
        const newNote = {
            content: 'proximamente async/await',
            important: true
        }
    
        await api
            .post('/api/notes')
            .send(newNote)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        const { contents, response } = await getAllContentFromNotes()
    
        expect(response.body).toHaveLength(initialNotes.length + 1)
        expect(contents).toContain(newNote.content)
    })
    
    test('note without content is not added', async () => {
        const newNote = {
            important: true
        }
    
        await api
            .post('/api/notes')
            .send(newNote)
            .expect(400)
    
        const response = await api.get('/api/notes')
    
        expect(response.body).toHaveLength(initialNotes.length)
    
    })
    
    test('a note can be deleted', async () => {
        const { response: firstResponse } = await getAllContentFromNotes()
        const { body: notes } = firstResponse
        const noteToDelete = notes[0]
    
        await api
            .delete(`/api/notes/${noteToDelete.id}`)
            .expect(204)
    
        const { contents, response: secondResponse } = await getAllContentFromNotes()
    
        expect(secondResponse.body).toHaveLength(initialNotes.length - 1)
        expect(contents).not.toContain(noteToDelete.content)
    })
    
    test('a note that do not exist can not be deleted', async () => {
        await api
            .delete(`/api/notes/1234`)
            .expect(400)
    
        const { response } = await getAllContentFromNotes()
    
        expect(response.body).toHaveLength(initialNotes.length)
    })
});

afterAll(() => {
    mongoose.connection.close()
    server.close()
})